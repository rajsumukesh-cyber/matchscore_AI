/**
 * Module 19 — AI Reverse Interviewer & Company Due Diligence Toolkit (server only).
 *
 * Generates high-conviction reverse interview questions for candidates to ask
 * hiring managers, staff peers, and VP/CTO leadership to detect red flags and culture fit.
 */
import type { AppSupabase } from "./db.server";

export interface ReverseQuestionCategory {
  interviewer_type: "Hiring Manager / Engineering Director" | "Senior / Staff Engineer Peer" | "VP of Engineering / CTO";
  questions: {
    question: string;
    what_to_listen_for: string;
    red_flag_response: string;
  }[];
}

export interface ReverseInterviewResult {
  company_name: string;
  target_role: string;
  categories: ReverseQuestionCategory[];
  due_diligence_checklist: string[];
}

export async function generateReverseInterview(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    companyName: string;
    targetRole: string;
    companyStage?: string | null;
  },
): Promise<ReverseInterviewResult> {
  const company = input.companyName.trim() || "Target Organization";
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const stage = input.companyStage?.trim() || "Series B - High Growth Scaleup";

  const categories: ReverseQuestionCategory[] = [
    {
      interviewer_type: "Hiring Manager / Engineering Director",
      questions: [
        {
          question: `How does the engineering team balance product feature velocity with technical debt and architectural refactoring in sprint planning?`,
          what_to_listen_for: `A structured allocation (e.g. 20% dedicated time for tech debt) and mutual respect between product and engineering.`,
          red_flag_response: `"We build features as fast as possible now and we'll fix the code later when we have more runway."`,
        },
        {
          question: `What would success look like for me in this role at 90 days, and what is the single biggest bottleneck that could prevent me from achieving it?`,
          what_to_listen_for: `Clear, measurable expectations and candid awareness of internal team roadblocks.`,
          red_flag_response: `"We haven't defined the exact projects yet; you'll just jump in and help wherever things are broken."`,
        },
      ],
    },
    {
      interviewer_type: "Senior / Staff Engineer Peer",
      questions: [
        {
          question: `What was the last major production incident or Sev-1 outage, and how did the team handle the post-mortem and remediation?`,
          what_to_listen_for: `A blameless post-mortem culture, automated telemetry, and preventative CI/CD guardrails.`,
          red_flag_response: `"People got blamed or yelled at, and we added manual manager approval steps before deployments."`,
        },
        {
          question: `How frequently do engineers ship code to production, and what does the local-to-production CI/CD feedback loop feel like?`,
          what_to_listen_for: `Multiple deploys per day or week with fast automated test suites (<15 min).`,
          red_flag_response: `"Deployments happen once a month at midnight and require 4 manual verification checklists."`,
        },
      ],
    },
    {
      interviewer_type: "VP of Engineering / CTO",
      questions: [
        {
          question: `Given current macroeconomic climate and AI shifts, what is ${company}'s 2-year technical moat and engineering headcount strategy?`,
          what_to_listen_for: `Disciplined financial runway (>24 months), strategic proprietary data advantages, and sustainable hiring plans.`,
          red_flag_response: `Vague buzzword answers or uncertainty around profitability timelines and cash burn.`,
        },
      ],
    },
  ];

  return {
    company_name: company,
    target_role: role,
    categories,
    due_diligence_checklist: [
      `Check Glassdoor & Blind for recurring mentions of crunch time, sudden leadership turnover, or silent PIP quotas.`,
      `Inspect LinkedIn employee tenure for the engineering team: average tenure >2 years indicates healthy retention.`,
      `Verify Crunchbase for latest funding round date and estimated cash runway for ${stage}.`,
    ],
  };
}
