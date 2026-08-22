/**
 * Module 11 — 30-60-90 Day Executive Onboarding Plan Generator (server only).
 *
 * Generates an interview-ready, strategic 30-60-90 day plan
 * that candidates present in final rounds to demonstrate Day-1 leadership.
 */
import type { AppSupabase } from "./db.server";

export interface OnboardingPhase {
  phase: "Days 1-30 (Listen & Learn)" | "Days 31-60 (Align & Optimize)" | "Days 61-90 (Lead & Scale)";
  theme: string;
  key_objectives: string[];
  deliverables: string[];
  stakeholder_milestone: string;
}

export interface OnboardingPlanResult {
  candidate_name: string;
  target_role: string;
  company_name: string;
  executive_summary: string;
  phases: OnboardingPhase[];
  interview_pitch: string;
}

export async function generateOnboardingPlan(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    targetRole: string;
    companyName: string;
    coreDomain: string;
  },
): Promise<OnboardingPlanResult> {
  const name = input.candidateName.trim() || "Candidate";
  const role = input.targetRole.trim() || "Senior Staff Engineer";
  const company = input.companyName.trim() || "the organization";
  const domain = input.coreDomain.trim() || "Full Stack Engineering & Cloud Architecture";

  const phases: OnboardingPhase[] = [
    {
      phase: "Days 1-30 (Listen & Learn)",
      theme: "Immersion, Stakeholder Discovery, and Technical Audit",
      key_objectives: [
        "Complete deep-dive onboarding on codebase architecture, deployment pipelines, and observability tools.",
        "Conduct 1-on-1 discovery interviews with engineering managers, product managers, and key ICs to map team bottlenecks.",
        "Ship a first low-risk bug fix or documentation enhancement to master the production deployment workflow.",
        "Audit existing system latency, test coverage metrics, and on-call runbooks.",
      ],
      deliverables: [
        "Architecture & Pain Points Map documented in Notion/Confluence.",
        "First production PR successfully reviewed and merged.",
        "Completed 30-day alignment check-in with the Engineering Director.",
      ],
      stakeholder_milestone: "Establish trust across immediate squad and engineering peers.",
    },
    {
      phase: "Days 31-60 (Align & Optimize)",
      theme: "Process Optimization, Quick-Win Execution, and Feature Ownership",
      key_objectives: [
        "Take end-to-end technical ownership of a primary roadmap feature or microservice.",
        "Identify and implement 2 quick-win optimizations (e.g. reducing build times by 20% or optimizing database queries).",
        "Participate in sprint planning, technical design reviews (RFCs), and active code reviews.",
        "Join the on-call rotation as a shadow engineer to understand live operational challenges.",
      ],
      deliverables: [
        "Delivered first major technical initiative on the quarterly roadmap.",
        "Authored an RFC proposal for architectural improvements in domain.",
        "60-day performance alignment review with team lead.",
      ],
      stakeholder_milestone: "Recognized as a reliable, self-sufficient contributor delivering roadmap value.",
    },
    {
      phase: "Days 61-90 (Lead & Scale)",
      theme: "Autonomous Leadership, Cross-Team Impact, and Strategic Initiatives",
      key_objectives: [
        "Lead the architectural roadmap for a key strategic initiative across multiple sprints.",
        "Mentor 2 junior or mid-level engineers through pair programming and structured feedback.",
        "Contribute to engineering-wide best practices (testing guidelines, API contracts, security reviews).",
        "Collaborate with Product and Design leaders to plan the upcoming quarter's technical OKRs.",
      ],
      deliverables: [
        "Shipped a core revenue-driving or latency-critical product milestone.",
        "Mentorship framework & tech talk delivered to the broader engineering team.",
        "Comprehensive 90-day review presentation outlining forward-looking roadmap for next 6 months.",
      ],
      stakeholder_milestone: "Positioned as a strategic technical leader with high cross-functional influence.",
    },
  ];

  return {
    candidate_name: name,
    target_role: role,
    company_name: company,
    executive_summary: `This 30-60-90 Day Plan outlines a structured, high-impact roadmap for ${name} stepping into the ${role} position at ${company}. Designed to minimize ramp-up time, deliver immediate measurable value, and establish long-term engineering excellence.`,
    phases,
    interview_pitch: `"In my first 30 days, my primary focus is deep technical listening and mapping our team's operational friction points. By day 60, I expect to deliver our first major roadmap milestone and optimize our core bottlenecks. By day 90, I will be driving strategic architecture initiatives, mentoring teammates, and collaborating with Product to define our upcoming OKRs."`,
  };
}
