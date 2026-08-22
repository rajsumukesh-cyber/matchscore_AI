import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TrendingUp,
  Loader2,
  Sparkles,
  AlertTriangle,
  Rocket,
  BrainCircuit,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { fetchCareerTimeline } from "@/lib/career-timeline.functions";
import type { CareerTimelineResult } from "@/lib/career-timeline.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/career-timeline")({
  head: () => ({
    meta: [
      { title: "AI Career Timeline Predictor MatchScore" },
      {
        name: "description",
        content:
          "Visualise your 5-year career progression with salary arcs, skill acquisitions, and role milestones.",
      },
      { property: "og:title", content: "AI Career Timeline Predictor MatchScore" },
    ],
  }),
  component: CareerTimelinePage,
});

function CareerTimelinePage() {
  const [currentRole, setCurrentRole] = useState("Mid-Level Software Engineer");
  const [targetRole, setTargetRole] = useState("Staff Engineer");
  const [currentSkills, setCurrentSkills] = useState("TypeScript, React, Node.js, PostgreSQL");
  const [experienceYears, setExperienceYears] = useState("3");
  const [result, setResult] = useState<CareerTimelineResult | null>(null);

  const predict = useMutation({
    mutationFn: () =>
      fetchCareerTimeline({
        data: { currentRole, targetRole, currentSkills, experienceYears },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Career trajectory projected!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <MapPin className="size-8 text-primary" />
          AI Career Timeline & Growth Predictor
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          See a visual 5-year career progression roadmap with projected roles, salary growth arcs,
          skill acquisition milestones, risk factors, and career accelerators.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Configure Your Career Path</CardTitle>
          <CardDescription>
            Enter where you are now and where you want to be.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Current Role</Label>
              <Input className="mt-1.5" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Role (Dream Job)</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Current Top Skills (comma-separated)</Label>
              <Input className="mt-1.5" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Years of Experience</Label>
              <Input className="mt-1.5" type="number" min="0" max="30" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={predict.isPending} onClick={() => predict.mutate()}>
            {predict.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <TrendingUp className="size-4 mr-2" />}
            {predict.isPending ? "Projecting Your Career…" : "Generate 5-Year Career Timeline"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Visual Timeline */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Projected Career Progression
            </h2>

            <div className="relative space-y-0">
              {result.timeline.map((m, idx) => (
                <div key={m.year} className="flex gap-4">
                  {/* vertical connector */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                      idx === 0
                        ? "border-muted-foreground bg-muted text-muted-foreground"
                        : m.readiness_percent >= 85
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : "border-primary bg-primary/10 text-primary",
                    )}>
                      Y{m.year}
                    </div>
                    {idx < result.timeline.length - 1 ? (
                      <div className="w-0.5 flex-1 min-h-6 bg-border" />
                    ) : null}
                  </div>

                  <Card className={cn(
                    "flex-1 mb-4 surface-panel transition-colors",
                    idx === 0 ? "border-muted" : "hover:border-primary/40",
                  )}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{m.role}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="font-mono text-xs">
                              {m.salary_inr}
                            </Badge>
                            <Badge variant="secondary" className="font-mono text-xs">
                              {m.salary_usd}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">Readiness</span>
                          <p className="font-display text-lg font-bold text-primary">{m.readiness_percent}%</p>
                        </div>
                      </div>

                      <Progress value={m.readiness_percent} className="h-1.5" />

                      <p className="text-xs text-muted-foreground">{m.key_achievement}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {m.new_skills.map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px] bg-background">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* Risk Factors & Accelerators */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="surface-panel border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="size-4" /> Career Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.risk_factors.map((r, i) => (
                    <li key={i} className="flex gap-2"><span className="text-amber-500 font-bold shrink-0">⚠</span>{r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-panel border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-500">
                  <Rocket className="size-4" /> Career Accelerators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.accelerators.map((a, i) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-500 font-bold shrink-0">🚀</span>{a}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="surface-panel border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <BrainCircuit className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-primary">Industry Intelligence</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.industry_insight}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
