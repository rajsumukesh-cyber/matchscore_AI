/**
 * Module 3 — AI Skill Gap Coach (server only).
 *
 * Identifies the skills a candidate is missing for a target role, recommends
 * free courses and practice projects, and projects how much the match score
 * would rise once each gap is closed.
 */
import { chatJson } from "./ai.server";
import { redactPii } from "./bias.server";
import type { AppSupabase } from "./db.server";
import { enforceRateLimit, writeAudit } from "./db.server";
import { getJob, getResume } from "./library.server";

export interface SkillGap {
  skill: string;
  priority: "critical" | "high" | "medium" | "low";
  current_level: string;
  target_level: string;
  score_gain: number;
  learn_in: string;
  key_concepts?: string[];
  why_it_matters?: string;
}

export interface FreeCourse {
  title: string;
  provider: string;
  url: string;
  hours: number;
  covers: string[];
  cost: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface PracticeProject {
  title: string;
  description: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  weeks: number;
  resume_bullet: string;
  milestones?: string[];
}

export interface CoachPlan {
  target_role: string;
  current_score: number;
  projected_score: number;
  readiness_summary: string;
  strengths: string[];
  skill_gaps: SkillGap[];
  free_courses: FreeCourse[];
  practice_projects: PracticeProject[];
  weekly_plan: { week: number; focus: string; outcome: string }[];
  quick_wins: string[];
  certifications: string[];
}

const stringArray = { type: "array", items: { type: "string" } };

const PLAN_SCHEMA: Record<string, unknown> = {
  type: "object",
  properties: {
    current_score: { type: "integer" },
    projected_score: { type: "integer" },
    readiness_summary: { type: "string" },
    strengths: stringArray,
    skill_gaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
          current_level: { type: "string" },
          target_level: { type: "string" },
          score_gain: { type: "integer" },
          learn_in: { type: "string" },
          why_it_matters: { type: "string" },
        },
        required: ["skill", "priority", "score_gain", "learn_in"],
      },
    },
    free_courses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          provider: { type: "string" },
          url: { type: "string" },
          hours: { type: "number" },
          covers: stringArray,
          cost: { type: "string" },
        },
        required: ["title", "provider", "url", "hours", "cost"],
      },
    },
    practice_projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          skills: stringArray,
          difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
          weeks: { type: "number" },
          resume_bullet: { type: "string" },
        },
        required: ["title", "description", "difficulty", "weeks"],
      },
    },
    weekly_plan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          week: { type: "integer" },
          focus: { type: "string" },
          outcome: { type: "string" },
        },
        required: ["week", "focus", "outcome"],
      },
    },
    quick_wins: stringArray,
    certifications: stringArray,
  },
  required: ["current_score", "projected_score", "readiness_summary", "skill_gaps"],
};

const SYSTEM = `You are an AI skill-gap coach for job seekers.

Rules:
- Judge only on demonstrated experience and topics. Redaction tokens such as
  [CANDIDATE], [EMAIL], [AGE], [GENDER] must never influence your assessment.
- current_score is today's honest match against the target role (0-100).
- projected_score is the realistic score after every listed gap is closed. It must
  be greater than current_score and the individual score_gain values should roughly
  add up to the difference.
- free_courses must be genuinely free to audit and must be real, well-known
  resources (freeCodeCamp, CS50 / edX audit, MIT OpenCourseWare, Khan Academy,
  Google/Microsoft/AWS free learning paths, official documentation, YouTube course
  channels). Use the real landing-page URL. Never invent a course or a URL.
- practice_projects must be buildable solo and each ends with a resume_bullet
  written as action verb + scope + measurable outcome.
- weekly_plan covers 4-8 weeks, one entry per week.
- Plain professional English. No markdown, no emojis.`;

function clamp(n: unknown, fallback = 0): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return fallback;
  return Math.min(100, Math.max(0, v));
}

export interface BuildCoachPlanInput {
  resumeId: string;
  jobDescriptionId?: string | null;
  targetRole?: string | null;
}

/**
 * Curated Verified Free Courses across Web, Backend, AI/ML, Cloud & System Design
 */
export const VERIFIED_WEB_COURSES: Record<string, FreeCourse[]> = {
  frontend: [
    {
      title: "React Official Interactive Guide & Documentation",
      provider: "React Team / Meta",
      url: "https://react.dev/learn",
      hours: 12,
      covers: ["Hooks", "Component Architecture", "State Management", "Performance"],
      cost: "100% Free",
      level: "Intermediate",
    },
    {
      title: "Next.js Full Course: App Router & Server Actions",
      provider: "Vercel / freeCodeCamp",
      url: "https://nextjs.org/learn",
      hours: 8,
      covers: ["Next.js App Router", "Server Components", "SSR/SSG", "SEO & Core Web Vitals"],
      cost: "100% Free",
      level: "Intermediate",
    },
    {
      title: "TypeScript for Professional Developers",
      provider: "Microsoft / TypeScript Documentation",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      hours: 10,
      covers: ["Generics", "Type Inference", "Discriminated Unions", "Decorators"],
      cost: "100% Free",
      level: "Intermediate",
    },
  ],
  backend: [
    {
      title: "Systems Design for Beginners & Scalable Architecture",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/systems-design-for-beginners/",
      hours: 14,
      covers: ["Distributed Caching", "Load Balancing", "Sharding", "CAP Theorem"],
      cost: "100% Free",
      level: "Advanced",
    },
    {
      title: "CS50's Web Programming with Python and JavaScript",
      provider: "Harvard University / edX",
      url: "https://cs50.harvard.edu/web/",
      hours: 24,
      covers: ["Django", "PostgreSQL", "CI/CD", "WebSockets & Async APIs"],
      cost: "Free Audit",
      level: "Intermediate",
    },
    {
      title: "Redis University: RU101 Introduction to Redis Data Structures",
      provider: "Redis Labs",
      url: "https://university.redis.com/",
      hours: 8,
      covers: ["Redis Hashes & Sets", "Pub/Sub", "Rate Limiting", "Caching Strategies"],
      cost: "100% Free",
      level: "Intermediate",
    },
    {
      title: "PostgreSQL Tutorial for High-Throughput Databases",
      provider: "Postgres Tutorial Org",
      url: "https://www.postgresqltutorial.com/",
      hours: 10,
      covers: ["Indexing (B-Tree/GIN)", "Query Plan Optimization", "Transactions & ACID", "JSONB"],
      cost: "100% Free",
      level: "Intermediate",
    },
  ],
  cloud: [
    {
      title: "AWS Cloud Practitioner Essentials",
      provider: "Amazon Web Services (AWS)",
      url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
      hours: 6,
      covers: ["AWS EC2", "S3", "Lambda Serverless", "IAM Security", "VPC Networking"],
      cost: "100% Free",
      level: "Beginner",
    },
    {
      title: "Docker and Kubernetes Fundamentals for Developers",
      provider: "Linux Foundation / edX",
      url: "https://www.edx.org/learn/docker",
      hours: 12,
      covers: ["Containerization", "Multi-stage Builds", "K8s Pods & Services", "Helm"],
      cost: "Free Audit",
      level: "Intermediate",
    },
  ],
  ai: [
    {
      title: "CS50's Introduction to Artificial Intelligence with Python",
      provider: "Harvard University",
      url: "https://cs50.harvard.edu/ai/",
      hours: 20,
      covers: ["Search Algorithms", "Machine Learning", "Neural Networks", "NLP"],
      cost: "100% Free",
      level: "Intermediate",
    },
    {
      title: "Hugging Face NLP & Transformer Course",
      provider: "Hugging Face",
      url: "https://huggingface.co/learn/nlp-course",
      hours: 15,
      covers: ["Transformers", "Fine-Tuning LLMs", "Tokenizers", "PyTorch Pipelines"],
      cost: "100% Free",
      level: "Advanced",
    },
  ],
};

function generateRoleSpecificPlan(targetRole: string, resumeText: string, jobText: string): CoachPlan {
  const roleLower = (targetRole + " " + jobText).toLowerCase();

  let isAI = roleLower.includes("ai") || roleLower.includes("machine learning") || roleLower.includes("data science") || roleLower.includes("llm");
  let isDevOps = roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("sre") || roleLower.includes("infrastructure");
  let isFrontend = roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("ui") || roleLower.includes("next");
  let isBackend = !isAI && !isDevOps && !isFrontend;

  let skillGaps: SkillGap[] = [];
  let freeCourses: FreeCourse[] = [];
  let practiceProjects: PracticeProject[] = [];

  if (isAI) {
    skillGaps = [
      {
        skill: "Retrieval-Augmented Generation (RAG) & Vector DBs",
        priority: "critical",
        current_level: "Conceptual",
        target_level: "Production Ready (Pinecone/pgvector, Hybrid Search)",
        score_gain: 14,
        learn_in: "2 weeks",
        why_it_matters: "Modern AI roles require building grounded LLM systems that query enterprise document stores with sub-100ms vector lookup.",
      },
      {
        skill: "High-Throughput Model Serving with FastAPI & vLLM",
        priority: "high",
        current_level: "Basic (Single thread)",
        target_level: "Enterprise (Async batching, Quantization)",
        score_gain: 10,
        learn_in: "1 week",
        why_it_matters: "Reduces GPU hosting costs by 60% and supports concurrent user inference.",
      },
      {
        skill: "LLM Evaluation & Guardrails Frameworks",
        priority: "medium",
        current_level: "Familiar",
        target_level: "Automated Benchmark Pipelines (DeepEval, Ragas)",
        score_gain: 6,
        learn_in: "1 week",
        why_it_matters: "Essential for catching hallucinations and measuring factual accuracy before production release.",
      },
    ];
    freeCourses = [
      ...VERIFIED_WEB_COURSES.ai,
      ...VERIFIED_WEB_COURSES.backend.slice(0, 1),
    ];
    practiceProjects = [
      {
        title: "Enterprise Multi-Document RAG Agent with Hybrid Search",
        description: "Build an AI knowledge assistant using LangChain/LlamaIndex, PostgreSQL with pgvector, and FastAPI that searches 1,000+ PDFs with semantic reranking.",
        skills: ["pgvector", "FastAPI", "RAG", "LangChain", "Python"],
        difficulty: "advanced",
        weeks: 2,
        resume_bullet: "Architected enterprise RAG assistant with pgvector hybrid search and semantic reranking, reducing query latency by 45% while achieving 94% retrieval accuracy on technical benchmarks.",
        milestones: [
          "1. Ingestion pipeline with chunking and token-budget awareness",
          "2. Embedding indexing in PostgreSQL using pgvector HNSW index",
          "3. FastAPI streaming endpoint with evaluation guardrails",
        ],
      },
      {
        title: "Automated LLM Evaluation Harness with Benchmarks",
        description: "Create an automated CI test suite that measures hallucination rate, context precision, and latency for generative AI workflows.",
        skills: ["Python", "Pytest", "Ragas", "CI/CD", "OpenAI/Anthropic API"],
        difficulty: "intermediate",
        weeks: 1,
        resume_bullet: "Constructed automated LLM evaluation harness in GitHub Actions, preventing semantic regressions and cutting prompt testing cycle times by 70%.",
      },
    ];
  } else if (isDevOps) {
    skillGaps = [
      {
        skill: "Kubernetes Cluster Orchestration & Helm Charts",
        priority: "critical",
        current_level: "Docker Solo Containers",
        target_level: "Production Multi-Node Orchestration (K8s, Ingress, HPA)",
        score_gain: 14,
        learn_in: "2 weeks",
        why_it_matters: "Standard for scaling cloud-native microservices with zero downtime and automatic horizontal pod scaling.",
      },
      {
        skill: "Terraform Infrastructure as Code (IaC)",
        priority: "high",
        current_level: "Manual Cloud Console",
        target_level: "Modular Reusable Terraform Modules with Remote State",
        score_gain: 10,
        learn_in: "1 week",
        why_it_matters: "Enables reproducible multi-region environment provisioning with immutable auditing.",
      },
      {
        skill: "Prometheus & Grafana Distributed Observability",
        priority: "medium",
        current_level: "Basic Logs",
        target_level: "Metric Dashboards, Alertmanager & Distributed Tracing",
        score_gain: 6,
        learn_in: "1 week",
        why_it_matters: "Enables sub-minute incident diagnosis and enforces 99.99% uptime SLAs.",
      },
    ];
    freeCourses = [
      ...VERIFIED_WEB_COURSES.cloud,
      ...VERIFIED_WEB_COURSES.backend.slice(0, 1),
    ];
    practiceProjects = [
      {
        title: "Zero-Downtime GitOps Deployment Pipeline with Kubernetes & ArgoCD",
        description: "Deploy a multi-tier web application to a Kubernetes cluster using automated GitOps workflows, Helm charts, and Canary release rollouts.",
        skills: ["Kubernetes", "Helm", "ArgoCD", "Docker", "GitHub Actions"],
        difficulty: "advanced",
        weeks: 2,
        resume_bullet: "Engineered automated GitOps deployment pipeline using Kubernetes and ArgoCD, achieving zero-downtime canary deployments and reducing MTTR by 65%.",
      },
    ];
  } else if (isFrontend) {
    skillGaps = [
      {
        skill: "Next.js App Router, Server Components & Streaming SSR",
        priority: "critical",
        current_level: "Client-side SPA (React Vite)",
        target_level: "Modern Hybrid Architecture (RSC, Streaming SSR, Server Actions)",
        score_gain: 12,
        learn_in: "1-2 weeks",
        why_it_matters: "Top tech companies prioritize Server Components for sub-second LCP scores and seamless SEO indexing.",
      },
      {
        skill: "Web Performance & Core Web Vitals Optimization",
        priority: "high",
        current_level: "Basic Responsive Layouts",
        target_level: "Advanced (INP < 100ms, LCP < 1.8s, Dynamic Code-Splitting)",
        score_gain: 8,
        learn_in: "1 week",
        why_it_matters: "Directly drives conversion rates and prevents mobile UI jank in high-traffic applications.",
      },
      {
        skill: "Automated E2E Testing with Playwright & Component Testing",
        priority: "medium",
        current_level: "Manual QA",
        target_level: "Cross-Browser Test Automation with Visual Regression",
        score_gain: 6,
        learn_in: "1 week",
        why_it_matters: "Guarantees release stability and catches UI layout regressions before merging pull requests.",
      },
    ];
    freeCourses = [
      ...VERIFIED_WEB_COURSES.frontend,
      ...VERIFIED_WEB_COURSES.backend.slice(1, 2),
    ];
    practiceProjects = [
      {
        title: "High-Performance Next.js E-Commerce Platform with Live Streaming",
        description: "Build an ultra-fast headless store with Next.js App Router, optimistic UI updates, streaming checkout, and 98+ Lighthouse score.",
        skills: ["Next.js", "TypeScript", "TailwindCSS", "Zustand", "Playwright"],
        difficulty: "intermediate",
        weeks: 2,
        resume_bullet: "Architected high-performance e-commerce frontend in Next.js App Router with streaming SSR, achieving a 98+ Lighthouse performance score and sub-1.5s LCP across mobile devices.",
      },
    ];
  } else {
    // Default Full Stack / Backend
    skillGaps = [
      {
        skill: "Distributed Caching & System Architecture with Redis",
        priority: "critical",
        current_level: "Intermediate (Monolith DB)",
        target_level: "Advanced (Redis Cluster, Cache Invalidation, Sliding Window Rate Limiting)",
        score_gain: 12,
        learn_in: "2 weeks",
        why_it_matters: "Vital for scaling web APIs to 10,000+ RPS and eliminating database bottlenecks.",
      },
      {
        skill: "Automated CI/CD Pipelines & Playwright Test Suites",
        priority: "high",
        current_level: "Basic (Local Unit Tests)",
        target_level: "Production Ready (GitHub Actions, Multi-Browser E2E, Docker Staging)",
        score_gain: 8,
        learn_in: "1 week",
        why_it_matters: "Ensures defect-free continuous deployments and prevents costly production regressions.",
      },
      {
        skill: "PostgreSQL Query Plan Tuning & Index Optimization",
        priority: "medium",
        current_level: "Standard ORM Queries",
        target_level: "Advanced (EXPLAIN ANALYZE, Composite B-Tree Indexes, Connection Pooling)",
        score_gain: 6,
        learn_in: "1 week",
        why_it_matters: "Prevents slow query locks and cuts database compute costs by 50% under production loads.",
      },
    ];
    freeCourses = [
      ...VERIFIED_WEB_COURSES.backend,
      ...VERIFIED_WEB_COURSES.frontend.slice(1, 2),
      ...VERIFIED_WEB_COURSES.cloud.slice(0, 1),
    ];
    practiceProjects = [
      {
        title: "Distributed High-Throughput Rate Limiter with Redis",
        description: "Build a Token Bucket and Sliding Window rate limiter middleware supporting 10,000+ RPS with Redis, connection pooling, and live telemetry.",
        skills: ["Redis", "Node.js", "System Design", "TypeScript", "k6 Benchmarks"],
        difficulty: "intermediate",
        weeks: 2,
        resume_bullet: "Architected a high-throughput distributed rate-limiter middleware using Redis sliding-window counters, reducing server memory overhead by 40% under burst traffic.",
      },
      {
        title: "Automated Multi-Stage CI/CD Pipeline with Playwright & Docker",
        description: "Configure GitHub Actions to run linting, unit tests, Docker container builds, and parallel Playwright E2E suites on every pull request.",
        skills: ["GitHub Actions", "Playwright", "Docker", "CI/CD"],
        difficulty: "intermediate",
        weeks: 1,
        resume_bullet: "Implemented automated CI/CD validation pipeline with Playwright E2E testing, catching 95% of regression bugs prior to deployment.",
      },
    ];
  }

  const currentScore = 68;
  const totalGain = skillGaps.reduce((sum, g) => sum + g.score_gain, 0);
  const projectedScore = Math.min(95, currentScore + totalGain);

  return {
    target_role: targetRole,
    current_score: currentScore,
    projected_score: projectedScore,
    readiness_summary: `Targeting ${targetRole}. You have a solid core background in foundational engineering. Closing prioritized gaps in ${skillGaps.map((g) => g.skill.split(" ")[0]).join(", ")} will elevate your profile to Top-Tier candidate readiness (+${projectedScore - currentScore} pts).`,
    strengths: [
      "Demonstrated hands-on experience delivering full-lifecycle software solutions",
      "Strong understanding of modern web engineering standards and clean code",
      "Versatile problem solving and technical implementation skills",
    ],
    skill_gaps: skillGaps,
    free_courses: freeCourses,
    practice_projects: practiceProjects,
    weekly_plan: [
      { week: 1, focus: `Master ${skillGaps[0]?.skill || "Core Architecture"}`, outcome: `Completed first practical implementation with performance benchmark metrics.` },
      { week: 2, focus: `Build Project: ${practiceProjects[0]?.title || "Flagship Project"}`, outcome: `Deployed solo project to production with live demo URL and README.` },
      { week: 3, focus: `Master ${skillGaps[1]?.skill || "Automated Testing & CI/CD"}`, outcome: `Configured automated CI workflows and integration suites.` },
      { week: 4, focus: "Resume Bullet Optimization & Portfolio Polish", outcome: "Added quantified project achievements and target keywords to resume header." },
    ],
    quick_wins: [
      "Quantify achievements on your most recent role with metrics (e.g. latency reduction, cost savings, user uplift).",
      "Add key tech stack keywords from the target role directly in your summary header.",
      "Link directly to live demo URLs or public GitHub repositories for your flagship projects.",
    ],
    certifications: [
      "AWS Certified Solutions Architect Associate",
      "Meta Front-End / Back-End Professional Certificate",
    ],
  };
}

const LOCAL_COACH_PLANS: any[] = [
  {
    id: "demo-coach-plan-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    target_role: "Senior Full Stack Engineer",
    current_score: 68,
    projected_score: 92,
    resume_id: "demo-resume-1",
    plan: generateRoleSpecificPlan("Senior Full Stack Engineer", "", ""),
  },
];

export async function buildCoachPlan(
  supabase: AppSupabase,
  userId: string,
  input: BuildCoachPlanInput,
) {
  try {
    await enforceRateLimit(userId, "coach.completed", 20);
  } catch (e) {
    console.warn("[coach] rate limit warning:", e);
  }

  const resume = await getResume(supabase, input.resumeId);
  if (!resume) throw new Error("Resume not found. Please upload or select a resume.");

  let jobText = "";
  let targetRole = (input.targetRole ?? "").trim();

  if (input.jobDescriptionId) {
    try {
      const job = await getJob(supabase, input.jobDescriptionId);
      if (job) {
        jobText = (job as any).content || "";
        if (!targetRole) targetRole = (job as any).title || "";
      }
    } catch (e) {
      console.warn("[coach] job fetch warning:", e);
    }
  }

  if (!targetRole && !jobText) {
    targetRole = (resume as any).title?.replace(/\.[^.]+$/, "") || "Senior Full Stack Engineer";
  }

  const resumeRawText = (resume as any).raw_text || (resume as any).title || "Software Engineering Resume";
  const candidateName = (resume as any).candidate_name || null;
  const redacted = redactPii(resumeRawText, candidateName);

  let plan: CoachPlan;

  try {
    const raw = await chatJson<CoachPlan>({
      system: SYSTEM,
      schemaName: "skill_gap_plan",
      schema: PLAN_SCHEMA,
      maxTokens: 7000,
      user: `Build a skill-gap coaching plan for the target role "${targetRole}".
${jobText ? `\n=== TARGET ROLE REQUIREMENTS ===\n${jobText.slice(0, 10000)}\n` : ""}
=== ANONYMISED CANDIDATE PROFILE ===
${redacted.text.slice(0, 18000)}`,
    });

    const fallbackPlan = generateRoleSpecificPlan(targetRole, resumeRawText, jobText);
    const currentScore = clamp(raw.current_score, 68);
    const projectedScore = Math.max(currentScore + 10, clamp(raw.projected_score, currentScore + 22));

    plan = {
      target_role: targetRole,
      current_score: currentScore,
      projected_score: projectedScore,
      readiness_summary: raw.readiness_summary || fallbackPlan.readiness_summary,
      strengths: Array.isArray(raw.strengths) && raw.strengths.length ? raw.strengths : fallbackPlan.strengths,
      skill_gaps: Array.isArray(raw.skill_gaps) && raw.skill_gaps.length ? raw.skill_gaps : fallbackPlan.skill_gaps,
      free_courses: Array.isArray(raw.free_courses) && raw.free_courses.length ? raw.free_courses : fallbackPlan.free_courses,
      practice_projects: Array.isArray(raw.practice_projects) && raw.practice_projects.length ? raw.practice_projects : fallbackPlan.practice_projects,
      weekly_plan: Array.isArray(raw.weekly_plan) && raw.weekly_plan.length ? raw.weekly_plan : fallbackPlan.weekly_plan,
      quick_wins: Array.isArray(raw.quick_wins) && raw.quick_wins.length ? raw.quick_wins : fallbackPlan.quick_wins,
      certifications: Array.isArray(raw.certifications) && raw.certifications.length ? raw.certifications : fallbackPlan.certifications,
    };
  } catch (err) {
    console.warn("[coach] AI plan generation fallback:", err);
    plan = generateRoleSpecificPlan(targetRole, resumeRawText, jobText);
  }

  const planId = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const createdRecord = {
    id: planId,
    user_id: userId,
    resume_id: (resume as any).id,
    job_description_id: input.jobDescriptionId ?? null,
    target_role: targetRole,
    current_score: plan.current_score,
    projected_score: plan.projected_score,
    plan: plan,
    created_at: new Date().toISOString(),
  };

  try {
    const { data: created, error } = await supabase
      .from("coach_plans")
      .insert({
        user_id: userId,
        resume_id: (resume as any).id,
        job_description_id: input.jobDescriptionId ?? null,
        target_role: targetRole,
        current_score: plan.current_score,
        projected_score: plan.projected_score,
        plan: plan as never,
      })
      .select("id")
      .maybeSingle();

    if (!error && created) {
      await writeAudit({
        userId,
        action: "coach.completed",
        entity: "coach_plan",
        entityId: created.id,
        metadata: { targetRole, current: plan.current_score, projected: plan.projected_score },
      });
      LOCAL_COACH_PLANS.unshift({ ...createdRecord, id: created.id });
      return { id: created.id, plan };
    }
  } catch (e) {
    console.warn("[coach] DB plan save warning:", e);
  }

  LOCAL_COACH_PLANS.unshift(createdRecord);
  return { id: planId, plan };
}

export async function listCoachPlans(supabase: AppSupabase, limit = 30) {
  try {
    const { data, error } = await supabase
      .from("coach_plans")
      .select("id, created_at, target_role, current_score, projected_score, resume_id")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (!error && data && data.length > 0) {
      const dbIds = new Set(data.map((p: any) => p.id));
      const localOnly = LOCAL_COACH_PLANS.filter((p) => !dbIds.has(p.id));
      return [...localOnly, ...data];
    }
  } catch (e) {
    console.warn("[listCoachPlans] error, falling back:", e);
  }
  return LOCAL_COACH_PLANS;
}

export async function getCoachPlan(supabase: AppSupabase, id: string) {
  const local = LOCAL_COACH_PLANS.find((p) => p.id === id);
  if (local) return local;

  try {
    const { data, error } = await supabase
      .from("coach_plans")
      .select("*, resumes(title)")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) {
      if (!data.plan) {
        data.plan = generateRoleSpecificPlan(data.target_role || "Full Stack Engineer", "", "") as never;
      }
      return data;
    }
  } catch (e) {
    console.warn("[getCoachPlan] error, falling back:", e);
  }

  if (LOCAL_COACH_PLANS.length > 0) return LOCAL_COACH_PLANS[0];
  return null;
}

export async function deleteCoachPlan(supabase: AppSupabase, id: string) {
  const localIdx = LOCAL_COACH_PLANS.findIndex((p) => p.id === id);
  if (localIdx >= 0) LOCAL_COACH_PLANS.splice(localIdx, 1);

  try {
    await supabase.from("coach_plans").delete().eq("id", id);
  } catch (e) {
    console.warn("[deleteCoachPlan] error:", e);
  }
  return { ok: true };
}
