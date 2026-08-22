import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Copy,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Zap,
  Target,
  ShieldAlert,
} from "lucide-react";
import { fetchStarStoryBank } from "@/lib/star-story-bank.functions";
import type { StarStoryBankResult } from "@/lib/star-story-bank.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/star-story-bank")({
  head: () => ({
    meta: [
      { title: "AI Behavioral STAR Story Bank MatchScore" },
      {
        name: "description",
        content:
          "Generate and organize high-impact STAR behavioral interview stories with quantified metrics and delivery strategies.",
      },
    ],
  }),
  component: StarStoryBankPage,
});

function StarStoryBankPage() {
  const [targetRole, setTargetRole] = useState("Staff Backend Engineer");
  const [coreDomain, setCoreDomain] = useState("Distributed Systems, Payment Pipelines & Microservices");
  const [majorProject, setMajorProject] = useState("migrating our legacy monolith to an asynchronous event-driven architecture");
  const [result, setResult] = useState<StarStoryBankResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchStarStoryBank({
        data: {
          targetRole,
          coreDomain,
          majorProject,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("STAR Story Bank generated!");
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
          <BookOpen className="size-8 text-primary" />
          AI Behavioral & Leadership STAR Story Bank
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Build an interview-ready repository of structured STAR stories (Situation, Task, Action, Result)
          tailored to Amazon, Google, and Meta leadership principles with quantified metrics.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Role & Core Projects</CardTitle>
          <CardDescription>
            Specify your technical domain and notable project to generate calibrated behavioral responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Target Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Core Technical Domain</Label>
              <Input className="mt-1.5" value={coreDomain} onChange={(e) => setCoreDomain(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Major Complex Project / Challenge</Label>
              <Input className="mt-1.5" value={majorProject} onChange={(e) => setMajorProject(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {generate.isPending ? "Generating Stories…" : "Generate STAR Story Bank"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Quality Score Banner */}
          <Card className="surface-panel p-5 border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Target className="size-8 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.star_mastery_score}% Behavioral & Leadership Quality Score
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stories follow the STAR method with clear actions, quantified metrics, and systemic improvements.
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Progress value={result.star_mastery_score} className="h-2.5" />
              </div>
            </div>
          </Card>

          {/* Stories Grid */}
          <div className="space-y-4">
            {result.stories.map((story, i) => (
              <Card key={i} className="surface-panel p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                    Theme: {story.theme}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => copyText(`SITUATION: ${story.situation}\n\nTASK: ${story.task}\n\nACTION: ${story.action}\n\nRESULT: ${story.result}`)}>
                    <Copy className="size-3.5 mr-1" /> Copy Full Story
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 space-y-1">
                    <strong className="text-primary block font-bold">S — Situation</strong>
                    <p className="text-muted-foreground leading-relaxed">{story.situation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 space-y-1">
                    <strong className="text-primary block font-bold">T — Task</strong>
                    <p className="text-muted-foreground leading-relaxed">{story.task}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 space-y-1 sm:col-span-2">
                    <strong className="text-emerald-500 block font-bold">A — Action (What YOU Did)</strong>
                    <p className="text-foreground leading-relaxed">{story.action}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 space-y-1 sm:col-span-2">
                    <strong className="text-blue-500 block font-bold">R — Result & Metrics</strong>
                    <p className="text-foreground leading-relaxed">{story.result}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {story.quantified_metrics.map((m, mi) => (
                        <Badge key={mi} variant="secondary" className="text-[10px] font-semibold">
                          ✦ {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Delivery Tips */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Executive Interview Delivery Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.delivery_best_practices.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✦</span>
                    <span>{tip}</span>
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
