/**
 * Module 26 — AI Zero-Experience Starter Project Blueprint & Guided Code Roadmap (server only).
 *
 * Enhanced with step-by-step beginner code templates, architectural diagrams,
 * common beginner error fixes (CORS, ENV leaks), and interactive hour-by-hour roadmaps.
 */
import type { AppSupabase } from "./db.server";

export interface CodeTemplateSnippet {
  filename: string;
  language: string;
  code_content: string;
  explanation: string;
}

export interface BeginnerRoadmapHourBlock {
  time_window: string;
  milestone_title: string;
  tasks_to_complete: string[];
  beginner_pitfall_and_fix: string;
}

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
  hour_by_hour_roadmap: BeginnerRoadmapHourBlock[];
  starter_code_templates: CodeTemplateSnippet[];
  resume_bullet_point: string;
  demo_video_talking_script: string;
}

export interface StarterProjectsResult {
  preferred_stack: string;
  projects: StarterProject[];
  zero_to_hero_rules: string[];
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
      short_summary: "A production-grade URL shortening web service with click analytics, geo-location tracking, and sub-millisecond Redis caching.",
      architecture_components: {
        frontend: "React + Tailwind CSS + Lucide Icons (hosted on Vercel)",
        backend: "Node.js / Express or FastAPI (hosted on Render)",
        database_and_cache: "PostgreSQL (Supabase free tier) + Redis (Upstash free tier)",
        free_deployment_platform: "Render + Vercel + Upstash Redis",
      },
      hour_by_hour_roadmap: [
        {
          time_window: "Hours 0 to 12 (Day 1 Morning)",
          milestone_title: "Database Schema & Shortcode Generator",
          tasks_to_complete: [
            "Initialize Node.js/Express server and install dotenv, cors, pg, and @upstash/redis.",
            "Design PostgreSQL 'urls' table with original_url, short_code, click_count, and created_at columns.",
            "Write a shortcode generator using nanoid(7) or Base62 encoding algorithm.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Storing shortcodes without a UNIQUE database constraint. Fix: Add 'UNIQUE(short_code)' in SQL to prevent collisions.",
        },
        {
          time_window: "Hours 12 to 24 (Day 1 Afternoon & Evening)",
          milestone_title: "Redis Sub-Millisecond Caching & Redirect API",
          tasks_to_complete: [
            "Create POST /api/shorten endpoint: saves URL in PostgreSQL and primes the Redis cache.",
            "Create GET /:code endpoint: checks Redis cache first (O(1) time). If cache hit, redirects instantly; if cache miss, queries DB and populates cache.",
            "Implement asynchronous click_count increment in the background so redirects stay under 20ms.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Database latency slowing down every redirect. Fix: Upstash Redis cache serves 95% of redirects without touching the database.",
        },
        {
          time_window: "Hours 24 to 36 (Day 2 Morning)",
          milestone_title: "React Analytics Dashboard & QR Generator",
          tasks_to_complete: [
            "Create responsive URL submission form with copy-to-clipboard button and toast notifications.",
            "Integrate qrcode.react to automatically display a downloadable QR code for shortened links.",
            "Add click count analytics cards and recent URLs history list stored in LocalStorage.",
          ],
          beginner_pitfall_and_fix: "Pitfall: CORS policy error in browser console. Fix: Add 'app.use(cors())' on backend server to allow frontend origins.",
        },
        {
          time_window: "Hours 36 to 48 (Day 2 Afternoon)",
          milestone_title: "1-Click Free Deployment & GitHub README",
          tasks_to_complete: [
            "Deploy backend to Render as a Web Service (add PORT and DATABASE_URL in Environment Variables).",
            "Deploy frontend to Vercel and connect custom domain or free .vercel.app link.",
            "Write a recruiter-friendly README with architecture diagram, live link, and setup commands.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Hardcoding localhost:5000 in frontend. Fix: Use import.meta.env.VITE_API_URL for dynamic production URLs.",
        },
      ],
      starter_code_templates: [
        {
          filename: "schema.sql",
          language: "sql",
          code_content: `CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on short_code for ultra-fast lookup
CREATE INDEX idx_urls_short_code ON urls(short_code);`,
          explanation: "PostgreSQL schema with an index on short_code for O(log N) lookup speed.",
        },
        {
          filename: "server.js",
          language: "javascript",
          code_content: `import express from "express";
import cors from "cors";
import { Redis } from "@upstash/redis";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Fast Redirect with Redis Cache Layer
app.get("/:code", async (req, res) => {
  const { code } = req.params;
  
  // 1. Check Redis Cache First
  const cachedUrl = await redis.get(code);
  if (cachedUrl) {
    // Async increment click count without blocking redirect
    pool.query("UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1", [code]);
    return res.redirect(301, cachedUrl);
  }

  // 2. Cache Miss: Query PostgreSQL
  const { rows } = await pool.query("SELECT original_url FROM urls WHERE short_code = $1", [code]);
  if (rows.length === 0) return res.status(404).send("Short URL not found");

  const originalUrl = rows[0].original_url;
  await redis.set(code, originalUrl, { ex: 86400 }); // Cache for 24 hours
  res.redirect(301, originalUrl);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running!"));`,
          explanation: "Express backend utilizing Redis caching pattern to absorb 90%+ database read traffic.",
        },
      ],
      resume_bullet_point: "Engineered high-performance URL shortening service with Redis sub-millisecond caching and PostgreSQL analytics, supporting 5,000+ synthetic redirects/sec with 99.9% cache hit ratio.",
      demo_video_talking_script: `"Hi! In this project, I built a high-throughput URL shortening service. I implemented Redis caching to handle sub-millisecond redirect lookups and asynchronous click logging in PostgreSQL, cutting database load by 85%."`,
    },
    {
      title: "AI Document QA & Summarization Micro-SaaS (RAG)",
      difficulty_level: "Weekend Hackathon (48 Hours)",
      short_summary: "Upload PDF or text files and ask questions with AI-grounded semantic search and citation highlights.",
      architecture_components: {
        frontend: "React + Tailwind + PDF.js document viewer",
        backend: "Python / FastAPI with Google Gemini SDK",
        database_and_cache: "Supabase pgvector / ChromaDB for document embeddings",
        free_deployment_platform: "Render (Backend) + Vercel (Frontend)",
      },
      hour_by_hour_roadmap: [
        {
          time_window: "Hours 0 to 12",
          milestone_title: "PDF Parsing & Chunking Engine",
          tasks_to_complete: [
            "Set up FastAPI app with PyPDF/pdfplumber to extract clean text from uploaded files.",
            "Implement a recursive text chunker splitting documents into 500-token chunks with 50-token overlap.",
            "Set up Supabase pgvector extension to store document embeddings.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Passing entire 50-page PDF to LLM directly causes token timeout. Fix: Chunking into 500 tokens ensures fast response and low cost.",
        },
        {
          time_window: "Hours 12 to 24",
          milestone_title: "Vector Embeddings & Semantic Search",
          tasks_to_complete: [
            "Use Gemini text-embedding-004 to generate 768-dimension vectors for each chunk.",
            "Write a PostgreSQL cosine distance query: '1 - (embedding <=> query_embedding) AS similarity'.",
            "Test similarity search with sample questions and verify top 3 most relevant chunks are returned.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Slow vector lookups. Fix: Create an HNSW index on the embedding column in PostgreSQL.",
        },
        {
          time_window: "Hours 24 to 36",
          milestone_title: "Grounded LLM Prompting & React Chat UI",
          tasks_to_complete: [
            "Construct grounded system prompt: 'Answer the question using ONLY the provided context snippets'.",
            "Build a modern split-screen React UI: PDF viewer on left, chat conversation on right.",
            "Stream Gemini AI response text with typewriter animation.",
          ],
          beginner_pitfall_and_fix: "Pitfall: AI hallucinating false information. Fix: Strictly instruct the system prompt to return 'Not mentioned in document' if similarity score is low.",
        },
        {
          time_window: "Hours 36 to 48",
          milestone_title: "Deploy & Add Recruiter Demo Badges",
          tasks_to_complete: [
            "Deploy FastAPI to Render using requirements.txt and Uvicorn server.",
            "Deploy React app to Vercel and record a 60-second walkthrough video.",
            "Publish GitHub repo with live URL and sample test PDFs.",
          ],
          beginner_pitfall_and_fix: "Pitfall: Committing API keys to GitHub. Fix: Always use .env file and add .env to .gitignore.",
        },
      ],
      starter_code_templates: [
        {
          filename: "rag_engine.py",
          language: "python",
          code_content: `import os
from google import genai
from fastapi import FastAPI, UploadFile, File
from pypdf import PdfReader

app = FastAPI()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

@app.post("/ask")
async def ask_document(query: str, context_chunks: list[str]):
    # Grounded prompt preventing hallucination
    prompt = f"""You are a precise technical document assistant. 
Answer the user's question using ONLY the context provided below. 
If the answer is not contained in the context, say "This information is not found in the uploaded document."

CONTEXT:
{" ".join(context_chunks)}

QUESTION:
{query}"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return {"answer": response.text}`,
          explanation: "FastAPI endpoint using Google Gemini 2.5 Flash for low-latency grounded document question answering.",
        },
      ],
      resume_bullet_point: "Architected end-to-end Retrieval-Augmented Generation (RAG) pipeline using Google Gemini API and pgvector, enabling semantic search across 100+ page technical documents with <1.2s average query latency.",
      demo_video_talking_script: `"This is an AI Document QA platform. It chunks uploaded PDFs, computes vector embeddings via Gemini, and runs cosine-similarity queries to ground LLM answers with exact page citations."`,
    },
  ];

  return {
    preferred_stack: stack,
    projects,
    zero_to_hero_rules: [
      "Rule 1: Focus on shipping 1 project completely with a live URL rather than starting 5 unfinished tutorials.",
      "Rule 2: A recruiter spends 30 seconds on your resume: make sure your live link is clickable right at the top of your project section.",
      "Rule 3: Always add a database and caching layer: pure frontend calculators look like student homework; adding PostgreSQL + Redis turns it into enterprise engineering.",
      "Rule 4: Record a 45-second Loom screen recording showing the app in action: 90% of candidates never do this, giving you an immediate competitive advantage.",
    ],
    portfolio_deployment_checklist: [
      "Every project has a live working link on Render/Vercel (tested on mobile & desktop).",
      "GitHub repo contains a clean architecture diagram and descriptive commit history.",
      "Automated tests (npm test / pytest) passing with a green badge in your README.",
      "Added to LinkedIn featured section with a 3-sentence summary of what you built.",
    ],
  };
}
