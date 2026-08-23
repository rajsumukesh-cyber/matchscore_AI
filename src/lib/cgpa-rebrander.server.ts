/**
 * Module 25 — AI Low CGPA / Backlog Defense & Non-CS Rebrander (server only).
 *
 * Tailored for students with lower grades (<7.0 CGPA), academic backlogs,
 * or non-CS degrees (Mechanical, Civil, Commerce, Arts) transitioning into tech.
 */
import type { AppSupabase } from "./db.server";

export interface DefenseScript {
  recruiter_question: string;
  recommended_verbal_answer: string;
  psychological_intent: string;
}

export interface CgpaRebranderResult {
  student_situation: string;
  resume_restructuring_tips: string[];
  verbal_defense_scripts: DefenseScript[];
  alternative_credentialing_checklist: string[];
  hiring_channels_with_zero_gpa_filter: string[];
}

export async function rebrandLowCgpaProfile(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    academicIssue: "Low CGPA (<6.5/7.0)" | "Past/Active Academic Backlogs" | "Non-CS Degree Transition" | "Career / Education Gap";
    currentDegree: string;
    actualSkillsLearned: string;
    targetRole: string;
  },
): Promise<CgpaRebranderResult> {
  const issue = input.academicIssue || "Low CGPA (<6.5/7.0)";
  const degree = input.currentDegree.trim() || "B.Tech / Undergraduate";
  const skills = input.actualSkillsLearned.trim() || "JavaScript, React, Node.js, Python, SQL";
  const role = input.targetRole.trim() || "Junior Software Engineer";

  const scripts: DefenseScript[] = [
    {
      recruiter_question: issue.includes("Low CGPA")
        ? "I noticed your college CGPA is on the lower side. Can you explain what happened?"
        : issue.includes("Non-CS")
        ? "You studied a non-computer science degree. Why should we hire you over CS graduates?"
        : "Can you explain the backlogs or gap in your academic timeline?",
      recommended_verbal_answer: issue.includes("Low CGPA")
        ? `"In my initial semesters, I prioritized hands-on practical engineering over theoretical exam memorization. While my test scores suffered early on, I channeled that time into mastering ${skills} and shipping real-world projects. If you look at my recent work on GitHub, I have built production-grade apps with live users, which proves my ability to deliver immediate value on Day 1."`
        : issue.includes("Non-CS")
        ? `"My non-CS background taught me first-principles analytical modeling and rigorous discipline. Over the past year, I dedicated 800+ hours to teaching myself data structures, algorithms, and full-stack development in ${skills}. Unlike someone who only did college coursework, I chose software engineering purely out of genuine passion and self-driven persistence."`
        : `"During that phase of college, I encountered personal and academic challenges that taught me resilience and time management. Since then, I completely revamped my work ethic, cleared all requirements, and focused heavily on practical engineering in ${skills}, building deployed applications with automated tests."`,
      psychological_intent: "Pivot immediately from academic theory to verified proof-of-work and demonstrable shipping velocity.",
    },
    {
      recruiter_question: "How do we know you can handle complex computer science fundamentals without a high theoretical GPA?",
      recommended_verbal_answer: `"I'd welcome a live technical problem-solving session or system design whiteboard right now. I've solved foundational coding challenges on LeetCode and built projects utilizing database indexing and API caching, so you can test my hands-on knowledge directly."`,
      psychological_intent: "Exudes confidence and invites direct technical evaluation where academic scores are irrelevant.",
    },
  ];

  return {
    student_situation: `${issue} with background in ${degree}, aiming for ${role}.`,
    resume_restructuring_tips: [
      `Move "Education" to the very bottom of the resume: lead with "Technical Skills Summary" followed immediately by "Featured Production Projects" with live URLs.`,
      `Omit GPA if it is below 7.0 / 3.0: recruiters rarely ask for GPA if your projects and GitHub are impressive.`,
      `Highlight "Major GPA" or "Final Year GPA" instead of cumulative GPA if your grades improved in later semesters.`,
      `Add verified credentials (free certifications from Harvard CS50, freeCodeCamp, Meta Full-Stack) to validate theoretical foundation.`,
    ],
    verbal_defense_scripts: scripts,
    alternative_credentialing_checklist: [
      "Complete Harvard's free CS50x course and add the certificate to LinkedIn and your resume.",
      "Earn the free Meta / AWS Cloud Practitioner badge or freeCodeCamp Certified Developer badge.",
      "Achieve a 1500+ LeetCode rating or top 20% ranking on HackerRank problem solving.",
    ],
    hiring_channels_with_zero_gpa_filter: [
      "Y-Combinator Startup Jobs (YC Work at a Startup) — 0% care about college GPA, 100% care about working demo apps.",
      "AngelList / Wellfound Early-Stage Startups — founders evaluate GitHub PRs and portfolio links directly.",
      "Open-Source Repositories (GSoC, Hacktoberfest) — code contributions bypass traditional resume filters.",
      "Direct LinkedIn Cold Inbound to Engineering Managers with a 60-second video demo of a deployed app.",
    ],
  };
}
