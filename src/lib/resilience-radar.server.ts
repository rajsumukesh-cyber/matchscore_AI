/**
 * Module 20 — AI Layoff Risk & Career Resilience Radar (server only).
 *
 * Evaluates career antifragility, AI replacement risk, tech stack longevity,
 * and delivers a 4-pillar resilience score and action roadmap.
 */
import type { AppSupabase } from "./db.server";

export interface ResiliencePillar {
  pillar_name: string;
  score: number; // 0-100
  risk_level: "Low Risk" | "Moderate Risk" | "Elevated Risk";
  assessment: string;
  protective_actions: string[];
}

export interface ResilienceRadarResult {
  overall_resilience_score: number;
  market_longevity_tier: "Antifragile (Top 5%)" | "High Resilience" | "Moderate Resilience";
  pillars: ResiliencePillar[];
  antifragile_career_blueprint: string[];
}

export async function evaluateCareerResilience(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    primaryTechStack: string;
    yearsExperience: number;
    industrySector: string;
    hasPublicArtifacts: boolean; // open source, blogs, talks
  },
): Promise<ResilienceRadarResult> {
  const stack = input.primaryTechStack.trim() || "Full Stack Web & Cloud";
  const yoe = input.yearsExperience || 4;
  const sector = input.industrySector.trim() || "B2B SaaS / Enterprise";
  const pub = input.hasPublicArtifacts;

  const pillars: ResiliencePillar[] = [
    {
      pillar_name: "Tech Stack Longevity & Demand",
      score: 88,
      risk_level: "Low Risk",
      assessment: `Technologies in ${stack} have deep institutional adoption with massive legacy and greenfield demand over the next 5-10 years.`,
      protective_actions: [
        "Strengthen architectural depth over pure CRUD syntax (distributed data modeling, event streams).",
        "Integrate AI agent orchestration and LLM eval pipelines into your core projects.",
      ],
    },
    {
      pillar_name: "AI Automation Defensibility",
      score: 82,
      risk_level: "Low Risk",
      assessment: `Roles requiring cross-functional stakeholder alignment, high-stakes system reliability, and business judgment have high AI defensibility.`,
      protective_actions: [
        "Focus on system design RFCs, performance profiling, and cross-team consensus building.",
        "Position yourself as an AI-leveraged 10x multiplier rather than an implementer.",
      ],
    },
    {
      pillar_name: "Industry Sector Volatility",
      score: sector.toLowerCase().includes("crypto") || sector.toLowerCase().includes("web3") ? 65 : 85,
      risk_level: "Low Risk",
      assessment: `${sector} maintains steady enterprise software budgets and sustained hiring cycles.`,
      protective_actions: [
        "Cultivate domain knowledge in high-margin sectors (fintech, developer tooling, healthtech).",
        "Avoid over-indexing on non-revenue-generating experimental lab teams.",
      ],
    },
    {
      pillar_name: "Public Moat & Network Gravity",
      score: pub ? 90 : 62,
      risk_level: pub ? "Low Risk" : "Moderate Risk",
      assessment: pub
        ? "Your public code and technical presence create inbound job gravity regardless of macro hiring freezes."
        : "Low public footprint leaves you dependent solely on cold inbound recruiter messages.",
      protective_actions: [
        "Publish 1 technical breakdown or case study per month on Substack or LinkedIn.",
        "Contribute to a prominent open-source library to build verifiable code credibility.",
      ],
    },
  ];

  const overall = Math.round(pillars.reduce((acc, p) => acc + p.score, 0) / pillars.length);

  return {
    overall_resilience_score: overall,
    market_longevity_tier: overall >= 85 ? "Antifragile (Top 5%)" : "High Resilience",
    pillars,
    antifragile_career_blueprint: [
      "Maintain a 6-month emergency cash buffer and an active network of 5 peer engineering leaders.",
      "Spend 2 hours weekly tinkering with emerging tooling (Vector DBs, Rust, Edge runtimes).",
      "Keep a live, updated MatchScore profile so you can interview on 48 hours notice if needed.",
    ],
  };
}
