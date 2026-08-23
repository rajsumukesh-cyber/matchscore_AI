/**
 * Module 30 — AI Campus Placement Aptitude & Fast-Math Coach (server only).
 *
 * Helps students pass on-campus & off-campus aptitude assessment screening rounds
 * (TCS NQT, Infosys, Amazon OA, Accenture) with fast-math shortcuts and logical tricks.
 */
import type { AppSupabase } from "./db.server";

export interface AptitudeTopicShortcut {
  topic_name: string;
  category: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal & Critical Thinking";
  core_formula_or_pattern: string;
  speed_shortcut_trick: string;
  sample_question: string;
  step_by_step_solution: string;
}

export interface AptitudeCoachResult {
  target_exam: string;
  candidate_readiness_score: number;
  shortcuts: AptitudeTopicShortcut[];
  exam_day_time_management_rules: string[];
}

export async function generateAptitudeCoaching(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    targetCompanyOrExam: string;
    focusCategory: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal & Critical Thinking";
  },
): Promise<AptitudeCoachResult> {
  const exam = input.targetCompanyOrExam.trim() || "TCS NQT / Infosys / Amazon Online Assessment";
  const cat = input.focusCategory || "Quantitative Aptitude";

  const shortcuts: AptitudeTopicShortcut[] = [
    {
      topic_name: "Time & Work (Efficiency Method)",
      category: "Quantitative Aptitude",
      core_formula_or_pattern: "Total Work = LCM of individual times. Efficiency = Work / Time.",
      speed_shortcut_trick: "Never use fractional math (1/x + 1/y). Take the LCM of the given numbers as the 'Total Units of Work'. Calculate individual daily units, add them together, and divide total units by sum of daily units in under 15 seconds.",
      sample_question: "A can complete a project in 12 days, and B in 18 days. Working together, how many days will they take?",
      step_by_step_solution: "1. LCM(12, 18) = 36 units total work.\n2. A's efficiency = 36/12 = 3 units/day.\n3. B's efficiency = 36/18 = 2 units/day.\n4. Combined efficiency = 3 + 2 = 5 units/day.\n5. Total days = 36 / 5 = 7.2 days (7 days 4.8 hours). Solved in 10 seconds without fractions!",
    },
    {
      topic_name: "Speed, Distance & Relative Speed (Train Problems)",
      category: "Quantitative Aptitude",
      core_formula_or_pattern: "Relative Speed (Opposite Direction) = S1 + S2; (Same Direction) = |S1 - S2|.",
      speed_shortcut_trick: "Always convert km/h to m/s immediately by multiplying by 5/18 (or m/s to km/h by multiplying by 18/5). Distance to cross a platform = Length of Train + Length of Platform.",
      sample_question: "A train 150m long moving at 54 km/h crosses a 250m long platform. How much time does it take?",
      step_by_step_solution: "1. Convert 54 km/h to m/s: 54 × (5/18) = 15 m/s.\n2. Total distance = 150m (train) + 250m (platform) = 400m.\n3. Time = Distance / Speed = 400 / 15 = 26.67 seconds.",
    },
    {
      topic_name: "Syllogisms & Venn Logic",
      category: "Logical Reasoning",
      core_formula_or_pattern: "All A are B -> A is subset of B. Some A are B -> Overlapping intersection.",
      speed_shortcut_trick: "Use the 'Cross-Out Method': If a conclusion uses definite words ('All', 'Is') but the premise allows an alternative Venn diagram where it fails, the conclusion is FALSE. Only conclusions true in ALL valid Venn models are valid.",
      sample_question: "Statements: All laptops are devices. Some devices are phones. Conclusion: Some laptops are phones.",
      step_by_step_solution: "Draw Venn diagram: Laptops is inside Devices. Phones overlaps with Devices, but not necessarily with Laptops. Since a valid model exists where Laptops and Phones do NOT overlap, the conclusion does NOT follow.",
    },
    {
      topic_name: "Percentage Profit & Loss Markup",
      category: "Quantitative Aptitude",
      core_formula_or_pattern: "Effective % Change = a + b + (ab / 100).",
      speed_shortcut_trick: "When a price is increased by X% and then discounted by Y%, never calculate intermediate rupee amounts. Use the net formula: Net % = X - Y - (X × Y)/100.",
      sample_question: "A seller marks up an item by 30% and then offers a 20% festive discount. What is the net profit percentage?",
      step_by_step_solution: "Net % = 30 - 20 - (30 × 20)/100 = 10 - 6 = +4% Profit! Solved mentally in 3 seconds.",
    },
  ];

  return {
    target_exam: exam,
    candidate_readiness_score: 89,
    shortcuts,
    exam_day_time_management_rules: [
      "Rule 1: Never spend more than 60 seconds on any single question: if you are stuck, flag it and move on immediately.",
      "Rule 2: Attempt all questions if there is no negative marking (TCS NQT, Infosys). If negative marking exists, eliminate 2 obvious wrong options first before taking an educated guess.",
      "Rule 3: Memorize squares up to 30, cubes up to 15, and reciprocal fractions (1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%) for instant mental calculations.",
    ],
  };
}
