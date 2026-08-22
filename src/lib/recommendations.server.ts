/**
 * Module 14 — AI Reference Check & Recommendation Letter Drafter (server only).
 *
 * Generates tailored LinkedIn/formal recommendation letters from 3 perspectives
 * (Manager, Tech Lead Peer, Mentee) and reference check prep sheets.
 */
import type { AppSupabase } from "./db.server";

export interface RecommendationLetter {
  perspective: "Former Manager" | "Senior Peer / Tech Lead" | "Mentee / Junior Engineer";
  letter_text: string;
  key_traits_highlighted: string[];
}

export interface ReferenceCheckResult {
  candidate_name: string;
  target_role: string;
  recommendations: RecommendationLetter[];
  reference_prep_qas: { question: string; suggested_answer: string }[];
}

export async function generateRecommendations(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    targetRole: string;
    keySkills: string;
    notableAchievement: string;
  },
): Promise<ReferenceCheckResult> {
  const name = input.candidateName.trim() || "Alex";
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const skills = input.keySkills.trim() || "TypeScript, System Design, Cloud Architecture";
  const achievement = input.notableAchievement.trim() || "architecting a resilient microservice handling 15,000 RPS with zero downtime";

  const recommendations: RecommendationLetter[] = [
    {
      perspective: "Former Manager",
      letter_text: `I had the distinct privilege of managing ${name} for over two years. During that time, ${name} stood out not only for exceptional technical execution in ${skills}, but for unwavering ownership. When tasked with ${achievement}, ${name} delivered ahead of schedule and mentored teammates through the rollout. ${name} is a top 5% engineer who elevates entire teams, and I would rehire them without hesitation.`,
      key_traits_highlighted: ["Ownership", "Cross-Functional Reliability", "Strategic Delivery"],
    },
    {
      perspective: "Senior Peer / Tech Lead",
      letter_text: `Working alongside ${name} on our core platform was an absolute masterclass in collaborative engineering. ${name} brings incredible technical rigor to architecture reviews, writes immaculate code, and was the primary driving force behind ${achievement}. Whenever our team faced complex, ambiguous technical roadblocks, ${name} was the person everyone looked to for clarity.`,
      key_traits_highlighted: ["Technical Rigor", "Code Quality", "Collaborative Problem Solving"],
    },
    {
      perspective: "Mentee / Junior Engineer",
      letter_text: `${name} has been an extraordinary mentor to me and several other engineers on our squad. In addition to spearheading major initiatives like ${achievement}, ${name} always made time for thorough, compassionate code reviews, whiteboard design sessions, and career guidance. Any engineering org would be lucky to have ${name}'s leadership.`,
      key_traits_highlighted: ["Empathetic Mentorship", "Patience", "Engineering Culture Champion"],
    },
  ];

  return {
    candidate_name: name,
    target_role: role,
    recommendations,
    reference_prep_qas: [
      {
        question: `What are ${name}'s greatest strengths when building at scale?`,
        suggested_answer: `Tell the recruiter: "${name}'s greatest strength is end-to-end technical ownership — from translating fuzzy product requirements into crisp system designs, to writing resilient production code in ${skills}."`,
      },
      {
        question: `How does ${name} handle technical disagreements or sprint pressure?`,
        suggested_answer: `Tell the recruiter: "${name} always anchors debates in objective data, latency benchmarks, and customer impact rather than ego. During critical deadlines, they remain calm and laser-focused on MVP priorities."`,
      },
      {
        question: `Would you rehire ${name} if given the opportunity?`,
        suggested_answer: `Tell the recruiter: "Absolutely, 100%. ${name} was one of our highest-performing engineers and a multiplier for everyone around them."`,
      },
    ],
  };
}
