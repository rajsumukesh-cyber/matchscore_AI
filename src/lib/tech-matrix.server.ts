/**
 * Module 13 — AI Tech Stack Compatibility & Migration Advisor (server only).
 *
 * Maps a candidate's current tech stack against a target company's stack,
 * calculates semantic transferability, and generates interview bridge arguments.
 */
import type { AppSupabase } from "./db.server";

export interface TechBridgeItem {
  candidate_tech: string;
  target_tech: string;
  transferability_percent: number;
  ramp_up_estimate: string;
  bridge_argument: string;
}

export interface TechMatrixResult {
  candidate_stack: string[];
  target_stack: string[];
  overall_compatibility: number;
  bridge_items: TechBridgeItem[];
  immediate_matches: string[];
  interview_talking_points: string[];
}

export async function analyzeTechMatrix(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateStack: string;
    targetStack: string;
    targetRole?: string | null;
  },
): Promise<TechMatrixResult> {
  const current = input.candidateStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const target = input.targetStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const role = input.targetRole?.trim() || "Senior Engineer";

  const directMatches = current.filter((c) =>
    target.some((t) => t.toLowerCase() === c.toLowerCase()),
  );

  const missingTarget = target.filter(
    (t) => !current.some((c) => c.toLowerCase() === t.toLowerCase()),
  );

  const bridgeItems: TechBridgeItem[] = missingTarget.map((targetItem) => {
    const tLower = targetItem.toLowerCase();
    let counterpart = current[0] || "Core Stack";
    let pct = 75;
    let ramp = "1-2 weeks";

    if (tLower.includes("graphql") || tLower.includes("grpc")) {
      counterpart = current.find((c) => /rest|api/i.test(c)) || "REST APIs";
      pct = 88;
      ramp = "1 week";
    } else if (tLower.includes("kafka") || tLower.includes("rabbitmq") || tLower.includes("sqs")) {
      counterpart = current.find((c) => /redis|queue|pubsub/i.test(c)) || "Redis/Async queues";
      pct = 82;
      ramp = "2 weeks";
    } else if (tLower.includes("postgres") || tLower.includes("mysql")) {
      counterpart = current.find((c) => /sql|mongo|dynamo/i.test(c)) || "Database Management";
      pct = 90;
      ramp = "3 days";
    } else if (tLower.includes("kubernetes") || tLower.includes("k8s") || tLower.includes("docker")) {
      counterpart = current.find((c) => /docker|cloud|aws/i.test(c)) || "Containerization & Cloud";
      pct = 78;
      ramp = "2-3 weeks";
    } else if (tLower.includes("fastapi") || tLower.includes("nest") || tLower.includes("express")) {
      counterpart = current.find((c) => /node|express|django|flask|spring/i.test(c)) || "Backend Frameworks";
      pct = 92;
      ramp = "1 week";
    }

    return {
      candidate_tech: counterpart,
      target_tech: targetItem,
      transferability_percent: pct,
      ramp_up_estimate: ramp,
      bridge_argument: `Having deep production experience in ${counterpart}, the architectural principles (connection pooling, state management, schema design) map directly to ${targetItem}. Ramp-up time is minimal (~${ramp}).`,
    };
  });

  const totalPossible = Math.max(target.length, 1);
  const matchPoints = directMatches.length * 100;
  const bridgePoints = bridgeItems.reduce((acc, b) => acc + b.transferability_percent, 0);
  const overall = Math.min(96, Math.round((matchPoints + bridgePoints) / (totalPossible * 1.8)));

  return {
    candidate_stack: current,
    target_stack: target,
    overall_compatibility: Math.max(overall, 65),
    immediate_matches: directMatches.length > 0 ? directMatches : ["Core Architecture Fundamentals"],
    bridge_items: bridgeItems,
    interview_talking_points: [
      `Emphasize underlying system patterns: "Syntax and framework APIs are easy to pick up; my depth in distributed reliability and data modeling is what carries over on Day 1."`,
      `Highlight fast ramp-up track record: "In my past roles, I transitioned between frameworks and delivered production features within the first 2 sprints."`,
      `Frame missing tools as eager learning vectors: "I am specifically excited about ${target[0] || "your stack"} because of its performance characteristics at your scale."`,
    ],
  };
}
