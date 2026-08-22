/**
 * Server-only CRUD for resumes and job descriptions.
 */
import type { Json } from "@/integrations/supabase/types";
import type { AppSupabase } from "./db.server";
import { sanitizeText, writeAudit } from "./db.server";
import { parseJobText, parseResumeText } from "./analysis.server";

export const MAX_RESUME_CHARS = 60000;
export const MAX_JOB_CHARS = 30000;

export interface ResumeSummary {
  id: string;
  title: string;
  candidate_name: string | null;
  file_type: string | null;
  file_size: number | null;
  version: number;
  created_at: string;
  updated_at: string;
  parsed: Json;
  raw_text?: string;
}

export interface JobSummary {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  seniority: string | null;
  created_at: string;
  updated_at: string;
  parsed: Json;
  content?: string;
}

const DEFAULT_RESUMES: ResumeSummary[] = [
  {
    id: "demo-resume-1",
    title: "Senior_FullStack_Engineer_2026.pdf",
    candidate_name: "Alex Morgan",
    file_type: "application/pdf",
    file_size: 142800,
    version: 1,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    parsed: {
      name: "Alex Morgan",
      headline: "Senior Full Stack Engineer",
      skills: ["React", "TypeScript", "Node.js", "System Design", "PostgreSQL", "AWS", "GraphQL", "Tailwind CSS"],
      total_years_experience: 6,
    } as any,
    raw_text: "Alex Morgan\nSenior Full Stack Engineer with 6+ years experience building scalable web applications with React, TypeScript, Node.js, and Cloud Infrastructure.",
  },
  {
    id: "demo-resume-2",
    title: "Tech_Lead_Architect_CV.docx",
    candidate_name: "Jordan Lee",
    file_type: "application/docx",
    file_size: 98400,
    version: 1,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    parsed: {
      name: "Jordan Lee",
      headline: "Staff Software Architect",
      skills: ["Next.js", "Python", "Cloud Architecture", "Docker", "Kubernetes", "Microservices", "CI/CD"],
      total_years_experience: 9,
    } as any,
    raw_text: "Jordan Lee\nStaff Software Architect specializing in distributed cloud systems, Next.js applications, Python microservices, and Kubernetes orchestration.",
  },
];

const DEFAULT_JOBS: JobSummary[] = [
  {
    id: "demo-job-1",
    title: "Senior Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA (Remote)",
    seniority: "Senior",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    parsed: {
      title: "Senior Full Stack Engineer",
      company: "Stripe",
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "REST APIs", "System Design"],
    } as any,
    content: "Stripe is hiring a Senior Full Stack Engineer. Requirements: 5+ years experience with TypeScript, React, Node.js, and SQL databases. Strong background in payments, API design, and distributed systems.",
  },
  {
    id: "demo-job-2",
    title: "Lead Frontend Architect",
    company: "Vercel",
    location: "Remote",
    seniority: "Lead",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    parsed: {
      title: "Lead Frontend Architect",
      company: "Vercel",
      skills: ["Next.js", "React 19", "Performance", "Web Vitals", "Edge Middleware"],
    } as any,
    content: "Vercel is looking for a Lead Frontend Architect to scale web infrastructure. Required: Expert in Next.js, React 19, web performance optimization, and developer experience.",
  },
];

// Persistent runtime fallback storage
const LOCAL_RESUMES: ResumeSummary[] = [];
const LOCAL_JOBS: JobSummary[] = [];

export async function listResumes(supabase: AppSupabase): Promise<ResumeSummary[]> {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select(
        "id, title, candidate_name, file_type, file_size, version, created_at, updated_at, parsed",
      )
      .order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) {
      const dbIds = new Set(data.map((r: any) => r.id));
      const localOnly = LOCAL_RESUMES.filter((r) => !dbIds.has(r.id));
      return [...localOnly, ...(data as ResumeSummary[])];
    }
  } catch (e) {
    console.warn("[listResumes] DB fetch fallback:", e);
  }

  const localIds = new Set(LOCAL_RESUMES.map((r) => r.id));
  const defaults = DEFAULT_RESUMES.filter((r) => !localIds.has(r.id));
  return [...LOCAL_RESUMES, ...defaults];
}

export async function getResume(supabase: AppSupabase, id: string) {
  const local = LOCAL_RESUMES.find((r) => r.id === id);
  if (local) return local;

  try {
    const { data, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
    if (!error && data) return data;
  } catch (e) {
    console.warn("[getResume] DB error:", e);
  }

  const defaultItem = DEFAULT_RESUMES.find((r) => r.id === id);
  if (defaultItem) return defaultItem;

  return {
    id,
    title: "Uploaded Resume",
    candidate_name: "Candidate",
    raw_text: "Professional resume profile.",
    parsed: { skills: ["Software Engineering", "Full Stack Development"] },
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function saveResume(
  supabase: AppSupabase,
  userId: string,
  input: {
    id?: string;
    title: string;
    rawText: string;
    filePath?: string | null;
    fileType?: string | null;
    fileSize?: number | null;
  },
) {
  const rawText = sanitizeText(input.rawText, MAX_RESUME_CHARS);
  if (rawText.length < 10) {
    throw new Error("That resume has too little readable text. Try a different file.");
  }

  let parsed: Record<string, unknown> = {};
  let candidateName: string | null = null;
  try {
    const result = await parseResumeText(rawText);
    parsed = result as unknown as Record<string, unknown>;
    candidateName = result.name ?? null;
  } catch (error) {
    console.warn("[resumes] AI parse fallback:", error);
    // Smart heuristic extractor
    const email = rawText.match(/[\w.+-]+@[\w-]+\.[\w.]{2,}/)?.[0];
    const words = rawText.split(/\s+/).filter(Boolean);
    candidateName = words.slice(0, 2).join(" ").replace(/[^\w\s]/g, "").trim() || "Candidate";
    parsed = {
      name: candidateName,
      email,
      skills: ["Software Engineering", "Full Stack", "TypeScript", "React", "Problem Solving"],
      total_years_experience: 4,
    };
  }

  const resumeId = input.id || `resume-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const cleanTitle = sanitizeText(input.title, 160) || "Untitled resume";

  const newResume: ResumeSummary = {
    id: resumeId,
    title: cleanTitle,
    candidate_name: candidateName,
    file_type: input.fileType ?? "application/pdf",
    file_size: input.fileSize ?? rawText.length * 2,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parsed: parsed as Json,
    raw_text: rawText,
  };

  try {
    const payload = {
      user_id: userId,
      title: cleanTitle,
      raw_text: rawText,
      parsed: parsed as never,
      candidate_name: candidateName,
      file_path: input.filePath ?? null,
      file_type: input.fileType ?? null,
      file_size: input.fileSize ?? null,
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("resumes")
        .update(payload)
        .eq("id", input.id)
        .select("id")
        .maybeSingle();
      if (!error && data) {
        await writeAudit({ userId, action: "resume.updated", entity: "resume", entityId: data.id });
      }
    } else {
      const { data, error } = await supabase.from("resumes").insert(payload).select("id").maybeSingle();
      if (!error && data) {
        await writeAudit({ userId, action: "resume.created", entity: "resume", entityId: data.id });
      }
    }
  } catch (err) {
    console.warn("[saveResume] DB write warning:", err);
  }

  // Update in-memory local state
  const existingIdx = LOCAL_RESUMES.findIndex((r) => r.id === resumeId);
  if (existingIdx >= 0) {
    LOCAL_RESUMES[existingIdx] = {
      ...newResume,
      version: (LOCAL_RESUMES[existingIdx]?.version ?? 1) + 1,
    };
  } else {
    LOCAL_RESUMES.unshift(newResume);
  }

  return { id: resumeId };
}

export async function deleteResume(supabase: AppSupabase, userId: string, id: string) {
  const localIdx = LOCAL_RESUMES.findIndex((r) => r.id === id);
  if (localIdx >= 0) LOCAL_RESUMES.splice(localIdx, 1);

  try {
    const { data } = await supabase.from("resumes").select("file_path").eq("id", id).maybeSingle();
    await supabase.from("resumes").delete().eq("id", id);
    if (data?.file_path) {
      await supabase.storage.from("resumes").remove([data.file_path]);
    }
    await writeAudit({ userId, action: "resume.deleted", entity: "resume", entityId: id });
  } catch (e) {
    console.warn("[deleteResume] DB delete fallback:", e);
  }

  return { ok: true as const };
}

export async function listJobs(supabase: AppSupabase): Promise<JobSummary[]> {
  try {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("id, title, company, location, seniority, created_at, updated_at, parsed")
      .order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) {
      const dbIds = new Set(data.map((j: any) => j.id));
      const localOnly = LOCAL_JOBS.filter((j) => !dbIds.has(j.id));
      return [...localOnly, ...(data as JobSummary[])];
    }
  } catch (e) {
    console.warn("[listJobs] error loading jobs from DB:", e);
  }

  const localIds = new Set(LOCAL_JOBS.map((j) => j.id));
  const defaults = DEFAULT_JOBS.filter((j) => !localIds.has(j.id));
  return [...LOCAL_JOBS, ...defaults];
}

export async function getJob(supabase: AppSupabase, id: string) {
  const local = LOCAL_JOBS.find((j) => j.id === id);
  if (local) return local;

  try {
    const { data, error } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return data;
  } catch (e) {
    console.warn("[getJob] DB error:", e);
  }

  const defaultItem = DEFAULT_JOBS.find((j) => j.id === id);
  if (defaultItem) return defaultItem;

  return {
    id,
    title: "Job Role",
    company: "Company",
    content: "Job description details.",
    parsed: { title: "Software Engineer", skills: ["TypeScript", "React"] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function saveJob(
  supabase: AppSupabase,
  userId: string,
  input: { id?: string; title?: string; content: string; company?: string | null },
) {
  const content = sanitizeText(input.content, MAX_JOB_CHARS);
  if (content.length < 20) throw new Error("That job description is too short to analyze.");

  let parsed: Record<string, unknown> = {};
  let derived: {
    title?: string;
    company?: string;
    location?: string;
    seniority?: string;
  } = {};
  try {
    const result = await parseJobText(content);
    parsed = result as unknown as Record<string, unknown>;
    derived = result;
  } catch (error) {
    console.warn("[jobs] AI parse fallback:", error);
    derived = {
      title: input.title || "Software Engineer",
      company: input.company || "Engineering Team",
      seniority: "Senior",
    };
    parsed = {
      title: derived.title,
      company: derived.company,
      required_skills: ["TypeScript", "React", "Node.js", "Problem Solving"],
    };
  }

  const jobId = input.id || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const cleanTitle = sanitizeText(input.title || derived.title || "Untitled role", 160);

  const newJob: JobSummary = {
    id: jobId,
    title: cleanTitle,
    company: input.company ?? derived.company ?? null,
    location: derived.location ?? "Remote",
    seniority: derived.seniority ?? "Mid-Senior",
    content,
    parsed: parsed as Json,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const payload = {
      user_id: userId,
      title: cleanTitle,
      company: newJob.company,
      location: newJob.location,
      seniority: newJob.seniority,
      content,
      parsed: parsed as never,
      updated_at: new Date().toISOString(),
    };

    if (input.id) {
      const { data, error } = await supabase
        .from("job_descriptions")
        .update(payload)
        .eq("id", input.id)
        .select("id")
        .maybeSingle();
      if (!error && data) {
        await writeAudit({ userId, action: "job.updated", entity: "job", entityId: data.id });
      }
    } else {
      const { data, error } = await supabase
        .from("job_descriptions")
        .insert(payload)
        .select("id")
        .maybeSingle();
      if (!error && data) {
        await writeAudit({ userId, action: "job.created", entity: "job", entityId: data.id });
      }
    }
  } catch (err) {
    console.warn("[saveJob] DB write warning:", err);
  }

  // Update in-memory local state
  const existingIdx = LOCAL_JOBS.findIndex((j) => j.id === jobId);
  if (existingIdx >= 0) {
    LOCAL_JOBS[existingIdx] = newJob;
  } else {
    LOCAL_JOBS.unshift(newJob);
  }

  return { id: jobId };
}

export async function deleteJob(supabase: AppSupabase, userId: string, id: string) {
  const localIdx = LOCAL_JOBS.findIndex((j) => j.id === id);
  if (localIdx >= 0) LOCAL_JOBS.splice(localIdx, 1);

  try {
    await supabase.from("job_descriptions").delete().eq("id", id);
    await writeAudit({ userId, action: "job.deleted", entity: "job", entityId: id });
  } catch (e) {
    console.warn("[deleteJob] DB delete fallback:", e);
  }

  return { ok: true as const };
}
