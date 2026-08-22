import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { evaluateJobOffer } from "./offer-evaluator.server";

export const fetchOfferEvaluation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      companyA: string;
      roleA: string;
      baseA: number;
      currencyA: "INR" | "USD";
      bonusA?: number;
      equityA?: number;
      signOnA?: number;
      workModeA: "Remote" | "Hybrid" | "On-site";
      hasOfferB?: boolean;
      companyB?: string;
      roleB?: string;
      baseB?: number;
      currencyB?: "INR" | "USD";
      bonusB?: number;
      equityB?: number;
      signOnB?: number;
      workModeB?: "Remote" | "Hybrid" | "On-site";
    }) => input,
  )
  .handler(async ({ context, data }) =>
    evaluateJobOffer(context.supabase, context.userId, data),
  );
