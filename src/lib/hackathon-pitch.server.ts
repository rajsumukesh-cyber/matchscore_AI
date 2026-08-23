/**
 * Module 28 — AI Hackathon Winning Pitch & Judge Demo Kit (server only).
 *
 * Specifically designed to help students win hackathons by generating a 2-minute
 * verbal judge pitch, 5-slide pitch deck structure, demo script, and tough judge Q&A defense.
 */
import type { AppSupabase } from "./db.server";

export interface JudgeQA {
  anticipated_judge_question: string;
  winning_answer: string;
  scoring_rubric_impact: string;
}

export interface HackathonPitchResult {
  project_name: string;
  elevator_pitch_30_seconds: string;
  two_minute_judge_presentation: string;
  slide_deck_structure: { slide_number: number; title: string; bullets: string[] }[];
  judge_qa_defense: JudgeQA[];
  hackathon_winning_checklist: string[];
}

export async function generateHackathonPitch(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    projectName: string;
    targetProblem: string;
    coreTechStack: string;
    uniqueMoatOrFeature: string;
  },
): Promise<HackathonPitchResult> {
  const name = input.projectName.trim() || "MatchScore AI";
  const problem = input.targetProblem.trim() || "75% of qualified students and job seekers get rejected by black-box ATS filters with zero actionable feedback";
  const stack = input.coreTechStack.trim() || "React 19, TanStack Start (SSR), Google Gemini AI, PostgreSQL (Supabase), Render";
  const moat = input.uniqueMoatOrFeature.trim() || "A unified 30-in-1 explainable career intelligence ecosystem with free verified course recommendations and x402 micropayments";

  const pitch30 = `Judges, ${problem}. We built ${name} — a next-generation platform powered by ${stack} that gives every candidate transparent match scores, instant resume fixes, and personalized career roadmaps. It replaces 6 fragmented subscriptions with one unified AI copilot.`;

  const pitch2min = `Hello judges!

Imagine spending 4 years studying computer science, applying to over 200 software engineering roles, and receiving automated rejection emails without a single line of feedback. That is the reality for millions of students today because legacy Applicant Tracking Systems operate as opaque black boxes.

To solve this, we built ${name}.

${name} is a comprehensive career intelligence ecosystem powered by ${stack}. 

Here is how our live application works:
1. First, a student uploads their resume and pastes any target job specification.
2. In under 2 seconds, our AI calculates an explainable match score broken down across 50+ technical and behavioral dimensions.
3. Instead of vague advice, our AI Skill Gap Coach identifies missing keywords and recommends free, verified courses from Harvard CS50, AWS, and edX.
4. For students starting from scratch, our 48-Hour Starter Project Hub generates complete database schemas, backend code, and 1-click cloud deployments.

Our unfair advantage is ${moat}.

We have a live, working deployment running today on Render with sub-second response times. Thank you, and we would love to take your questions!`;

  const slides = [
    {
      slide_number: 1,
      title: "The Problem & Market Pain",
      bullets: [
        "Millions of qualified applicants are filtered by automated ATS black boxes.",
        "Students have no visibility into why their resumes fail or how to bridge skill gaps.",
        "Existing career prep platforms charge exorbitant $30/month fees.",
      ],
    },
    {
      slide_number: 2,
      title: `The Solution: ${name}`,
      bullets: [
        "Explainable AI scoring across 50+ dimensional categories.",
        "Prescriptive learning paths recommending free Harvard & AWS coursework.",
        "Comprehensive 30-in-1 career & student intelligence suite.",
      ],
    },
    {
      slide_number: 3,
      title: "Architecture & Tech Stack",
      bullets: [
        `Frontend & SSR: ${stack.split(",")[0] || "React 19 & TanStack Start"}`,
        `AI Intelligence: ${stack.split(",")[2] || "Google Gemini AI Engine"}`,
        "Database & Auth: Supabase PostgreSQL with real-time indexing.",
      ],
    },
    {
      slide_number: 4,
      title: "Business Model & Monetization",
      bullets: [
        "Freemium student tier with 10 free full analyses per month.",
        "Pro subscription for advanced mock interviews and AI coaching.",
        "x402 USDC micropayments for pay-as-you-go report unlocks.",
      ],
    },
    {
      slide_number: 5,
      title: "Traction & Next Steps",
      bullets: [
        "Full production deployment with live demo.",
        "Roadmap: College placement cell integration & enterprise recruitment dashboard.",
      ],
    },
  ];

  const qas: JudgeQA[] = [
    {
      anticipated_judge_question: "How is this different from asking ChatGPT to review my resume?",
      winning_answer: "ChatGPT provides unstructured, hallucination-prone text without deterministic scoring. MatchScore AI uses structured category evaluation, cross-references against live market skill ontologies, and automatically maps missing skills to verified free courses with direct enrollment links.",
      scoring_rubric_impact: "Proves defensibility and domain specialization over generic LLMs.",
    },
    {
      anticipated_judge_question: "How do you handle API costs and scaling under high student traffic?",
      winning_answer: "We utilize multi-tier Redis caching to cache common tech stack ontologies and course metadata, reducing LLM token invocations by 70%. For live inference, we leverage lightweight, cost-effective models with sub-second latency.",
      scoring_rubric_impact: "Demonstrates practical engineering economics and scalability.",
    },
    {
      anticipated_judge_question: "What is your go-to-market strategy to reach university students?",
      winning_answer: "We partner with university placement cells, student developer clubs (GDG, ACM), and hackathon communities. Students can use our free tools to generate GitHub project blueprints, creating organic viral word-of-mouth.",
      scoring_rubric_impact: "Highlights realistic user acquisition and distribution strategy.",
    },
  ];

  return {
    project_name: name,
    elevator_pitch_30_seconds: pitch30,
    two_minute_judge_presentation: pitch2min,
    slide_deck_structure: slides,
    judge_qa_defense: qas,
    hackathon_winning_checklist: [
      "Open your live demo URL in a clean browser tab BEFORE walking up to the judges.",
      "Show the live working product within the first 45 seconds of your pitch — never spend the entire time on slides!",
      "State your technical stack with pride: highlight SSR performance, AI prompt grounding, and database reliability.",
      "Conclude with a clear business vision and real-world student impact.",
    ],
  };
}
