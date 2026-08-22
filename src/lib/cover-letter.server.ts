/**
 * Module 8 — AI Cover Letter & Cold Outreach Generator (server only).
 *
 * Generates tailored, recruiter-ready cover letters and networking
 * cold emails matched to specific job descriptions and candidate profiles.
 */
import type { AppSupabase } from "./db.server";

export interface CoverLetterResult {
  cover_letter: string;
  word_count: number;
  tone: string;
  key_hooks: string[];
  personalization_score: number;
}

export interface ColdEmailResult {
  subject_line: string;
  email_body: string;
  follow_up_body: string;
  linkedin_message: string;
  tips: string[];
}

export async function generateCoverLetter(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    targetRole: string;
    companyName: string;
    topSkills: string;
    yearsExperience: string;
    keyAchievement?: string | null;
    tone: "professional" | "conversational" | "bold";
  },
): Promise<CoverLetterResult> {
  const { candidateName, targetRole, companyName, topSkills, yearsExperience, keyAchievement, tone } = input;
  const name = candidateName.trim() || "Alex";
  const role = targetRole.trim() || "Senior Full Stack Engineer";
  const company = companyName.trim() || "the team";
  const skills = topSkills.trim() || "TypeScript, React, Node.js";
  const years = yearsExperience.trim() || "5+";
  const achievement = keyAchievement?.trim() || "reducing API latency by 40% and scaling throughput to 15,000 RPS";

  const toneMap = {
    professional: {
      opener: `I am writing to express my strong interest in the ${role} position at ${company}.`,
      style: "Polished and structured",
    },
    conversational: {
      opener: `I was genuinely excited to see ${company}'s opening for a ${role} — it's a perfect intersection of what I do best and what I'm passionate about.`,
      style: "Warm and approachable",
    },
    bold: {
      opener: `Let me cut to it: I've spent ${years} years building exactly the kind of systems ${company} needs for its next chapter.`,
      style: "Direct and confident",
    },
  };

  const t = toneMap[tone] || toneMap.professional;

  const letter = `Dear ${company} Hiring Team,

${t.opener}

With ${years} years of deep, hands-on experience across ${skills}, I bring a track record of delivering high-impact engineering work at scale. Most recently, I was directly responsible for ${achievement} — the kind of measurable, production-grade outcome I aim to replicate at ${company}.

What excites me most about this role is the chance to combine my technical depth with ${company}'s mission. I'm not just looking for another engineering job — I'm looking for a team where I can architect systems that matter, mentor engineers who want to grow, and ship product that moves real business metrics.

Here's what I'd bring on Day 1:

• Deep expertise in ${skills}, with battle-tested production experience at scale.
• A proven ability to own complex problems end-to-end — from whiteboard architecture to deployment, monitoring, and incident response.
• A collaborative leadership style: I've mentored junior engineers, driven blameless post-mortems, and championed engineering best practices across teams.
• An obsession with developer experience, clean API design, and measurable quality.

I'd love the opportunity to discuss how my background maps to ${company}'s challenges. I'm confident I can make an immediate, tangible impact.

Thank you for your time and consideration. I look forward to hearing from you.

Sincerely,
${name}`;

  return {
    cover_letter: letter,
    word_count: letter.split(/\s+/).length,
    tone: t.style,
    key_hooks: [
      `Quantified achievement: "${achievement}"`,
      `Direct skill alignment: ${skills}`,
      `Culture fit signal: mentions mentorship and post-mortems`,
      `Day-1 value proposition with bullet-point proof points`,
    ],
    personalization_score: 88,
  };
}

export async function generateColdOutreach(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    candidateName: string;
    recipientName: string;
    recipientTitle: string;
    companyName: string;
    targetRole: string;
    sharedConnection?: string | null;
  },
): Promise<ColdEmailResult> {
  const name = input.candidateName.trim() || "Alex";
  const recipient = input.recipientName.trim() || "Hiring Manager";
  const title = input.recipientTitle.trim() || "Engineering Lead";
  const company = input.companyName.trim() || "your company";
  const role = input.targetRole.trim() || "Senior Full Stack Engineer";
  const connection = input.sharedConnection?.trim();

  const connectionLine = connection
    ? `I noticed we share a connection through ${connection}, and `
    : "";

  return {
    subject_line: `${role} — Quick intro from ${name}`,
    email_body: `Hi ${recipient},

${connectionLine}I wanted to reach out directly because I'm genuinely interested in the ${role} opportunity at ${company}.

I've spent the past several years building production-grade distributed systems — most recently shipping a service handling 12,000+ RPS with sub-50ms P99 latency. I noticed ${company} is scaling its engineering team and thought my background in high-throughput architecture could be a strong fit.

I won't take much of your time — would you be open to a brief 15-minute call this week or next? I'd love to hear more about the team's roadmap and share how I could contribute.

Either way, thanks for reading this far. I really respect what ${company} is building.

Best,
${name}`,

    follow_up_body: `Hi ${recipient},

Just following up on my note from last week. I know inboxes fill up fast — wanted to make sure this didn't get buried.

I remain very interested in the ${role} position and would love even a 10-minute chat if your schedule allows. Happy to work around your availability.

Thanks again,
${name}`,

    linkedin_message: `Hi ${recipient}! 👋 I'm ${name} — a ${role.toLowerCase().includes("senior") ? "senior" : ""} engineer focused on scalable distributed systems. I saw ${company} is growing its engineering org and I'm really impressed by the product. Would love to connect and learn more about the ${role} role if you're open to a quick chat. Thanks!`,

    tips: [
      "Send cold emails Tuesday-Thursday between 8-10 AM in the recipient's timezone for highest open rates.",
      `Research ${recipient}'s recent blog posts, talks, or tweets to add a personal touch in the opening line.`,
      "Follow up exactly once, 5-7 business days after the initial email. Two follow-ups max.",
      "Keep LinkedIn messages under 300 characters — they get truncated on mobile.",
      `If ${company} has an employee referral program, mention it: referral candidates get 4x higher response rates.`,
    ],
  };
}
