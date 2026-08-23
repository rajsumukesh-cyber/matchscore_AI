/**
 * Module 23 — AI Semester-by-Semester Career Roadmap & Hackathon Blueprint (server only).
 *
 * Provides college & university students with an actionable semester-by-semester
 * milestone roadmap (DSA goals, core CS, hackathon project ideas, student packs)
 * and a dedicated Zero-to-Hero Survival Guide for below-average students.
 */
import type { AppSupabase } from "./db.server";

export interface SemesterMilestone {
  phase_name: string;
  semester_range: string;
  focus_area: string;
  dsa_milestones: string[];
  system_core_topics: string[];
  recommended_hackathon_project: {
    project_title: string;
    architecture_stack: string;
    killer_feature_to_win: string;
  };
}

export interface ZeroToHeroMonth {
  month_number: number;
  month_title: string;
  weekly_routine: string;
  dsa_leetcode_target: string;
  project_and_system_goal: string;
  how_to_stay_consistent: string;
}

export interface StudentRoadmapResult {
  student_level: string;
  target_career_path: string;
  semesters: SemesterMilestone[];
  zero_to_hero_intensive_plan: ZeroToHeroMonth[];
  free_student_developer_pack_checklist: { benefit: string; provider: string; how_to_claim: string }[];
  capstone_project_guidelines: string[];
}

export async function generateStudentRoadmap(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    currentYearOrSemester: string;
    targetRole: string;
    preferredTrack: "Full Stack Web" | "AI & Machine Learning" | "Cloud & DevOps" | "Data Engineering";
  },
): Promise<StudentRoadmapResult> {
  const year = input.currentYearOrSemester.trim() || "2nd Year (Semester 3-4)";
  const role = input.targetRole.trim() || "Full Stack & Cloud Software Engineer";
  const track = input.preferredTrack || "Full Stack Web";

  const semesters: SemesterMilestone[] = [
    {
      phase_name: "Phase 1: Foundations & Problem Solving",
      semester_range: "Year 1 (Semesters 1 & 2)",
      focus_area: "Master 1 Core Language (C++, Java, or Python) + Git/GitHub basics",
      dsa_milestones: [
        "Time & Space Complexity analysis (Big-O notation).",
        "Arrays, Strings, Pointers, and Recursion fundamentals.",
        "Solve 50 easy problems on LeetCode / HackerRank.",
      ],
      system_core_topics: [
        "Digital Logic & Computer Organization.",
        "Linux terminal commands & Bash scripting.",
      ],
      recommended_hackathon_project: {
        project_title: "CLI Developer Productivity Suite",
        architecture_stack: "Python / Go, Rich CLI, SQLite",
        killer_feature_to_win: "Automates daily git branching and ticket tracking from the terminal.",
      },
    },
    {
      phase_name: "Phase 2: Core Computer Science & Full-Stack Development",
      semester_range: "Year 2 (Semesters 3 & 4)",
      focus_area: "Intermediate DSA + DBMS, OS, Computer Networks + Modern Web Stack",
      dsa_milestones: [
        "Linked Lists, Stacks, Queues, Binary Trees, and Hash Maps.",
        "Binary Search and 2-Pointer problem patterns.",
        "Target: 120+ LeetCode problems solved (Blind 75 milestone).",
      ],
      system_core_topics: [
        "Database Management Systems (SQL queries, Normalization, ACID transactions).",
        "Operating Systems (Processes, Threads, Virtual Memory, Deadlocks).",
        "Computer Networks (TCP/IP, HTTP/HTTPS, DNS, WebSockets).",
      ],
      recommended_hackathon_project: {
        project_title: "Real-Time Collaborative Whiteboard & Code Room",
        architecture_stack: "React, Node.js, WebSockets (Socket.io), Redis, PostgreSQL",
        killer_feature_to_win: "Sub-10ms multi-user cursor sync and live code compiler execution.",
      },
    },
    {
      phase_name: "Phase 3: Advanced DSA, System Design & Internship Season",
      semester_range: "Year 3 (Semesters 5 & 6)",
      focus_area: "Graph Algorithms, DP, High-Level System Design & Applying to Summer Internships",
      dsa_milestones: [
        "Dynamic Programming (1D & 2D), Graphs (BFS/DFS, Dijkstra), Tries.",
        "Participate in weekly LeetCode / Codeforces contests (reach 1600+ rating).",
        "Total: 250+ solved problems.",
      ],
      system_core_topics: [
        "System Design Fundamentals (Load balancers, Caching with Redis, Database sharding).",
        "Docker containerization & deploying to AWS/Vercel/Render.",
        "CI/CD pipelines using GitHub Actions.",
      ],
      recommended_hackathon_project: {
        project_title: "AI-Powered Multimodal Resume & Interview Copilot",
        architecture_stack: "Next.js / TanStack Start, FastAPI, Google Gemini API, PostgreSQL, Tailwind",
        killer_feature_to_win: "Real-time speech-to-text interview simulation with instant rubric feedback.",
      },
    },
    {
      phase_name: "Phase 4: Capstone Execution, Open-Source & Full-Time Placement",
      semester_range: "Year 4 (Semesters 7 & 8)",
      focus_area: "Enterprise Capstone Project, Mock Interviews, Campus Placements & Off-Campus Offsetting",
      dsa_milestones: [
        "Revise NeetCode 150 patterns and top 50 company-tagged questions.",
        "Conduct 10 peer mock technical interviews with timed whiteboarding.",
      ],
      system_core_topics: [
        "Low-Level Object-Oriented Design (Design Patterns: Singleton, Factory, Strategy).",
        "Behavioral STAR questions preparation for hiring managers.",
      ],
      recommended_hackathon_project: {
        project_title: "Distributed Fault-Tolerant Event Stream Pipeline",
        architecture_stack: "Go, Apache Kafka, PostgreSQL, Docker Compose, Grafana/Prometheus",
        killer_feature_to_win: "Live telemetry dashboard proving 25,000 events/sec with zero message loss.",
      },
    },
  ];

  const zeroToHeroPlan: ZeroToHeroMonth[] = [
    {
      month_number: 1,
      month_title: "Month 1: Language Mastery & Basic Problem Solving",
      weekly_routine: "1 hour daily: Pick ONE language (C++, Java, or Python) and stick to it. Never switch midway.",
      dsa_leetcode_target: "Solve 30 Easy problems (Two Sum, Valid Anagram, Reverse String, Palindrome).",
      project_and_system_goal: "Set up GitHub profile, learn Git commit/push, and build a clean CLI tool.",
      how_to_stay_consistent: "If you get stuck for >20 mins on a problem, look at the solution, write down the pattern in a notebook, and re-code it from scratch the next morning without looking.",
    },
    {
      month_number: 2,
      month_title: "Month 2: Essential Data Structures & Core Web Fundamentals",
      weekly_routine: "1.5 hours daily: Master Hash Maps, Two Pointers, Stacks, and Binary Search.",
      dsa_leetcode_target: "Solve 45 Medium problems (Blind 75 subset: 3Sum, Valid Parentheses, Binary Search).",
      project_and_system_goal: "Learn HTML/CSS, JavaScript, and Node.js basics. Build a REST API with Express and PostgreSQL.",
      how_to_stay_consistent: "Don't try to solve 10 problems a day. Solving 2 problems thoroughly and understanding time complexity is worth 100x more than copy-pasting.",
    },
    {
      month_number: 3,
      month_title: "Month 3: Trees, Linked Lists & First Full-Stack Deployed App",
      weekly_routine: "1.5 hours daily: Binary Trees (Inorder/Preorder/Postorder, Max Depth) + React frontend.",
      dsa_leetcode_target: "Solve 35 Tree and Linked List problems (Invert Binary Tree, Level Order Traversal).",
      project_and_system_goal: "Build Project #1 (e.g. URL Shortener with Redis caching) and deploy live on Render + Vercel.",
      how_to_stay_consistent: "A live deployed project gives you immediate confidence and something tangible to showcase to recruiters.",
    },
    {
      month_number: 4,
      month_title: "Month 4: Dynamic Programming Basics, Graphs & AI Project",
      weekly_routine: "2 hours daily: BFS/DFS graph traversals and 1D DP (Climbing Stairs, House Robber).",
      dsa_leetcode_target: "Solve 30 Graph and DP problems.",
      project_and_system_goal: "Build Project #2 (AI RAG Document QA with Gemini API & pgvector).",
      how_to_stay_consistent: "Add both projects to your MatchScore AI resume and ensure all live links work smoothly on mobile.",
    },
    {
      month_number: 5,
      month_title: "Month 5: Mock Interviews, STAR Stories & Cold Inbound Outreach",
      weekly_routine: "2 hours daily: Timed mock interview rounds and writing 4 STAR behavioral stories.",
      dsa_leetcode_target: "Timed problem solving: solve 1 Medium problem in under 25 minutes without hints.",
      project_and_system_goal: "Optimize LinkedIn headline using MatchScore LinkedIn Studio, reach out to 5 startup founders daily.",
      how_to_stay_consistent: "Cold outreach has a 10-15% response rate: sending 50 customized messages will generate 5+ interviews.",
    },
    {
      month_number: 6,
      month_title: "Month 6: Interview Execution, Offer Negotiation & Final Placement",
      weekly_routine: "Focus on interview loops, coding round reviews, and post-interview follow-ups.",
      dsa_leetcode_target: "Revise all previously solved 150 problems (NeetCode 150 list).",
      project_and_system_goal: "Evaluate incoming offers using MatchScore Offer Evaluator and negotiate base compensation.",
      how_to_stay_consistent: "Treat every rejected interview as free diagnostic data to identify and fix your exact weak points.",
    },
  ];

  const studentPack = [
    {
      benefit: "GitHub Student Developer Pack",
      provider: "GitHub",
      how_to_claim: "Sign up with your .edu / college email at education.github.com to get free GitHub Copilot, free domain names, and $100 cloud credits.",
    },
    {
      benefit: "AWS Educate & Cloud Starter Pack",
      provider: "Amazon Web Services",
      how_to_claim: "Register at aws.amazon.com/education/awseducate for free cloud sandbox environments without requiring a credit card.",
    },
    {
      benefit: "JetBrains All Products Pack",
      provider: "JetBrains",
      how_to_claim: "Get free professional IDE licenses (IntelliJ IDEA Ultimate, PyCharm Pro, WebStorm) via your student email.",
    },
    {
      benefit: "Google Cloud for Students",
      provider: "Google Cloud Platform",
      how_to_claim: "Access free Qwiklabs credits and cloud certification learning pathways at cloud.google.com/edu/students.",
    },
  ];

  return {
    student_level: year,
    target_career_path: `${role} (${track})`,
    semesters,
    zero_to_hero_intensive_plan: zeroToHeroPlan,
    free_student_developer_pack_checklist: studentPack,
    capstone_project_guidelines: [
      "Must have a live, working URL (e.g. on Render, Vercel) linked prominently in the GitHub README.",
      "Include a detailed Architecture Diagram (Mermaid or Figma) showing database schemas, API flows, and cloud services.",
      "Provide automated unit tests (Jest, PyTest) and a Dockerfile for single-command reproduction.",
    ],
  };
}
