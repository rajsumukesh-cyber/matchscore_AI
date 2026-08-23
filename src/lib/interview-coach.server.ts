/**
 * Module 27 — AI Live Interview Anxiety & Step-by-Step Hint Coach (server only).
 *
 * Designed for candidates who experience interview panic, freeze up during coding rounds,
 * or struggle to explain technical logic out loud.
 */
import type { AppSupabase } from "./db.server";

export interface PanicProtocolStep {
  step_number: number;
  phase_title: string;
  what_to_say_out_loud: string;
  why_this_works: string;
  interviewer_impression: string;
}

export interface InterviewCoachResult {
  problem_type: string;
  candidate_experience_level: string;
  panic_prevention_protocol: PanicProtocolStep[];
  emergency_scripts_when_stuck: { scenario: string; script: string }[];
  post_interview_followup_note: string;
}

export async function generateInterviewCoaching(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    codingTopic: "Array / Two Pointers" | "Hash Map & String Manipulation" | "Binary Trees & BST" | "Dynamic Programming & Recursion" | "System Architecture & APIs";
    anxietyLevel: "High (Freeze up under timer)" | "Moderate (Struggle explaining thoughts)" | "Mild (Need structuring)";
  },
): Promise<InterviewCoachResult> {
  const topic = input.codingTopic || "Hash Map & String Manipulation";
  const anxiety = input.anxietyLevel || "High (Freeze up under timer)";

  const protocol: PanicProtocolStep[] = [
    {
      step_number: 1,
      phase_title: "The 2-Minute Breathing & Clarification Buffer",
      what_to_say_out_loud: `"Before I jump into code, let me clarify the constraints and expected inputs. Can the input array be empty or contain negative numbers? What are the maximum bounds on N, and are duplicate elements possible?"`,
      why_this_works: "Gives your nervous system 120 seconds to calm down while demonstrating senior-level requirement gathering.",
      interviewer_impression: "Sees a methodical engineer who doesn't write ungrounded code without clear boundaries.",
    },
    {
      step_number: 2,
      phase_title: "The Safe Brute-Force Baseline (Secures 50% Credit)",
      what_to_say_out_loud: `"The naive approach would be to use nested loops with O(N²) time complexity. Let me verbally trace how that works: we compare every pair and check if the condition holds. While this works, it won't scale well for large inputs, so let me explore if we can optimize this to O(N) using extra space or a hash map."`,
      why_this_works: "Guarantees you never finish with a 0 score. Proves you understand the core problem before jumping to optimizations.",
      interviewer_impression: "Demonstrates strong foundational algorithmic intuition.",
    },
    {
      step_number: 3,
      phase_title: "Pattern Recognition & Verbal Pseudo-Code",
      what_to_say_out_loud: `"To optimize this from O(N²) to O(N), we can trade space for time by storing seen values in a Hash Map. As we iterate once through the list, we can look up the complement in O(1) time. Let me write out the high-level steps in comments first."`,
      why_this_works: "Writing comments before syntax prevents syntax panic and shows structured thinking.",
      interviewer_impression: "Highlights clean modular coding and pseudo-code planning.",
    },
    {
      step_number: 4,
      phase_title: "Dry-Run with an Example & Edge Cases",
      what_to_say_out_loud: `"Let's dry-run this code line-by-line with a small test case [2, 7, 11, 15] and target = 9. Variable state at step 1: complement is 7, map is empty... At step 2, 7 is in the map, so we return the pair indices. Let's also check edge cases: empty input and single-element array."`,
      why_this_works: "Catching your own off-by-one errors before the interviewer points them out earns major bonus points.",
      interviewer_impression: "Displays exceptional self-debugging ability and thoroughness.",
    },
  ];

  const emergencyScripts = [
    {
      scenario: "When you get completely stuck and have a mind blank",
      script: `"Let me take a step back and write down a concrete example with 3 items on the board. Let's trace what output I expect manually, and see what data structure helps me track that transition."`,
    },
    {
      scenario: "When your code fails a hidden test case",
      script: `"Good catch on that test case. Let me trace the pointer boundaries: it looks like when the array has identical duplicates, my condition triggers early. Let me adjust the comparison to handle duplicates."`,
    },
    {
      scenario: "When you run out of time with 2 minutes left",
      script: `"I see we're near the end of our time. The core algorithm is complete; the remaining step would be to handle the helper recursion termination. I'd love to explain the final 3 lines verbally."`,
    },
  ];

  const followUp = `Subject: Thank you for the technical interview today! / [Your Name]

Dear [Interviewer Name],

Thank you for taking the time to speak with me today about [Role Title] at [Company Name]. I really enjoyed our discussion around ${topic}.

Reflecting on the coding problem we worked on, I realized that we could further optimize the memory footprint by [mention 1 subtle optimization or edge case].

I'm very excited about the mission at [Company Name] and look forward to the next steps!

Best regards,
[Your Name]`;

  return {
    problem_type: topic,
    candidate_experience_level: anxiety,
    panic_prevention_protocol: protocol,
    emergency_scripts_when_stuck: emergencyScripts,
    post_interview_followup_note: followUp,
  };
}
