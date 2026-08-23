/**
 * Module 26 — AI Zero-Experience Starter Project Blueprint (server only).
 *
 * Provides beginner-friendly, step-by-step 48-hour portfolio project blueprints
 * with exact architectures, free hosting options, and resume bullet generators.
 */
import type { AppSupabase } from "./db.server";

export interface StarterProject {
  title: string;
  difficulty_level: "Beginner Friendly" | "Intermediate (2-3 Days)" | "Weekend Hackathon (48 Hours)";
  short_summary: string;
  architecture_components: {
    frontend: string;
    backend: string;
    database_and_cache: string;
    free_deployment_platform: string;
  };
  step_by_step_milestones: string[];
  resume_bullet_point: string;
  demo_video_talking_script: string;
}

export interface StarterProjectsResult {
  preferred_stack: string;
  projects: StarterProject[];
  portfolio_deployment_checklist: string[];
}

export async function generateStarterProjects(
  _supabase: AppSupabase,
  _userId: string,
  input: {
    languageOrFramework: "Python & FastAPI" | "JavaScript / React / Node.js" | "Java & Spring Boot" | "Go & Microservices";
    targetRole: string;
  },
): Promise<StarterProjectsResult> {
  const stack = input.languageOrFramework || "JavaScript / React / Node.js";
  const role = input.targetRole.trim() || "Full Stack Software Engineer";

  const projects: StarterProject[] = [
    {
      title: "Real-Time URL Shortener with Analytics & QR Code API",
      difficulty_level: "Beginner Friendly",
      short_summary: "A production-grade URL shortening web service with click analytics, geo-location tracking, and rate limiting.",
      architecture_components: {
        frontend: "React + Tailwind CSS (hosted on Vercel)",
        backend: "Node.js / Express or FastAPI (hosted on Render)",
        database_and_cache: "PostgreSQL (Supabase) + Redis (Upstash free tier)",
        free_deployment_platform: "Render + Vercel + Upstash Redis",
      },
      step_by_step_milestones: [
        "Day 1 (Morning): Set up database schema with custom Base62 shortcode generator and nanoid algorithm.",
        "Day 1 (Afternoon): Implement redirect endpoint with Redis cache lookup (O(1) retrieval) before querying PostgreSQL.",
        "Day 2 (Morning): Build a sleek dashboard showing click counts, referrers, and browser analytics charts.",
        "Day 2 (Afternoon): Deploy frontend to Vercel, backend to Render, and add GitHub README badge.",
      ],
      resume_bullet_point: "Engineered high-performance URL shortening service with Redis sub-millisecond caching and PostgreSQL analytics, supporting 5,000+ synthetic redirects/sec with 99.9% cache hit ratio.",
      demo_video_talking_script: `"Hi! In this project, I built a high-throughput URL shortening service. I implemented Redis caching to handle sub-millisecond redirect lookups and asynchronous click logging in PostgreSQL, cutting database load by 85%."`,
    },
    {
      title: "AI Document QA & Summarization Micro-SaaS (RAG)",
      difficulty_level: "Weekend Hackathon (48 Hours)",
      short_summary: "Upload PDF or text files and ask questions with AI-grounded semantic search and citation highlights.",
      architecture_components: {
        frontend: "React / Vite with PDF.js document viewer",
        backend: "Python / FastAPI with LangChain or Gemini SDK",
        database_and_cache: "Supabase pgvector / ChromaDB for document embeddings",
        free_deployment_platform: "Render (Backend) + Vercel (Frontend)",
      },
      step_by_step_milestones: [
        "Day 1: Parse PDF text using pdfjs/PyPDF and chunk into 500-token chunks with 50-token overlap.",
        "Day 1: Generate vector embeddings via Google Gemini text-embedding-004 and store in pgvector.",
        "Day 2: Build cosine-similarity retrieval query and stream answers to UI with typing animation.",
        "Day 2: Add rate limiting with Upstash Redis and deploy live demo.",
      ],
      resume_bullet_point: "Architected end-to-end Retrieval-Augmented Generation (RAG) pipeline using Google Gemini API and pgvector, enabling semantic search across 100+ page technical documents with <1.2s average query latency.",
      demo_video_talking_script: `"This is an AI Document QA platform. It chunks uploaded PDFs, computes vector embeddings via Gemini, and runs cosine-similarity queries to ground LLM answers with exact page citations."`,
    },
    {
      title: "Real-Time Collaborative Markdown Editor & Live Preview",
      difficulty_level: "Intermediate (2-3 Days)",
      short_summary: "Multiplayer note-taking app with live cursor sync, markdown rendering, and PDF export.",
      architecture_components: {
        frontend: "React + CodeMirror + React Markdown",
        backend: "Node.js WebSocket server (Socket.io)",
        database_and_cache: "PostgreSQL for persistence, Redis pub/sub for socket broadcasting",
        free_deployment_platform: "Render (Web Service)",
      },
      step_by_step_milestones: [
        "Day 1: Set up WebSocket handshake and room join/leave event lifecycle.",
        "Day 1: Implement operational transformation (OT) or Yjs CRDT for conflict-free multi-user text editing.",
        "Day 2: Add live split-screen preview and one-click PDF generation.",
        "Day 2: Add automated Jest integration tests for socket message delivery.",
      ],
      resume_bullet_point: "Developed collaborative real-time markdown editor with WebSockets and Redis pub/sub, achieving <20ms synchronization latency across concurrent multi-user editing rooms.",
      demo_video_talking_script: `"I built this real-time multiplayer markdown workspace using WebSockets and Redis pub/sub to achieve sub-20ms synchronization across concurrent editors with zero conflict loss."`,
    },
  ];

  return {
    preferred_stack: stack,
    projects,
    portfolio_deployment_checklist: [
      "Every project must have a live working link on Render/Vercel (test on mobile & desktop).",
      "Include a 45-second Loom / YouTube screen recording demo in the GitHub README.",
      "Write clean, modular code with descriptive Git commit messages (e.g. 'feat: implement redis caching layer').",
      "Add automated tests (npm test / pytest) with a green passing badge in your README.",
    ],
  };
}
