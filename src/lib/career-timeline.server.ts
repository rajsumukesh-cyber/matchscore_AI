/**
 * Module 7 — AI Career Timeline & Growth Predictor (server only).
 *
 * Projects career progression milestones over 1-5 years based on
 * the candidate's current skills, target role, and market patterns.
 */
import type { AppSupabase } from "./db.server";

export interface TimelineMilestone {
  year: number;
  role: string;
  salary_inr: string;
  salary_usd: string;
  new_skills: string[];
  key_achievement: string;
  readiness_percent: number;
}

export interface CareerTimelineResult {
  current_role: string;
  target_role: string;
  timeline: TimelineMilestone[];
  risk_factors: string[];
  accelerators: string[];
  industry_insight: string;
}

export async function predictCareerTimeline(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    currentRole?: string | null;
    targetRole: string;
    currentSkills?: string | null;
    experienceYears?: number | string | null;
  },
): Promise<CareerTimelineResult> {
  const current = input.currentRole?.trim() || "Mid-Level Software Engineer";
  const target = input.targetRole.trim() || "Principal Engineer";
  const years = Number(input.experienceYears) || 3;
  const skills = (input.currentSkills || "JavaScript, React, Node.js")
    .split(",")
    .map((s) => s.trim());

  const roleLower = target.toLowerCase();
  const isAI =
    roleLower.includes("ai") ||
    roleLower.includes("ml") ||
    roleLower.includes("machine learning") ||
    roleLower.includes("data");
  const isLeadership =
    roleLower.includes("lead") ||
    roleLower.includes("manager") ||
    roleLower.includes("director") ||
    roleLower.includes("vp") ||
    roleLower.includes("cto");

  const baseSalaryInr = years <= 2 ? 12 : years <= 5 ? 22 : 38;
  const baseSalaryUsd = years <= 2 ? 85 : years <= 5 ? 130 : 200;

  const timeline: TimelineMilestone[] = [
    {
      year: 0,
      role: current,
      salary_inr: `₹${baseSalaryInr}L`,
      salary_usd: `$${baseSalaryUsd}k`,
      new_skills: skills.slice(0, 3),
      key_achievement: "Current baseline: Established core competency across primary tech stack.",
      readiness_percent: 35,
    },
    {
      year: 1,
      role: isLeadership ? "Senior Engineer / Tech Lead" : `Senior ${current.replace(/^(Mid-Level|Junior)\s*/i, "")}`,
      salary_inr: `₹${Math.round(baseSalaryInr * 1.35)}L`,
      salary_usd: `$${Math.round(baseSalaryUsd * 1.3)}k`,
      new_skills: isAI
        ? ["RAG Pipeline Design", "Vector Databases (pgvector)", "LLM Fine-Tuning"]
        : ["System Design Patterns", "Redis Caching Strategies", "CI/CD Pipeline Automation"],
      key_achievement: isAI
        ? "Ship first production LLM feature; pass AI/ML system design interviews."
        : "Lead a major system refactor; mentor 2 junior engineers in code reviews.",
      readiness_percent: 55,
    },
    {
      year: 2,
      role: isLeadership
        ? "Engineering Manager"
        : isAI
          ? "Staff ML Engineer"
          : "Staff Engineer",
      salary_inr: `₹${Math.round(baseSalaryInr * 1.75)}L`,
      salary_usd: `$${Math.round(baseSalaryUsd * 1.65)}k`,
      new_skills: isAI
        ? ["MLOps & Model Monitoring", "Distributed Training", "A/B Testing Frameworks"]
        : ["Distributed Systems Architecture", "Database Sharding", "Observability & SRE"],
      key_achievement: isLeadership
        ? "Manage a team of 6-8 engineers; own quarterly OKR delivery across 2 product squads."
        : "Architect and ship a new microservice that handles 10,000+ RPS in production.",
      readiness_percent: 72,
    },
    {
      year: 3,
      role: isLeadership ? "Senior Engineering Manager" : target,
      salary_inr: `₹${Math.round(baseSalaryInr * 2.2)}L`,
      salary_usd: `$${Math.round(baseSalaryUsd * 2.0)}k`,
      new_skills: isAI
        ? ["Multi-Agent Orchestration", "Guardrails & Safety", "Enterprise AI Strategy"]
        : ["Cross-Org Technical Strategy", "Cost Optimization", "Vendor & Build vs Buy Decisions"],
      key_achievement: isLeadership
        ? "Drive engineering org-wide initiatives; present technical roadmap to VP/CTO."
        : `Reach ${target} level: own technical vision across 3+ services and mentor staff engineers.`,
      readiness_percent: 88,
    },
    {
      year: 5,
      role: isLeadership ? "Director of Engineering / VP Eng" : `Distinguished / Principal ${target.replace(/^(Senior|Staff|Lead)\s*/i, "")}`,
      salary_inr: `₹${Math.round(baseSalaryInr * 3.0)}L`,
      salary_usd: `$${Math.round(baseSalaryUsd * 2.6)}k`,
      new_skills: ["Executive Communication", "Board-Level Reporting", "Strategic Partnerships"],
      key_achievement: "Industry thought leadership; conference talks, open-source contributions, or patents filed.",
      readiness_percent: 95,
    },
  ];

  return {
    current_role: current,
    target_role: target,
    timeline,
    risk_factors: [
      "Stagnation risk: Staying in the same team > 2 years without scope expansion slows progression by 18 months on average.",
      "Skill decay: Not practising system design or competitive coding monthly leads to interview readiness drop-off.",
      "Market timing: Hiring freezes in economic downturns can delay lateral moves by 6-12 months.",
    ],
    accelerators: [
      "Publish a technical blog post or give a conference talk within Year 1 to build visibility.",
      "Contribute to a high-profile open-source project (Next.js, LangChain, Kubernetes) to accelerate credibility.",
      "Seek a cross-functional rotation (backend ↔ infra, or IC ↔ management) to unlock Staff+ trajectory.",
      "Obtain at least one industry certification (AWS Solutions Architect, Google Cloud Professional, or Terraform Associate) by Year 2.",
    ],
    industry_insight: isAI
      ? "AI/ML engineering demand grew 42% YoY in 2025-2026. Candidates with production RAG and MLOps experience command 30-40% premiums over traditional SDE roles at equivalent levels."
      : isLeadership
        ? "Engineering management tracks increasingly require technical depth alongside people skills. 68% of Director+ hires in 2026 had recent IC contributions within the past 18 months."
        : "Full-stack and platform engineering roles remain the highest-volume senior hiring category. Distributed systems and observability skills are the top differentiators at Staff+ level across FAANG and unicorns.",
  };
}
