/**
 * Module 6 — AI Salary & Market Value Benchmark Predictor (server only).
 */
import type { AppSupabase } from "./db.server";

export interface SkillBoost {
  skill: string;
  annual_boost_inr: string;
  annual_boost_usd: string;
  demand_level: "Ultra High" | "High" | "Moderate";
}

export interface CompanyBenchmark {
  company: string;
  tier: "Tier 1 Big Tech" | "High-Growth Unicorn" | "Enterprise Product";
  compensation_range_inr: string;
  compensation_range_usd: string;
  top_demanded_skills: string[];
}

export interface SalaryBenchmarkResult {
  target_role: string;
  experience_level: string;
  base_salary_inr: { min: string; median: string; max: string };
  base_salary_usd: { min: string; median: string; max: string };
  expected_bonus_inr: string;
  expected_equity_inr: string;
  market_percentile: number;
  skill_boosts: SkillBoost[];
  top_paying_companies: CompanyBenchmark[];
  negotiation_strategy: {
    recommended_target: string;
    key_leverage_points: string[];
    negotiation_email_script: string;
  };
}

export async function predictSalaryBenchmark(
  supabase: AppSupabase,
  userId: string,
  input: {
    targetRole: string;
    experienceYears?: number | string | null;
    primarySkills?: string | null;
  },
): Promise<SalaryBenchmarkResult> {
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const years = Number(input.experienceYears) || 5;

  let baseMinInr = 18;
  let baseMedInr = 28;
  let baseMaxInr = 42;

  let baseMinUsd = 100;
  let baseMedUsd = 145;
  let baseMaxUsd = 195;

  if (years >= 8) {
    baseMinInr = 35;
    baseMedInr = 52;
    baseMaxInr = 75;
    baseMinUsd = 160;
    baseMedUsd = 210;
    baseMaxUsd = 280;
  } else if (years <= 2) {
    baseMinInr = 9;
    baseMedInr = 15;
    baseMaxInr = 22;
    baseMinUsd = 75;
    baseMedUsd = 95;
    baseMaxUsd = 120;
  }

  const roleLower = role.toLowerCase();
  if (roleLower.includes("ai") || roleLower.includes("machine learning") || roleLower.includes("architect")) {
    baseMinInr = Math.round(baseMinInr * 1.3);
    baseMedInr = Math.round(baseMedInr * 1.3);
    baseMaxInr = Math.round(baseMaxInr * 1.3);
    baseMinUsd = Math.round(baseMinUsd * 1.25);
    baseMedUsd = Math.round(baseMedUsd * 1.25);
    baseMaxUsd = Math.round(baseMaxUsd * 1.25);
  }

  return {
    target_role: role,
    experience_level: `${years}+ Years Experience`,
    base_salary_inr: {
      min: `₹${baseMinInr} Lakhs`,
      median: `₹${baseMedInr} Lakhs`,
      max: `₹${baseMaxInr} Lakhs`,
    },
    base_salary_usd: {
      min: `$${baseMinUsd},000`,
      median: `$${baseMedUsd},000`,
      max: `$${baseMaxUsd},000`,
    },
    expected_bonus_inr: `₹${Math.round(baseMedInr * 0.15)} - ₹${Math.round(baseMedInr * 0.25)} Lakhs (15-25%)`,
    expected_equity_inr: `₹${Math.round(baseMedInr * 0.3)} - ₹${Math.round(baseMedInr * 0.6)} Lakhs / year in RSUs`,
    market_percentile: 86,
    skill_boosts: [
      {
        skill: "Distributed System Design & Redis",
        annual_boost_inr: "+₹4.5 - 6.0 Lakhs/yr",
        annual_boost_usd: "+$18,000 - 25,000/yr",
        demand_level: "Ultra High",
      },
      {
        skill: "Generative AI / RAG & Vector Databases",
        annual_boost_inr: "+₹6.0 - 9.0 Lakhs/yr",
        annual_boost_usd: "+$25,000 - 35,000/yr",
        demand_level: "Ultra High",
      },
      {
        skill: "Kubernetes & Cloud Infrastructure (AWS/GCP)",
        annual_boost_inr: "+₹3.5 - 5.0 Lakhs/yr",
        annual_boost_usd: "+$15,000 - 20,000/yr",
        demand_level: "High",
      },
      {
        skill: "Automated E2E Testing (Playwright/CI/CD)",
        annual_boost_inr: "+₹2.5 - 3.5 Lakhs/yr",
        annual_boost_usd: "+$10,000 - 15,000/yr",
        demand_level: "High",
      },
    ],
    top_paying_companies: [
      {
        company: "Stripe / Uber / Google",
        tier: "Tier 1 Big Tech",
        compensation_range_inr: "₹45L - ₹75L Base + RSUs",
        compensation_range_usd: "$190k - $275k Base + Equity",
        top_demanded_skills: ["Distributed Caching", "System Architecture", "TypeScript/Go"],
      },
      {
        company: "Razorpay / Swiggy / Zepto",
        tier: "High-Growth Unicorn",
        compensation_range_inr: "₹35L - ₹55L Total CTC",
        compensation_range_usd: "$140k - $190k Equivalent",
        top_demanded_skills: ["High Concurrency", "PostgreSQL Tuning", "Kafka/Redis"],
      },
      {
        company: "Atlassian / Microsoft / Adobe",
        tier: "Enterprise Product",
        compensation_range_inr: "₹38L - ₹60L Total CTC",
        compensation_range_usd: "$160k - $220k Base + Bonus",
        top_demanded_skills: ["Microservices", "Cloud Reliability", "CI/CD Automation"],
      },
    ],
    negotiation_strategy: {
      recommended_target: `Target the upper quartile: ₹${baseMedInr + 6} - ₹${baseMaxInr} Lakhs ($${baseMedUsd + 20}k - $${baseMaxUsd}k).`,
      key_leverage_points: [
        "Cite specific architectural achievements and quantified latency reductions from past roles.",
        "Highlight your cross-functional capability across full-stack and cloud delivery pipelines.",
        "Demonstrate mastery of modern high-demand stacks (TypeScript, Next.js, Redis, CI/CD).",
      ],
      negotiation_email_script: `Dear Hiring Team,\n\nThank you for extending the offer for the ${role} position. I am very enthusiastic about the team's roadmap and confident that my hands-on background in scalable architecture, automated testing, and full-lifecycle delivery will create immediate impact.\n\nBased on current market benchmarks for candidates with proven competency across our core stack, I was targeting a base compensation of ₹${baseMedInr + 6} Lakhs ($${baseMedUsd + 20}k). With this adjustment, I would be thrilled to sign and accept immediately.\n\nThank you again for your consideration, and I look forward to working together!\n\nBest regards,`,
    },
  };
}
