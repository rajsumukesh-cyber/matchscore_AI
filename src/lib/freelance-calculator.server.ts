/**
 * Module 16 — AI Freelance & Consulting Rate Calculator (server only).
 *
 * Calculates market-calibrated hourly, daily, and retainer consulting rates
 * and generates high-converting client proposals and retainer contracts.
 */
import type { AppSupabase } from "./db.server";

export interface RateBreakdown {
  hourly_rate: number;
  daily_rate: number;
  monthly_retainer_part_time: number; // 20 hrs/week
  monthly_retainer_full_time: number; // 40 hrs/week
  currency: "INR" | "USD";
  effective_annual_revenue: number;
}

export interface FreelanceCalculatorResult {
  role_title: string;
  experience_level: string;
  rates: RateBreakdown;
  pricing_strategy_tips: string[];
  proposal_template: string;
  value_based_pitch: string;
}

export async function calculateFreelanceRates(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    targetRole: string;
    annualFteSalary: number; // in Lakhs (INR) or Thousands (USD)
    currency: "INR" | "USD";
    billableWeeksPerYear?: number;
    billableHoursPerWeek?: number;
  },
): Promise<FreelanceCalculatorResult> {
  const fte = input.annualFteSalary || (input.currency === "INR" ? 30 : 150);
  const weeks = input.billableWeeksPerYear || 44; // factoring 8 weeks for marketing/vacation
  const hours = input.billableHoursPerWeek || 25; // actual billable hours

  // Consulting overhead multiplier: ~1.4x - 1.6x FTE to account for self-employment tax, benefits & downtime
  const overheadMultiplier = 1.5;
  const targetAnnualGross = fte * overheadMultiplier;
  const totalBillableHours = weeks * hours;

  // Base hourly calculation
  let rawHourly = targetAnnualGross / totalBillableHours;
  if (input.currency === "INR") {
    // Convert Lakhs to raw INR
    rawHourly = (targetAnnualGross * 100000) / totalBillableHours;
  } else {
    // Convert Thousands to raw USD
    rawHourly = (targetAnnualGross * 1000) / totalBillableHours;
  }

  const hourlyRounded = Math.round(rawHourly / 5) * 5;
  const dailyRate = hourlyRounded * 8;
  const partTimeMonthly = Math.round(hourlyRounded * 80); // 20 hrs/week * 4 weeks
  const fullTimeMonthly = Math.round(hourlyRounded * 160); // 40 hrs/week * 4 weeks

  const sym = input.currency === "INR" ? "₹" : "$";

  const proposal = `Subject: Proposal: ${input.targetRole} Technical Advisory & Implementation for [Client Organization]

Dear [Client Name],

Thank you for discussing your upcoming technical initiatives with me. Based on our conversation regarding [Client Project/Challenge], I have structured a dedicated engagement proposal to deliver high-velocity, production-grade results.

🎯 Key Deliverables & Scope:
1. Architecture Design & Technical RFC: Establish resilient system contracts and schema design.
2. Production Implementation & Code Delivery: Deliver core milestones with automated unit and integration tests.
3. Knowledge Transfer & Documentation: Run pair-programming sessions and author comprehensive operational runbooks.

💼 Engagement & Investment Options:
• Advisory Retainer (20 hrs/week): ${sym}${partTimeMonthly.toLocaleString()} / month
• Dedicated Sprint (40 hrs/week): ${sym}${fullTimeMonthly.toLocaleString()} / month
• Hourly Deep-Dive Rate: ${sym}${hourlyRounded.toLocaleString()} / hour

I have availability starting [Target Start Date]. Let me know if you would like to schedule a brief 15-minute call to finalize our kickoff timeline!

Best regards,
Consultant`;

  return {
    role_title: input.targetRole || "Senior Technical Consultant",
    experience_level: "Senior / Principal",
    rates: {
      hourly_rate: hourlyRounded,
      daily_rate: dailyRate,
      monthly_retainer_part_time: partTimeMonthly,
      monthly_retainer_full_time: fullTimeMonthly,
      currency: input.currency,
      effective_annual_revenue: Math.round(targetAnnualGross),
    },
    pricing_strategy_tips: [
      `Never quote hourly rates for fixed-scope projects: shift clients toward weekly or monthly retainers to decouple your income from time spent.`,
      `Offer a 10% prepayment discount for clients willing to book a 3-month or 6-month advisory retainer upfront.`,
      `Position your rate around ROI: frame your ${sym}${hourlyRounded}/hr fee against the potential cost of system outages or delayed product launches.`,
    ],
    proposal_template: proposal,
    value_based_pitch: `"Rather than billing for raw code hours, my engagement focuses on de-risking your core architecture, accelerating your development cycle by 30%, and ensuring your platform handles peak load without downtime."`,
  };
}
