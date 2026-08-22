import { formatInr } from "@/lib/currency";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  FileText,
  Briefcase,
  Sparkles,
  Wallet,
  Mic,
  Wand2,
  DollarSign,
  GraduationCap,
  MapPin,
  FileSignature,
  Scale,
  Linkedin,
  CalendarDays,
  Coins,
  Cpu,
  Award,
  Calculator,
  BookOpen,
  Globe,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { fetchAnalyses, fetchDashboardStats } from "@/lib/analysis.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreBar, scoreLabel } from "@/components/score-ring";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard MatchScore" },
      { name: "description", content: "Track your resume match scores, spend and progress." },
      { property: "og:title", content: "Dashboard MatchScore" },
      { property: "og:description", content: "Track your resume match scores and progress." },
    ],
  }),
  component: DashboardPage,
});

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <Card className="stat-card animate-fade-in-up" style={{ animationDelay: `${delay ?? 0}ms` }}>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
            {label}
          </p>
          <p className="font-display mt-2 text-2xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

const AI_TOOLS = [
  {
    to: "/interview",
    icon: Mic,
    title: "Mock Interview Simulator",
    description: "Practice 5 tailored technical & STAR questions with instant AI grading.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    to: "/studio",
    icon: Wand2,
    title: "Resume Studio & ATS",
    description: "Transform weak bullets into metric statements & scan keyword density.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    to: "/salary",
    icon: DollarSign,
    title: "Salary Benchmark",
    description: "Calculate market compensation & skill boost multipliers in INR and USD.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    to: "/coach",
    icon: GraduationCap,
    title: "Skill Gap Coach",
    description: "Find missing skills, free verified courses, and practice portfolio projects.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    to: "/career-timeline",
    icon: MapPin,
    title: "Career Timeline Predictor",
    description: "Visualise your 5-year career path with salary arcs and skill milestones.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    to: "/cover-letter",
    icon: FileSignature,
    title: "Cover Letter Generator",
    description: "Generate personalised cover letters and cold outreach emails for any role.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    to: "/compare",
    icon: Scale,
    title: "Resume Head-to-Head",
    description: "Compare two candidates side-by-side across 5 scoring dimensions.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    to: "/screening",
    icon: Users,
    title: "Recruiter Screening",
    description: "Shortlist candidates with bias-safe redaction and customizable cutoffs.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    to: "/linkedin-optimizer",
    icon: Linkedin,
    title: "LinkedIn Studio",
    description: "Generate viral headlines, storytelling About sections & Boolean keywords.",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
  },
  {
    to: "/onboarding-plan",
    icon: CalendarDays,
    title: "30-60-90 Day Plan",
    description: "Create strategic onboarding plans for final-round manager & VP interviews.",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
  },
  {
    to: "/offer-evaluator",
    icon: Coins,
    title: "Offer Evaluator & Comp",
    description: "Compare total compensation packages & generate custom counter-offer scripts.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    to: "/tech-matrix",
    icon: Cpu,
    title: "Tech Stack Matrix",
    description: "Calculate semantic skill transferability & get interview bridge arguments.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    to: "/recommendations",
    icon: Award,
    title: "Recommendations Studio",
    description: "Draft LinkedIn recommendation letters & reference check prep sheets.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    to: "/promotion-case",
    icon: TrendingUp,
    title: "Promotion Case Builder",
    description: "Format Staff+ executive promotion dossiers & manager 1-on-1 scripts.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    to: "/freelance-calculator",
    icon: Calculator,
    title: "Freelance Rates",
    description: "Convert FTE salary to hourly, day & monthly retainer consulting rates.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    to: "/star-story-bank",
    icon: BookOpen,
    title: "STAR Story Bank",
    description: "Structure interview stories across 4 core behavioral leadership themes.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    to: "/visa-assessor",
    icon: Globe,
    title: "Visa Assessor",
    description: "Evaluate eligibility for UK, EU, Canada & US tech visas with evidence roadmaps.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

function DashboardPage() {
  const stats = useQuery({ queryKey: ["dashboard-stats"], queryFn: () => fetchDashboardStats() });
  const analyses = useQuery({ queryKey: ["analyses"], queryFn: () => fetchAnalyses() });

  const s = stats.data && typeof stats.data === "object" && "categoryAverages" in stats.data ? stats.data : null;
  const analysesList = Array.isArray(analyses.data) ? analyses.data : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your match performance across every role you've targeted.
          </p>
        </div>
        <Button asChild className="signal-gradient text-primary-foreground border-0 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
          <Link to="/analyze">
            <Sparkles className="size-4 mr-1.5" />
            New analysis
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      {stats.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Analyses"
            value={String(s?.totalAnalyses ?? 0)}
            hint={`${s?.resumeCount ?? 0} resumes · ${s?.jobCount ?? 0} roles`}
            icon={Sparkles}
            delay={0}
          />
          <Stat
            label="Average score"
            value={`${s?.averageScore ?? 0}`}
            hint={s?.averageScore ? scoreLabel(s.averageScore) : "No completed runs yet"}
            icon={TrendingUp}
            delay={60}
          />
          <Stat label="Best score" value={`${s?.bestScore ?? 0}`} icon={Zap} delay={120} />
          <Stat
            label="Total spent"
            value={formatInr(s?.totalSpentUsd ?? 0)}
            hint="USDC via x402"
            icon={Wallet}
            delay={180}
          />
        </div>
      )}

      {/* AI Power Suite */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">AI Career Intelligence Tools</h2>
          <Badge variant="outline" className="text-[10px] border-primary/20 text-primary bg-primary/5">
            18 modules
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AI_TOOLS.map((tool, i) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group feature-card p-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${tool.bg} p-2.5 ${tool.color} transition-all duration-300 group-hover:shadow-md group-hover:scale-110`}>
                  <tool.icon className="size-4.5" />
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground/30 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-foreground">{tool.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom grid: Category averages + Recent reports */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="surface-panel lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="text-base">Category averages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {s && s.categoryAverages ? (
              <>
                <ScoreBar label="Skills" value={s.categoryAverages.skills ?? 0} />
                <ScoreBar label="Experience" value={s.categoryAverages.experience ?? 0} />
                <ScoreBar label="Education" value={s.categoryAverages.education ?? 0} />
                <ScoreBar label="Certifications" value={s.categoryAverages.certifications ?? 0} />
                <ScoreBar label="Keywords" value={s.categoryAverages.keywords ?? 0} />
              </>
            ) : (
              <Skeleton className="h-40 shimmer" />
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent reports</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs hover:text-primary">
              <Link to="/reports">
                View all <ArrowUpRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {analyses.isLoading ? (
              <Skeleton className="h-40 shimmer" />
            ) : analysesList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No analyses yet. Upload a resume and score it against a role.
                </p>
                <Button asChild className="mt-4 signal-gradient text-primary-foreground border-0" size="sm">
                  <Link to="/analyze">
                    <Sparkles className="size-3.5 mr-1.5" />
                    Run your first analysis
                  </Link>
                </Button>
              </div>
            ) : (
              analysesList.slice(0, 6).map((row, i) => (
                <Link
                  key={row.id}
                  to="/reports/$id"
                  params={{ id: row.id }}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-border/40 px-4 py-3 transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {row.role_title ?? "Untitled role"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString()} ·{" "}
                      {(row.product || "report").replace("_", " ")}
                    </p>
                  </div>
                  {row.status === "completed" ? (
                    <span className="font-display text-xl font-extrabold text-primary">
                      {row.overall_score ?? 0}
                    </span>
                  ) : (
                    <Badge variant="outline" className="text-xs">{row.status}</Badge>
                  )}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
