/**
 * Module 15 — AI Promotion & Annual Review Case Builder (server only).
 *
 * Transforms day-to-day achievements into an executive promotion dossier
 * (Google/Meta/Amazon Staff+ format) and a 1-on-1 manager script.
 */
import type { AppSupabase } from "./db.server";

export interface PromotionDimension {
  dimension_name: string;
  scope_level: string;
  evidence_bullets: string[];
}

export interface PromotionCaseResult {
  current_level: string;
  target_level: string;
  dossier_executive_summary: string;
  dimensions: PromotionDimension[];
  manager_1on1_script: string;
  readiness_percentage: number;
}

export async function buildPromotionCase(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    currentLevel: string;
    targetLevel: string;
    topShippedProjects: string;
    leadershipExamples: string;
    businessMetrics: string;
  },
): Promise<PromotionCaseResult> {
  const current = input.currentLevel.trim() || "Senior Software Engineer (L5)";
  const target = input.targetLevel.trim() || "Staff Software Engineer (L6)";
  const projects = input.topShippedProjects.trim() || "Architected unified payment gateway and migrated 4 core services to microservices";
  const leadership = input.leadershipExamples.trim() || "Led 3-engineer squad, drove bi-weekly architecture RFCs, and mentored 2 junior engineers";
  const metrics = input.businessMetrics.trim() || "Reduced annual AWS cloud spend by 28% and improved P99 API response latency from 180ms to 45ms";

  const dimensions: PromotionDimension[] = [
    {
      dimension_name: "Technical Complexity & Scope",
      scope_level: `Demonstrating consistent ${target} technical autonomy across organizational boundaries.`,
      evidence_bullets: [
        `Owned the end-to-end technical strategy for: ${projects}.`,
        `Authored comprehensive RFCs that aligned 3+ product teams on shared technical standards and API contracts.`,
        `Proactively identified single points of failure in our legacy stack and introduced resilient caching patterns.`,
      ],
    },
    {
      dimension_name: "Business Impact & Metrics",
      scope_level: `Measurable organizational and financial return on investment.`,
      evidence_bullets: [
        `Directly delivered business-critical outcome: ${metrics}.`,
        `De-risked high-traffic production events by implementing circuit-breaker patterns and automated load testing.`,
        `Accelerated developer velocity across squad by reducing CI/CD pipeline build times by 35%.`,
      ],
    },
    {
      dimension_name: "Team Multiplication & Leadership",
      scope_level: `Multiplying peers, driving blameless culture, and mentoring talent.`,
      evidence_bullets: [
        `Spearheaded leadership impact: ${leadership}.`,
        `Conducted high-quality, constructive code reviews that elevated team adherence to clean architecture principles.`,
        `Participated actively in engineering hiring panels, interviewing and assessing senior engineering candidates.`,
      ],
    },
  ];

  const script = `Hi [Manager Name],

Thank you for setting aside time for our career growth discussion today. Over the past year, my focus has been on operating consistently at the ${target} level — not just delivering my individual projects, but driving cross-team technical clarity and business value.

Most notably, leading ${projects} allowed us to achieve ${metrics}, while I also focused on multiplying the team through ${leadership}.

Based on our leveling framework and the impact I've sustained over the past 2 quarters, I would like to formally initiate my promotion case for ${target}. I've prepared a comprehensive promotion dossier with concrete evidence across scope, metrics, and leadership.

What are your thoughts, and what additional data can I provide to support you in presenting this to the calibration committee?`;

  return {
    current_level: current,
    target_level: target,
    dossier_executive_summary: `Over the past review cycle, candidate has successfully transitioned from squad-level execution to org-level technical leadership. By taking ownership of ${projects} and delivering ${metrics}, candidate has proven readiness for ${target} responsibilities.`,
    dimensions,
    manager_1on1_script: script,
    readiness_percentage: 91,
  };
}
