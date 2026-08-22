import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Radar,
  Loader2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { fetchCareerResilience } from "@/lib/resilience-radar.functions";
import type { ResilienceRadarResult } from "@/lib/resilience-radar.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/resilience-radar")({
  head: () => ({
    meta: [
      { title: "AI Layoff Risk & Career Resilience Radar MatchScore" },
      {
        name: "description",
        content:
          "Evaluate your career antifragility, AI defensibility, and tech stack longevity with actionable protective steps.",
      },
    ],
  }),
  component: ResilienceRadarPage,
});

function ResilienceRadarPage() {
  const [primaryTechStack, setPrimaryTechStack] = useState("TypeScript, React, Node.js, PostgreSQL, AWS");
  const [yearsExperience, setYearsExperience] = useState<number>(4);
  const [industrySector, setIndustrySector] = useState("B2B SaaS / Enterprise Cloud");
  const [hasPublicArtifacts, setHasPublicArtifacts] = useState(false);
  const [result, setResult] = useState<ResilienceRadarResult | null>(null);

  const evaluate = useMutation({
    mutationFn: () =>
      fetchCareerResilience({
        data: {
          primaryTechStack,
          yearsExperience: Number(yearsExperience) || 0,
          industrySector,
          hasPublicArtifacts,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Career resilience radar calculated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Radar className="size-8 text-emerald-500" />
          AI Layoff Risk & Career Resilience Radar
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Assess your career defensibility against AI automation, macro hiring freezes, and tech stack
          obsolescence. Get a personalized 4-pillar Antifragile Career Blueprint.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Career Profile Inputs</CardTitle>
          <CardDescription>
            Enter your core stack and market positioning to measure antifragility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Primary Tech Stack</Label>
              <Input className="mt-1.5" value={primaryTechStack} onChange={(e) => setPrimaryTechStack(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Years of Industry Experience</Label>
              <Input className="mt-1.5" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Primary Industry Sector</Label>
              <Input className="mt-1.5" value={industrySector} onChange={(e) => setIndustrySector(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch id="pub-toggle" checked={hasPublicArtifacts} onCheckedChange={setHasPublicArtifacts} />
            <Label htmlFor="pub-toggle" className="text-xs font-semibold cursor-pointer">
              I have active public proof of work (Open Source, Tech Blog, YouTube, Conference Talks)
            </Label>
          </div>

          <Button size="lg" disabled={evaluate.isPending} onClick={() => evaluate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {evaluate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Radar className="size-4 mr-2" />}
            {evaluate.isPending ? "Calculating Resilience…" : "Calculate Career Resilience Radar"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Resilience Score Banner */}
          <Card className="surface-panel p-5 border-2 border-emerald-500/30 bg-emerald-500/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-8 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.overall_resilience_score}% Career Resilience ({result.market_longevity_tier})
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your profile maintains high architectural defensibility and sustained market demand.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Progress value={result.overall_resilience_score} className="h-2.5" />
              </div>
            </div>
          </Card>

          {/* 4 Pillars Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {result.pillars.map((p, i) => (
              <Card key={i} className="surface-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{p.pillar_name}</span>
                  <Badge variant="outline" className={cn(
                    "text-xs font-semibold",
                    p.score >= 80 ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-amber-500/30 text-amber-500 bg-amber-500/10"
                  )}>
                    {p.score}% · {p.risk_level}
                  </Badge>
                </div>
                <Progress value={p.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{p.assessment}</p>

                <div className="pt-2 border-t border-border space-y-1.5">
                  <p className="text-[11px] font-bold text-foreground uppercase">Protective Actions</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {p.protective_actions.map((act, ai) => (
                      <li key={ai} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold shrink-0">✦</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* Antifragility Blueprint */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Antifragile Career Blueprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.antifragile_career_blueprint.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✦</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
