/**
 * Module 12 — Offer Evaluator & Equity/Comp Package Analyzer (server only).
 *
 * Compares job offers side-by-side, evaluates base + equity + bonus + benefits,
 * and generates custom counter-offer letters and negotiation leverage points.
 */
import type { AppSupabase } from "./db.server";

export interface OfferDetails {
  company_name: string;
  role_title: string;
  base_salary: number; // in Lakhs (INR) or Thousands (USD)
  currency: "INR" | "USD";
  annual_bonus_percent: number;
  equity_value_annual: number;
  sign_on_bonus: number;
  remote_flexibility: "Remote" | "Hybrid" | "On-site";
  total_year_1_comp: number;
}

export interface OfferEvaluationResult {
  offer_a: OfferDetails;
  offer_b?: OfferDetails | null;
  winner?: "Offer A" | "Offer B" | "Offer A (Single)" | null;
  overall_verdict: string;
  financial_breakdown: {
    guaranteed_cash_a: number;
    guaranteed_cash_b?: number;
    upside_potential_a: number;
    upside_potential_b?: number;
  };
  counter_offer_letter: string;
  negotiation_leverage_points: string[];
}

export async function evaluateJobOffer(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    companyA: string;
    roleA: string;
    baseA: number;
    currencyA: "INR" | "USD";
    bonusA?: number;
    equityA?: number;
    signOnA?: number;
    workModeA: "Remote" | "Hybrid" | "On-site";
    // Optional Offer B
    hasOfferB?: boolean;
    companyB?: string;
    roleB?: string;
    baseB?: number;
    currencyB?: "INR" | "USD";
    bonusB?: number;
    equityB?: number;
    signOnB?: number;
    workModeB?: "Remote" | "Hybrid" | "On-site";
  },
): Promise<OfferEvaluationResult> {
  const bonusValA = (input.baseA * (input.bonusA || 0)) / 100;
  const totalA = input.baseA + bonusValA + (input.equityA || 0) + (input.signOnA || 0);

  const offerA: OfferDetails = {
    company_name: input.companyA || "Company A",
    role_title: input.roleA || "Senior Engineer",
    base_salary: input.baseA,
    currency: input.currencyA,
    annual_bonus_percent: input.bonusA || 0,
    equity_value_annual: input.equityA || 0,
    sign_on_bonus: input.signOnA || 0,
    remote_flexibility: input.workModeA,
    total_year_1_comp: Math.round(totalA),
  };

  let offerB: OfferDetails | null = null;
  let winner: "Offer A" | "Offer B" | "Offer A (Single)" = "Offer A (Single)";

  if (input.hasOfferB && input.companyB && input.baseB) {
    const bonusValB = (input.baseB * (input.bonusB || 0)) / 100;
    const totalB = input.baseB + bonusValB + (input.equityB || 0) + (input.signOnB || 0);

    offerB = {
      company_name: input.companyB,
      role_title: input.roleB || "Senior Engineer",
      base_salary: input.baseB,
      currency: input.currencyB || "INR",
      annual_bonus_percent: input.bonusB || 0,
      equity_value_annual: input.equityB || 0,
      sign_on_bonus: input.signOnB || 0,
      remote_flexibility: input.workModeB || "Hybrid",
      total_year_1_comp: Math.round(totalB),
    };

    winner = totalA >= totalB ? "Offer A" : "Offer B";
  }

  const symbol = input.currencyA === "INR" ? "₹" : "$";
  const unit = input.currencyA === "INR" ? "L" : "k";

  const targetCompany = offerB && winner === "Offer B" ? offerB.company_name : offerA.company_name;
  const targetRole = offerB && winner === "Offer B" ? offerB.role_title : offerA.role_title;
  const currentBase = offerB && winner === "Offer B" ? offerB.base_salary : offerA.base_salary;
  const proposedBase = Math.round(currentBase * 1.15);

  const counterLetter = `Dear ${targetCompany} Hiring Team,

Thank you so much for extending the offer for the ${targetRole} position. I am genuinely excited about the team's mission, technical challenges, and roadmap ahead.

After reviewing the full compensation package (${symbol}${currentBase}${unit} base + benefits), I am eager to accept. However, based on my specialized experience and current market benchmarks for equivalent ${targetRole} positions, I would like to discuss whether we can adjust the base salary to ${symbol}${proposedBase}${unit}.

If we are able to reach this number, I am prepared to sign the offer immediately and begin transitioning toward my start date.

Thank you again for your time, partnership, and enthusiasm throughout the interview process. I look forward to your thoughts!

Best regards,
Candidate`;

  return {
    offer_a: offerA,
    offer_b: offerB,
    winner,
    overall_verdict: offerB
      ? `${winner === "Offer A" ? offerA.company_name : offerB.company_name} offers the stronger Year 1 Total Comp package by a margin of ${Math.abs(offerA.total_year_1_comp - offerB.total_year_1_comp)}${unit}. Factor in remote flexibility and equity vesting terms when making your final decision.`
      : `${offerA.company_name}'s offer delivers a healthy Year 1 Total Compensation of ${symbol}${offerA.total_year_1_comp}${unit}. We recommend counter-offering for a 12-15% increase in base salary or an additional sign-on bonus before signing.`,
    financial_breakdown: {
      guaranteed_cash_a: offerA.base_salary + offerA.sign_on_bonus,
      guaranteed_cash_b: offerB ? offerB.base_salary + offerB.sign_on_bonus : undefined,
      upside_potential_a: offerA.equity_value_annual + (offerA.base_salary * offerA.annual_bonus_percent) / 100,
      upside_potential_b: offerB ? offerB.equity_value_annual + (offerB.base_salary * offerB.annual_bonus_percent) / 100 : undefined,
    },
    counter_offer_letter: counterLetter,
    negotiation_leverage_points: [
      `Anchor your value to quantified past impact: cite how your domain expertise will de-risk delivery in the first 90 days.`,
      `Request a sign-on bonus as a flexible compromise if the team has strict base-salary band constraints.`,
      `Inquire about the equity vesting cliff (e.g. 1-year cliff vs quarterly vesting) and refresh grants.`,
      `Negotiate additional perks: home office stipend, annual learning budget, or flexible remote days.`,
    ],
  };
}
