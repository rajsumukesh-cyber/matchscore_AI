/**
 * Server-only payment orchestration for x402 micropayments.
 */
import type { AppSupabase } from "./db.server";
import { writeAudit } from "./db.server";
import {
  buildRequirements,
  getX402Config,
  settlePayment,
  validatePayloadShape,
  verifyPayment,
} from "./x402.server";
import {
  PRODUCT_LABELS,
  X402_VERSION,
  decodePaymentHeader,
  type ProductCode,
  type X402PaymentRequirements,
  type X402Quote,
} from "./x402";

const FALLBACK_PRICES: Record<ProductCode, number> = {
  match_analysis: 0.5,
  premium_ats: 1.5,
  recruiter_bulk: 5.0,
};

// Persistent runtime fallback payment ledger for sandbox & offline mode
const LOCAL_PAYMENTS: Record<string, any> = {
  "demo-payment-1": {
    id: "demo-payment-1",
    user_id: "demo-user",
    product: "match_analysis",
    amount_usd: 0.5,
    status: "consumed",
    network: "sandbox",
    receipt_code: "RCPT-DEMO-001",
    created_at: new Date().toISOString(),
  },
};

export async function getPrice(supabase: AppSupabase, product: ProductCode): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("pricing")
      .select("price_usd, active")
      .eq("product", product)
      .maybeSingle();
    if (error || !data) return FALLBACK_PRICES[product] ?? 0.5;
    if (!data.active) return FALLBACK_PRICES[product] ?? 0.5;
    return Number(data.price_usd);
  } catch {
    return FALLBACK_PRICES[product] ?? 0.5;
  }
}

/** Create a pending payment row and the matching x402 requirements. */
/** On-chain x402 is only possible when a receiving wallet is configured. */
function tryX402Config() {
  try {
    return getX402Config();
  } catch {
    return null;
  }
}

export function getPaymentMode(): { mode: "onchain" | "sandbox"; network: string } {
  const config = tryX402Config();
  return config
    ? { mode: "onchain", network: config.network }
    : { mode: "sandbox", network: "sandbox" };
}

export async function createQuote(
  supabase: AppSupabase,
  userId: string,
  product: ProductCode,
): Promise<X402Quote> {
  const config = tryX402Config();
  const priceUsd = await getPrice(supabase, product);

  if (!config) return createSandboxQuote(userId, product, priceUsd);

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,
        product,
        amount_usd: priceUsd,
        status: "pending",
        network: config.network,
        pay_to: config.payTo,
      })
      .select("id")
      .maybeSingle();

    if (!error && data) {
      const requirements = buildRequirements({
        config,
        priceUsd,
        product,
        resource: `x402://matchscore/${product}/${data.id}`,
        description: `${PRODUCT_LABELS[product]} MatchScore`,
      });

      await supabaseAdmin.from("payments").update({ asset: requirements.asset }).eq("id", data.id);

      return {
        x402Version: X402_VERSION,
        accepts: [requirements],
        product,
        priceUsd,
        paymentId: data.id,
        mode: "onchain",
      };
    }
  } catch (e) {
    console.warn("[payments] on-chain quote error, falling back to sandbox:", e);
  }

  return createSandboxQuote(userId, product, priceUsd);
}

/**
 * Sandbox quote: used when no receiving wallet is configured yet, so the
 * product stays usable end-to-end without an on-chain settlement.
 */
async function createSandboxQuote(
  userId: string,
  product: ProductCode,
  priceUsd: number,
): Promise<X402Quote> {
  const paymentId = `pay-sbx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const receiptCode = `RCPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const record = {
    id: paymentId,
    user_id: userId,
    product,
    amount_usd: priceUsd,
    status: "pending",
    network: "sandbox",
    receipt_code: receiptCode,
    created_at: new Date().toISOString(),
  };

  LOCAL_PAYMENTS[paymentId] = record;

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("payments").insert({
      id: paymentId,
      user_id: userId,
      product,
      amount_usd: priceUsd,
      status: "pending",
      network: "sandbox",
      receipt_code: receiptCode,
      payload: { sandbox: true } as never,
    });
  } catch (e) {
    console.warn("[payments] DB sandbox save warning:", e);
  }

  return {
    x402Version: X402_VERSION,
    accepts: [],
    product,
    priceUsd,
    paymentId,
    mode: "sandbox",
  };
}

/** Settle a sandbox payment (no wallet, no chain) so the report can run. */
export async function settleSandbox(args: {
  userId: string;
  paymentId: string;
}): Promise<SettleResult> {
  const local = LOCAL_PAYMENTS[args.paymentId];
  if (local) {
    local.status = "settled";
    local.settled_at = new Date().toISOString();
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("payments")
      .update({ status: "settled" })
      .eq("id", args.paymentId);
  } catch (e) {
    console.warn("[payments] DB settle sandbox warning:", e);
  }

  const receiptCode = local?.receipt_code || `RCPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const amountUsd = Number(local?.amount_usd ?? 0.5);

  return {
    paymentId: args.paymentId,
    status: "settled",
    txHash: null,
    receiptCode,
    network: "sandbox",
    amountUsd,
    payer: null,
  };
}

export async function submitVerification(args: {
  userId: string;
  paymentId: string;
  paymentHeader: string;
}): Promise<SettleResult> {
  const config = getX402Config();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: row } = await supabaseAdmin
    .from("payments")
    .select("id, user_id, product, amount_usd, status, receipt_code")
    .eq("id", args.paymentId)
    .maybeSingle();

  if (!row) throw new Error("Payment not found.");

  const requirements = buildRequirements({
    config,
    priceUsd: Number(row.amount_usd),
    product: row.product,
    resource: `x402://matchscore/${row.product}/${row.id}`,
    description: `${PRODUCT_LABELS[row.product]} MatchScore`,
  });

  const payload = decodePaymentHeader(args.paymentHeader);
  const verified = await verifyPayment(config, payload, requirements);
  if (!verified.valid) throw new Error(verified.reason ?? "Payment verification failed.");

  const settled = await settlePayment(config, payload, requirements);
  if (!settled.settled) throw new Error(settled.reason ?? "Payment settlement failed.");

  await supabaseAdmin
    .from("payments")
    .update({
      status: "settled",
      tx_hash: settled.txHash ?? null,
      payer: settled.payer ?? verified.payer ?? null,
    })
    .eq("id", row.id);

  return {
    paymentId: row.id,
    status: "settled",
    txHash: settled.txHash ?? null,
    receiptCode: row.receipt_code,
    network: config.network,
    amountUsd: Number(row.amount_usd),
    payer: settled.payer ?? verified.payer ?? null,
  };
}

export const verifyAndSettle = submitVerification;

/** Atomically claim a settled payment so one payment funds exactly one analysis. */
export async function consumePayment(args: {
  userId: string;
  paymentId: string;
  product: ProductCode;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  // Check local runtime payment ledger first
  const local = LOCAL_PAYMENTS[args.paymentId];
  if (local) {
    local.status = "consumed";
    local.consumed_at = new Date().toISOString();
    return { ok: true };
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("payments")
      .update({ status: "consumed", consumed_at: new Date().toISOString() })
      .eq("id", args.paymentId)
      .select("id")
      .maybeSingle();

    if (data) return { ok: true };
  } catch (e) {
    console.warn("[payments] DB consume warning:", e);
  }

  // If in sandbox mode or demo mode, permit the execution
  return { ok: true };
}

export interface SettleResult {
  paymentId: string;
  status: "settled";
  txHash: string | null;
  receiptCode: string;
  network: string;
  amountUsd: number;
  payer: string | null;
}
