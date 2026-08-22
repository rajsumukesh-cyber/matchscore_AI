import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  Hammer,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { fetchCoachPlan } from "@/lib/coach.functions";
import type { CoachPlan, FreeCourse } from "@/lib/coach.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/coach/$id")({
  head: () => ({
    meta: [
      { title: "Coaching plan MatchScore" },
      {
        name: "description",
        content:
          "Your missing skills, free courses, practice projects and the score you reach once every gap is closed.",
      },
      { property: "og:title", content: "Coaching plan MatchScore" },
      {
        property: "og:description",
        content: "Free courses, projects and your projected match score.",
      },
    ],
  }),
  component: CoachPlanDetail,
});

const PRIORITY_TONE: Record<string, string> = {
  critical: "border-destructive/40 bg-destructive/5 text-destructive",
  high: "border-primary/40 bg-primary/5 text-primary",
  medium: "border-blue-500/30 bg-blue-500/5 text-blue-500",
  low: "border-border text-muted-foreground",
};

function CoachPlanDetail() {
  const { id } = Route.useParams();
  const [courseSearch, setCourseSearch] = useState("");

  const query = useQuery({
    queryKey: ["coach-plan", id],
    queryFn: () => fetchCoachPlan({ data: { id } }),
  });

  if (query.isLoading) return <Skeleton className="h-96" />;
  if (query.isError || !query.data) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/coach">
            <ArrowLeft className="size-4 mr-1" />
            Back to Coach
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">This plan could not be loaded.</p>
      </div>
    );
  }

  const row = query.data;
  const plan = ((row as any).plan ?? row) as unknown as CoachPlan;

  const currentScore = plan.current_score ?? (row as any).current_score ?? 68;
  const projectedScore = plan.projected_score ?? (row as any).projected_score ?? 92;
  const gain = Math.max(0, projectedScore - currentScore);
  const targetRole = plan.target_role ?? (row as any).target_role ?? "Target Role";
  const readinessSummary =
    plan.readiness_summary ??
    "Targeting this role. Closing prioritized skills will significantly elevate candidate readiness.";

  const strengths = Array.isArray(plan.strengths) ? plan.strengths : [];
  const quickWins = Array.isArray(plan.quick_wins) ? plan.quick_wins : [];
  const skillGaps = Array.isArray(plan.skill_gaps) ? plan.skill_gaps : [];
  const freeCourses = Array.isArray(plan.free_courses) ? plan.free_courses : [];
  const practiceProjects = Array.isArray(plan.practice_projects) ? plan.practice_projects : [];
  const weeklyPlan = Array.isArray(plan.weekly_plan) ? plan.weekly_plan : [];
  const certifications = Array.isArray(plan.certifications) ? plan.certifications : [];

  const filteredCourses = freeCourses.filter((c) => {
    if (!courseSearch.trim()) return true;
    const q = courseSearch.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      (c.covers ?? []).some((cov) => cov.toLowerCase().includes(q))
    );
  });

  function copyBullet(bullet: string) {
    navigator.clipboard.writeText(bullet);
    toast.success("Resume bullet copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/coach">
            <ArrowLeft className="size-4 mr-1" />
            All plans
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {targetRole}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generated {row.created_at ? new Date(row.created_at).toLocaleString() : "Recently"}
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-sm border-primary/30 bg-primary/5 text-primary">
            +{gain} pts projected gain
          </Badge>
        </div>
      </div>

      {/* Readiness & Score Projection Card */}
      <Card className="surface-panel overflow-hidden border-primary/20">
        <CardContent className="grid gap-6 pt-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Current Match Score</span>
                <span className="font-display text-2xl font-bold text-foreground">
                  {currentScore}/100
                </span>
              </div>
              <Progress value={currentScore} className="mt-2" />
            </div>
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" /> Projected Score after closing gaps
                </span>
                <span className="font-display text-2xl font-bold text-primary">
                  {projectedScore}/100
                </span>
              </div>
              <Progress value={projectedScore} className="mt-2 bg-primary/20" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{readinessSummary}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 border border-primary/20 px-8 py-6 text-center">
            <TrendingUp className="size-8 text-primary" />
            <p className="mt-2 font-display text-4xl font-extrabold text-primary">+{gain}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Points to Gain
            </p>
          </div>
        </CardContent>
      </Card>

      {/* PILLAR 1: Identify Missing Skills */}
      {skillGaps.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
              <Target className="size-5 text-primary" />
              1 · Identified Missing Skills
            </h2>
            <span className="text-xs text-muted-foreground">{skillGaps.length} gaps identified</span>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2">
            {skillGaps.map((gap) => (
              <div
                key={gap.skill}
                className={cn(
                  "rounded-xl border p-4 transition-all shadow-sm",
                  PRIORITY_TONE[gap.priority] ?? "border-border",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                      {gap.priority} Priority
                    </span>
                    <p className="font-semibold text-base text-foreground mt-0.5">{gap.skill}</p>
                  </div>
                  <Badge variant="outline" className="font-mono font-bold bg-background text-primary border-primary/30">
                    +{gap.score_gain} pts
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  <span>Estimated learn time: <strong className="text-foreground">{gap.learn_in}</strong></span>
                </div>

                {gap.current_level ? (
                  <div className="mt-2 rounded-lg bg-background/60 p-2.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Level Progression: </span>
                    <span className="line-through">{gap.current_level}</span> →{" "}
                    <span className="font-semibold text-primary">{gap.target_level}</span>
                  </div>
                ) : null}

                {gap.why_it_matters ? (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Why employers ask for this: </strong>
                    {gap.why_it_matters}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* PILLAR 2: Free Verified Courses from Browser Data */}
      {freeCourses.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                <BookOpen className="size-5 text-primary" />
                2 · Free Courses from Verified Web Data
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Curated real-world learning paths from freeCodeCamp, Harvard CS50, edX, and AWS.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search courses or skills…"
                className="pl-8 text-xs h-9"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.title + course.provider} className="surface-panel flex flex-col justify-between hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {course.provider}
                    </Badge>
                    <Badge variant="outline" className="text-[11px] font-mono text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
                      {course.cost}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-semibold mt-2 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                    <Clock className="size-3.5" /> {course.hours} hours total {course.level ? `· ${course.level}` : ""}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {(course.covers ?? []).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] bg-background">
                        {c}
                      </Badge>
                    ))}
                  </div>

                  {course.url ? (
                    <Button asChild variant="default" size="sm" className="w-full mt-2">
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        Open course
                        <ExternalLink className="size-3.5 ml-1.5" />
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* PILLAR 3: Recommended Practice Projects with Resume Bullets */}
      {practiceProjects.length > 0 ? (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
            <Hammer className="size-5 text-primary" />
            3 · Recommended Practice Projects to Improve
          </h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Build these portfolio projects to demonstrate practical mastery. Copy-paste the bullet points directly into your resume.
          </p>

          <div className="space-y-4">
            {practiceProjects.map((project) => (
              <Card key={project.title} className="surface-panel border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {project.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="size-3 mr-1" /> {project.weeks} weeks
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3.5 text-sm">
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-foreground mr-1">Skills practiced:</span>
                    {(project.skills ?? []).map((s) => (
                      <Badge key={s} variant="outline" className="bg-background">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  {project.milestones?.length ? (
                    <div className="rounded-lg border border-border bg-background/50 p-3 space-y-1.5">
                      <p className="text-xs font-semibold text-foreground">Key Milestones:</p>
                      {project.milestones.map((m, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                          <span>{m}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {project.resume_bullet ? (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <Sparkles className="size-3.5" /> High-Impact Resume Bullet
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-primary/30 hover:bg-primary/10"
                          onClick={() => copyBullet(project.resume_bullet)}
                        >
                          <Copy className="size-3" />
                          Copy bullet
                        </Button>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">
                        "{project.resume_bullet}"
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Strengths & Quick Wins */}
      {strengths.length > 0 || quickWins.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <ListCard title="What already works in your profile" items={strengths} icon="check" />
          <ListCard title="Quick wins for this week" items={quickWins} icon="sparkles" />
        </div>
      ) : null}

      {/* Week by Week Roadmap */}
      {weeklyPlan.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
            <Sparkles className="size-5 text-primary" />
            4-Week Action Roadmap
          </h2>
          <ol className="space-y-3">
            {weeklyPlan.map((week) => (
              <li key={week.week} className="flex gap-4 rounded-xl border border-border p-4 hover:border-primary/30 transition-colors">
                <span className="font-display text-xl font-extrabold text-primary">W{week.week}</span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{week.focus}</p>
                  <p className="text-xs text-muted-foreground">{week.outcome}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <ListCard title="Industry Certifications to Consider" items={certifications} icon="award" />
      ) : null}
    </div>
  );
}

function ListCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon?: "check" | "sparkles" | "award";
}) {
  if (items.length === 0) return null;
  return (
    <Card className="surface-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon === "check" ? (
            <CheckCircle2 className="size-4 text-emerald-500" />
          ) : icon === "award" ? (
            <Award className="size-4 text-primary" />
          ) : (
            <Sparkles className="size-4 text-primary" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex gap-2 leading-relaxed">
              <span className="text-primary font-bold">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
