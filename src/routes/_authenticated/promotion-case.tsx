import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TrendingUp,
  Loader2,
  Copy,
  Sparkles,
  CheckCircle2,
  Award,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { fetchPromotionCase } from "@/lib/promotion-case.functions";
import type { PromotionCaseResult } from "@/lib/promotion-case.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/promotion-case")({
  head: () => ({
    meta: [
      { title: "AI Promotion & Annual Review Case Builder MatchScore" },
      {
        name: "description",
        content:
          "Build an executive-ready promotion dossier with scope, metrics, leadership evidence, and manager 1-on-1 scripts.",
      },
    ],
  }),
  component: PromotionCasePage,
});

function PromotionCasePage() {
  const [currentLevel, setCurrentLevel] = useState("Senior Software Engineer (L5)");
  const [targetLevel, setTargetLevel] = useState("Staff Software Engineer (L6)");
  const [topShippedProjects, setTopShippedProjects] = useState("Architected unified payment gateway and migrated 4 core services to microservices");
  const [leadershipExamples, setLeadershipExamples] = useState("Led 3-engineer squad, drove bi-weekly architecture RFCs, and mentored 2 junior engineers");
  const [businessMetrics, setBusinessMetrics] = useState("Reduced annual AWS cloud spend by 28% and improved P99 API response latency from 180ms to 45ms");
  const [result, setResult] = useState<PromotionCaseResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchPromotionCase({
        data: {
          currentLevel,
          targetLevel,
          topShippedProjects,
          leadershipExamples,
          businessMetrics,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Promotion case & 1-on-1 script ready!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <TrendingUp className="size-8 text-emerald-500" />
          AI Promotion & Annual Review Case Builder
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Transform your shipped projects and leadership contributions into a formal, executive-ready
          Promotion Dossier (FAANG Staff+ format) and a calibrated 1-on-1 manager script.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Leveling & Impact Inputs</CardTitle>
          <CardDescription>
            Enter your current level, target level, and key accomplishments over the past review cycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Current Level / Title</Label>
              <Input className="mt-1.5" value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Level / Title</Label>
              <Input className="mt-1.5" value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Top Shipped Projects & Scope</Label>
              <Input className="mt-1.5" value={topShippedProjects} onChange={(e) => setTopShippedProjects(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Leadership & Mentorship Examples</Label>
              <Input className="mt-1.5" value={leadershipExamples} onChange={(e) => setLeadershipExamples(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Business Metrics & Return on Investment</Label>
              <Input className="mt-1.5" value={businessMetrics} onChange={(e) => setBusinessMetrics(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Award className="size-4 mr-2" />}
            {generate.isPending ? "Building Promotion Case…" : "Build Promotion Case Dossier"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Readiness Banner */}
          <Card className="surface-panel p-5 border-2 border-emerald-500/30 bg-emerald-500/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-8 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.readiness_percentage}% Calibrated Readiness for {result.target_level}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.dossier_executive_summary}</p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Progress value={result.readiness_percentage} className="h-2.5" />
              </div>
            </div>
          </Card>

          {/* 3 Core Dossier Dimensions */}
          <div className="grid gap-6 lg:grid-cols-3">
            {result.dimensions.map((dim, i) => (
              <Card key={i} className="surface-panel p-5 space-y-3">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                  {dim.dimension_name}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed italic">{dim.scope_level}</p>
                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-[11px] font-bold text-foreground uppercase">Concrete Evidence</p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {dim.evidence_bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* Manager 1-on-1 Script */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                Manager 1-on-1 Promotion Initiation Script
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.manager_1on1_script)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Script
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.manager_1on1_script}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
