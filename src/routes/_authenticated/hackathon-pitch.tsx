import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Trophy,
  Loader2,
  Copy,
  Sparkles,
  Presentation,
  CheckCircle2,
  HelpCircle,
  Video,
  Layers,
  Crown,
} from "lucide-react";
import { fetchHackathonPitch } from "@/lib/hackathon-pitch.functions";
import type { HackathonPitchResult } from "@/lib/hackathon-pitch.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/hackathon-pitch")({
  head: () => ({
    meta: [
      { title: "AI Hackathon Winning Pitch & Judge Demo Kit MatchScore" },
      {
        name: "description",
        content:
          "Win your next hackathon with a 2-minute judge pitch script, 5-slide deck structure, and judge Q&A defense answers.",
      },
    ],
  }),
  component: HackathonPitchPage,
});

function HackathonPitchPage() {
  const [projectName, setProjectName] = useState("MatchScore AI");
  const [targetProblem, setTargetProblem] = useState("75% of qualified students and job seekers get rejected by black-box ATS filters with zero actionable feedback");
  const [coreTechStack, setCoreTechStack] = useState("React 19, TanStack Start (SSR), Google Gemini AI, PostgreSQL (Supabase), Render");
  const [uniqueMoatOrFeature, setUniqueMoatOrFeature] = useState("A unified 30-in-1 explainable career intelligence ecosystem with free verified course recommendations and x402 micropayments");
  const [result, setResult] = useState<HackathonPitchResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchHackathonPitch({
        data: {
          projectName,
          targetProblem,
          coreTechStack,
          uniqueMoatOrFeature,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Hackathon winning pitch kit generated!");
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
          <Trophy className="size-8 text-amber-500" />
          AI Hackathon Winning Pitch & Judge Demo Kit
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Stand out in front of tech judges and investors. Generate a high-conviction 2-minute verbal pitch,
          a 5-slide presentation deck structure, and bulletproof answers to tough judge questions.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Hackathon Project Details</CardTitle>
          <CardDescription>
            Enter your project name, problem statement, and stack to tailor a winning pitch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Project Name</Label>
              <Input className="mt-1.5" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Core Technology Stack</Label>
              <Input className="mt-1.5" value={coreTechStack} onChange={(e) => setCoreTechStack(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">The Core Problem You're Solving</Label>
              <Input className="mt-1.5" value={targetProblem} onChange={(e) => setTargetProblem(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Your Unfair Advantage / Key Moat</Label>
              <Input className="mt-1.5" value={uniqueMoatOrFeature} onChange={(e) => setUniqueMoatOrFeature(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Crown className="size-4 mr-2" />}
            {generate.isPending ? "Crafting Winning Pitch…" : "Generate Hackathon Winning Kit"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-8">
          {/* 2-Minute Spoken Pitch */}
          <Card className="surface-panel border-2 border-amber-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Presentation className="size-4 text-amber-500" />
                2-Minute Live Judge Presentation Script (Spoken Word)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.two_minute_judge_presentation)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Pitch
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.two_minute_judge_presentation}
              </pre>
            </CardContent>
          </Card>

          {/* 30-Second Elevator Pitch */}
          <Card className="surface-panel p-5 space-y-2 border-primary/20">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-primary uppercase">30-Second Quick Elevator Pitch</strong>
              <Button variant="ghost" size="sm" onClick={() => copyText(result.elevator_pitch_30_seconds)}>
                <Copy className="size-3.5" />
              </Button>
            </div>
            <p className="text-xs text-foreground italic bg-primary/5 p-3 rounded-lg leading-relaxed">
              "{result.elevator_pitch_30_seconds}"
            </p>
          </Card>

          {/* 5-Slide Deck Structure */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              5-Slide Presentation Deck Outline
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.slide_deck_structure.map((s, si) => (
                <Card key={si} className="surface-panel p-4 space-y-2">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    Slide {s.slide_number}
                  </Badge>
                  <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                  <ul className="space-y-1 text-xs text-muted-foreground pt-1">
                    {s.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-1">
                        <span className="text-primary font-bold shrink-0">✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Tough Judge Q&A Defense */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-emerald-500" />
              Anticipated Tough Judge Q&A Defense
            </h2>
            <div className="space-y-3">
              {result.judge_qa_defense.map((qa, qi) => (
                <Card key={qi} className="surface-panel p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-amber-500">
                      Judge: "{qa.anticipated_judge_question}"
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => copyText(qa.winning_answer)}>
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg leading-relaxed">
                    <strong>Winning Answer:</strong> {qa.winning_answer}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    <strong>Rubric Impact:</strong> {qa.scoring_rubric_impact}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Hackathon Winning Checklist */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Hackathon Demo Day Winning Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.hackathon_winning_checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✦</span>
                    <span>{item}</span>
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
