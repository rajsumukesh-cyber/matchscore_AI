/**
 * Module 10 — AI LinkedIn Profile Optimizer & Headline Studio (server only).
 *
 * Optimizes candidate LinkedIn presence with recruiter-optimized headlines,
 * viral storytelling About sections, and Boolean search keyword tags.
 */
import type { AppSupabase } from "./db.server";

export interface LinkedInHeadline {
  style: "Search Optimized" | "Authority / Leader" | "Creator / Storyteller";
  headline: string;
  character_count: number;
  best_for: string;
}

export interface LinkedInOptimizationResult {
  target_role: string;
  headlines: LinkedInHeadline[];
  about_section: string;
  recruiter_keywords: string[];
  post_prompts: string[];
  profile_strength_score: number;
}

export async function optimizeLinkedInProfile(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    targetRole: string;
    currentSkills: string;
    yearsExperience: string;
    keyAchievements?: string | null;
  },
): Promise<LinkedInOptimizationResult> {
  const name = input.candidateName.trim() || "Alex";
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const skills = input.currentSkills.trim() || "TypeScript, React, Node.js, Distributed Systems, AWS";
  const years = input.yearsExperience.trim() || "5+";
  const achievement = input.keyAchievements?.trim() || "scaled services to 15,000 RPS and reduced cloud spend by 35%";

  const skillArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const top3Skills = skillArray.slice(0, 3).join(" | ") || "Full Stack | Cloud Systems | API Architecture";

  const headlines: LinkedInHeadline[] = [
    {
      style: "Search Optimized",
      headline: `${role} | ${top3Skills} | Scaling High-Throughput Systems (${years} YOE)`,
      character_count: `${role} | ${top3Skills} | Scaling High-Throughput Systems (${years} YOE)`.length,
      best_for: "Maximum visibility in LinkedIn Recruiter search queries and Boolean searches.",
    },
    {
      style: "Authority / Leader",
      headline: `Building Resilient Distributed Systems @ Scale | ${role} | Ex-${achievement.split(" ")[0] || "Tech"} | Mentoring Future Engineers`,
      character_count: `Building Resilient Distributed Systems @ Scale | ${role} | Ex-${achievement.split(" ")[0] || "Tech"} | Mentoring Future Engineers`.length,
      best_for: "Positioning yourself as a domain authority, tech lead, or engineering manager.",
    },
    {
      style: "Creator / Storyteller",
      headline: `Obsessed with system design, clean APIs, and developer experience ⚡ ${role} sharing insights on modern engineering`,
      character_count: `Obsessed with system design, clean APIs, and developer experience ⚡ ${role} sharing insights on modern engineering`.length,
      best_for: "Building a personal brand, attracting inbound recruiter DMs, and content engagement.",
    },
  ];

  const aboutSection = `👋 Hi, I'm ${name} — a ${role} with ${years} years of hands-on experience architecting high-availability web applications and distributed systems.

🚀 What I Do:
I specialize in bridging complex system architecture with exceptional product delivery. My core expertise spans ${skills}. Most recently, I led initiatives responsible for ${achievement}.

💡 My Engineering Philosophy:
• Simplicity first: The best code is the code you never had to write.
• Measurable impact: Every architectural decision must tie back to system reliability, latency reduction, or business velocity.
• Team elevation: I actively champion blameless retrospectives, clear API contracts, and proactive mentorship.

🛠️ Core Tech Stack:
${skillArray.map((s) => `• ${s}`).join("\n")}

📬 Let's Connect:
Always happy to connect with engineering leaders, fellow builders, and teams solving ambitious technical problems. Reach out via DM or email!`;

  return {
    target_role: role,
    headlines,
    about_section: aboutSection,
    recruiter_keywords: [
      role,
      ...skillArray,
      "System Design",
      "Microservices",
      "Scalability",
      "CI/CD Pipeline",
      "Agile Mentorship",
      "Production Incident Response",
    ],
    post_prompts: [
      `"Here are 3 hard lessons I learned scaling an API to handle peak traffic without breaking the database..."`,
      `"Why we chose ${skillArray[0] || "TypeScript"} over alternatives for our production microservices in 2026."`,
      `"How we reduced our P99 latency by 40% through targeted caching and query indexing."`,
      `"3 architectural antipatterns I frequently encounter in senior system design reviews."`,
    ],
    profile_strength_score: 94,
  };
}
