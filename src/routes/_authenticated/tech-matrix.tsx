import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Cpu,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  ArrowLeftRight,
  Zap,
} from "lucide-react";
import { fetchTechMatrix } from "@/lib/tech-matrix.functions";
import type { TechMatrixResult, TechBridgeItem } from "@/lib/tech-matrix.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tech-matrix")({
  head: () => ({
    meta: [
      { title: "AI Tech Stack Migration Advisor MatchScore" },
      {
        name: "description",
        content:
          "Analyze tech stack compatibility, calculate semantic skill transferability, and get interview bridge arguments.",
      },
    ],
  }),
  component: TechMatrixPage,
});

function TechMatrixPage() {
  const [candidateStack, setCandidateStack] = useState("Django, MySQL, Vue.js, AWS EC2, REST APIs");
  const [targetStack, setTargetStack] = useState("FastAPI, PostgreSQL, React, Docker, Kubernetes, Kafka, gRPC");
  const [targetRole, setTargetRole] = useState("Senior Backend Infrastructure Engineer");
  const [result, setResult] = useState<TechMatrixResult | null>(null);

  const analyze = useMutation({
    mutationFn: () =>
      fetchTechMatrix({
        data: {
          candidateStack,
          targetStack,
          targetRole,
        },
      }),
    onSuccess: (data) => {
      setResult(data as any);
      toast.success("Tech stack compatibility analysis ready!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Cpu className="size-8 text-primary" />
          AI Tech Stack Compatibility & Migration Advisor
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Discover how your current skills map to a company's target tech stack. Calculate semantic
          transferability scores, estimate ramp-up times, and get proven interview bridge arguments.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Stack Comparison Inputs</CardTitle>
          <CardDescription>
            Enter your current technologies and the target role's stack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Current Tech Stack</Label>
              <Input className="mt-1.5" value={candidateStack} onChange={(e) => setCandidateStack(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Company's Tech Stack</Label>
              <Input className="mt-1.5" value={targetStack} onChange={(e) => setTargetStack(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Target Role Title</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={analyze.isPending} onClick={() => analyze.mutate()} className="signal-gradient text-primary-foreground border-0">
            {analyze.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Layers className="size-4 mr-2" />}
            {analyze.isPending ? "Analyzing Compatibility…" : "Analyze Stack Compatibility"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Compatibility Score Banner */}
          <Card className="surface-panel p-5 border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="size-8 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.overall_compatibility}% Semantic Transferability Score
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your existing depth in core patterns significantly reduces onboarding friction for {targetRole}.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Progress value={result.overall_compatibility} className="h-2.5" />
              </div>
            </div>
          </Card>

          {/* Bridge Matrix Cards */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <ArrowLeftRight className="size-5 text-primary" />
              Skill Migration & Transferability Matrix
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.bridge_items.map((item, i) => (
                <Card key={i} className="surface-panel p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">{item.candidate_tech}</Badge>
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      <Badge variant="default" className="text-xs font-medium">{item.target_tech}</Badge>
                    </div>
                    <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-500">
                      {item.transferability_percent}% transferable
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.bridge_argument}</p>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Estimated Ramp-up:</span>
                    <strong className="text-foreground">{item.ramp_up_estimate}</strong>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Interview Talking Points */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Interview Talking Points (How to answer: "Have you used our stack?")
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.interview_talking_points.map((tp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">✦</span>
                    <span>{tp}</span>
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
