import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Check,
  GraduationCap,
  Loader2,
  Trash2,
  BookOpen,
  Hammer,
  Target,
  ArrowRight,
} from "lucide-react";
import { fetchResumes } from "@/lib/resumes.functions";
import { fetchJobs } from "@/lib/jobs.functions";
import { createCoachPlan, fetchCoachPlans, removeCoachPlan } from "@/lib/coach.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/coach/")({
  head: () => ({
    meta: [
      { title: "AI skill gap coach MatchScore" },
      {
        name: "description",
        content:
          "Identify missing skills, get free verified courses from browser data, and build practice projects with resume bullets.",
      },
      { property: "og:title", content: "AI skill gap coach MatchScore" },
      {
        property: "og:description",
        content: "Missing skills, free courses, practice projects and your projected match score.",
      },
    ],
  }),
  component: CoachPage,
});

const SUGGESTED_ROLES = [
  "Senior Full Stack Engineer",
  "Backend System Architect (Redis & Node.js)",
  "Frontend & React Specialist (Next.js)",
  "AI & LLM Application Engineer (RAG & Python)",
  "Cloud & DevOps Engineer (Kubernetes & AWS)",
];

function CoachPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");

  const resumes = useQuery({ queryKey: ["resumes"], queryFn: () => fetchResumes() });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => fetchJobs() });
  const plans = useQuery({ queryKey: ["coach-plans"], queryFn: () => fetchCoachPlans() });

  const resumeList = Array.isArray(resumes.data) ? resumes.data : [];
  const jobList = Array.isArray(jobs.data) ? jobs.data : [];
  const planList = Array.isArray(plans.data) ? plans.data : [];

  // Default selection for quick building
  useEffect(() => {
    if (!resumeId && resumeList.length > 0) {
      setResumeId(resumeList[0].id);
    }
  }, [resumeList, resumeId]);

  const build = useMutation({
    mutationFn: async () => {
      const activeResumeId = resumeId || (resumeList[0]?.id ?? "demo-resume-1");
      const selectedJob = jobList.find((j) => j.id === jobId);
      const effectiveRole = targetRole.trim() || selectedJob?.title || "Senior Full Stack Engineer";

      return createCoachPlan({
        data: {
          resumeId: activeResumeId,
          jobDescriptionId: jobId || null,
          targetRole: effectiveRole,
        },
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["coach-plans"] });
      toast.success("Skill gap coaching plan ready!");
      navigate({ to: "/coach/$id", params: { id: result.id } });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeCoachPlan({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coach-plans"] });
      toast.success("Plan deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          AI Skill Gap Coach
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Identify your missing skills, discover free verified online courses from top platforms,
          and build portfolio projects with resume-ready bullet points to maximize your match score.
        </p>

        {/* 3 Core Pillars Highlights */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Target className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">1. Identify Missing Skills</p>
              <p className="text-[11px] text-muted-foreground">Prioritized by score impact (+14 pts)</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <BookOpen className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">2. Free Verified Courses</p>
              <p className="text-[11px] text-muted-foreground">freeCodeCamp, CS50, edX, AWS</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Hammer className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">3. Practice Projects</p>
              <p className="text-[11px] text-muted-foreground">Resume bullets with action metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>1 · Your resume</span>
              <span className="text-xs font-normal text-muted-foreground">
                {resumeList.length} available
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumes.isLoading ? (
              <Skeleton className="h-24" />
            ) : resumeList.length === 0 ? (
              <Empty to="/resumes" label="Upload a resume first" />
            ) : (
              resumeList.map((resume) => (
                <PickRow
                  key={resume.id}
                  active={resumeId === resume.id}
                  title={resume.title}
                  subtitle={resume.candidate_name ?? `Version ${resume.version}`}
                  onClick={() => setResumeId(resume.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base">2 · Target role & skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-role" className="text-xs font-medium text-foreground">
                Target Role
              </Label>
              <Input
                id="target-role"
                className="mt-1.5"
                placeholder="e.g. Senior Full Stack Engineer"
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value);
                  if (jobId) setJobId(null);
                }}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Quick select role templates:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      setJobId(null);
                    }}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-all",
                      targetRole === role
                        ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {jobList.length > 0 ? (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Or pick a saved job posting:</p>
                {jobList.slice(0, 3).map((job) => (
                  <PickRow
                    key={job.id}
                    active={jobId === job.id}
                    title={job.title}
                    subtitle={job.company ?? job.seniority ?? "Saved role"}
                    onClick={() => {
                      if (jobId === job.id) {
                        setJobId(null);
                      } else {
                        setJobId(job.id);
                        setTargetRole(job.title);
                      }
                    }}
                  />
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          disabled={build.isPending}
          onClick={() => build.mutate()}
        >
          {build.isPending ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <GraduationCap className="size-4 mr-2" />
          )}
          {build.isPending ? "Generating your skill gap plan…" : "Build my skill gap plan"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Identifies missing skills, finds free courses, and writes custom resume bullets.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold text-foreground">Your coaching plans</h2>
        {plans.isLoading ? (
          <Skeleton className="h-28" />
        ) : planList.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No coaching plans yet. Select your resume and target role above to generate your first plan.
          </p>
        ) : (
          <div className="space-y-2">
            {planList.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:border-primary/50 transition-colors"
              >
                <Link
                  to="/coach/$id"
                  params={{ id: plan.id }}
                  className="min-w-0 flex-1 hover:underline flex items-center gap-3"
                >
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {plan.target_role}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {plan.current_score ?? 0} → {plan.projected_score ?? 0} (+{(plan.projected_score ?? 0) - (plan.current_score ?? 0)} pts) ·{" "}
                      {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
                <Badge variant="outline" className="font-mono text-primary border-primary/30">
                  +{(plan.projected_score ?? 0) - (plan.current_score ?? 0)} pts
                </Badge>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/coach/$id" params={{ id: plan.id }}>
                    View plan
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => del.mutate(plan.id)}
                  aria-label="Delete plan"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PickRow({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-all",
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
          active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-transparent",
        )}
      >
        <Check className="size-3" />
      </div>
    </button>
  );
}

function Empty({ to, label }: { to: string; label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Button asChild size="sm" variant="outline" className="mt-3">
        <Link to={to}>Open library</Link>
      </Button>
    </div>
  );
}
