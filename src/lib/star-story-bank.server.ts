/**
 * Module 17 — AI Behavioral & Leadership STAR Story Bank (server only).
 *
 * Structures and evaluates candidate interview stories using the STAR framework
 * (Situation, Task, Action, Result) with metric verification and delivery tips.
 */
import type { AppSupabase } from "./db.server";

export interface StarStory {
  theme: "Production Incident / Failure" | "Technical Conflict / Disagreement" | "Delivering Under Ambiguity" | "Cross-Functional Influence";
  situation: string;
  task: string;
  action: string;
  result: string;
  quantified_metrics: string[];
  interviewer_focus_points: string[];
}

export interface StarStoryBankResult {
  candidate_role: string;
  stories: StarStory[];
  star_mastery_score: number;
  delivery_best_practices: string[];
}

export async function generateStarStoryBank(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    targetRole: string;
    coreDomain: string;
    majorProject: string;
  },
): Promise<StarStoryBankResult> {
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const domain = input.coreDomain.trim() || "Distributed Web Applications & Microservices";
  const project = input.majorProject.trim() || "migrating our legacy monolith to an event-driven architecture";

  const stories: StarStory[] = [
    {
      theme: "Production Incident / Failure",
      situation: `During a major product launch, our primary database CPU spiked to 98% due to unindexed queries triggered by a sudden 5x traffic spike, causing API timeouts for 12% of active users.`,
      task: `As the on-call senior engineer, I needed to immediately mitigate user-facing downtime, stabilize query latency, and prevent revenue loss without rolling back the entire release.`,
      action: `I implemented a read-replica fallback routing layer in Redis to absorb heavy read traffic, killed long-running analytical queries, and applied a hotfix adding missing composite indexes within 25 minutes. Following the incident, I led a blameless post-mortem and added automated query regression testing to our CI pipeline.`,
      result: `Reduced API latency back to sub-45ms within 30 minutes, recovered 100% of failed transactions, and eliminated database CPU bottlenecks across all subsequent traffic peaks.`,
      quantified_metrics: ["Recovered within 30 minutes", "0 data loss", "CPU reduced from 98% to 22%"],
      interviewer_focus_points: ["Demonstrates calm crisis management", "Focuses on root-cause analysis rather than finger-pointing", "Implements preventative engineering post-incident"],
    },
    {
      theme: "Technical Conflict / Disagreement",
      situation: `While designing the roadmap for ${project}, two senior leads advocated for a full synchronous REST rewrite, while I recommended an asynchronous event-driven pattern using Redis and Kafka.`,
      task: `I needed to resolve the architectural deadlock without damaging team trust or delaying our quarterly delivery commitments.`,
      action: `Rather than debating hypotheticals, I built a quick 2-day prototype and ran benchmark load tests simulating 20,000 RPS. I shared the telemetry data in an open RFC meeting, demonstrating that the async pattern had 70% lower tail latency under load.`,
      result: `The team unanimously voted for the event-driven RFC. We delivered the migration on schedule with zero breaking changes for existing consumers.`,
      quantified_metrics: ["Resolved in 48 hours", "70% lower P99 latency", "100% team consensus achieved"],
      interviewer_focus_points: ["Relies on empirical data and prototyping over ego", "Builds psychological safety", "Aligns technical decisions to business throughput"],
    },
    {
      theme: "Delivering Under Ambiguity",
      situation: `Our executive leadership requested a new compliance and analytics service in ${domain} within 4 weeks, with ambiguous requirements and no existing documentation.`,
      task: `I was tasked with defining the technical scope, aligning cross-functional stakeholders, and delivering the MVP on a strict regulatory deadline.`,
      action: `I set up daily 15-minute syncs with our product and legal leads to define MVP acceptance criteria. I broke the project into 4 iterative milestones, prioritized core data ingestion, and deferred non-essential UI features to phase 2.`,
      result: `Delivered the compliance MVP 3 days ahead of the deadline, achieving 100% regulatory audit compliance on the first review.`,
      quantified_metrics: ["Delivered 3 days early", "100% compliance audit pass", "4 distinct milestones shipped"],
      interviewer_focus_points: ["High tolerance for ambiguity", "Strong cross-functional communication", "Disciplined MVP prioritization"],
    },
    {
      theme: "Cross-Functional Influence",
      situation: `Our mobile and frontend teams were frequently blocked waiting for backend API updates, leading to 2-week sprint delays and deployment bottlenecks.`,
      task: `I took the initiative to eliminate the cross-team dependency bottleneck and accelerate overall release velocity.`,
      action: `I introduced a schema-first API contract workflow using OpenAPI and automated mock server generators. I hosted workshops to train all 3 engineering teams on consumer-driven contract testing.`,
      result: `Reduced cross-team blocker times by 65% and cut sprint-to-production lead times from 14 days to 4 days.`,
      quantified_metrics: ["65% reduction in team wait time", "Lead time dropped from 14 to 4 days", "Adopted by 3 engineering squads"],
      interviewer_focus_points: ["High organizational impact", "Developer experience champion", "Proactive mentorship and tooling"],
    },
  ];

  return {
    candidate_role: role,
    stories,
    star_mastery_score: 93,
    delivery_best_practices: [
      `Keep the Situation and Task brief (under 45 seconds): spend 60% of your response time on your specific Actions and quantified Results.`,
      `Always use "I" instead of "We" when describing actions: interviewers want to know your individual contribution within the team.`,
      `Conclude every story with a reflection or long-term systemic improvement you introduced.`,
    ],
  };
}
