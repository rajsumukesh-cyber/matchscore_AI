import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShieldAlert,
  Loader2,
  Copy,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { fetchCgpaRebrand } from "@/lib/cgpa-rebrander.functions";
import type { CgpaRebranderResult } from "@/lib/cgpa-rebrander.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/cgpa-rebrander")({
  head: () => ({
    meta: [
      { title: "AI Low CGPA & Backlog Defense Studio MatchScore" },
      {
        name: "description",
        content:
          "Overcome low college grades, academic backlogs, or non-CS backgrounds with proof-of-work rebrand strategies and recruiter interview scripts.",
      },
    ],
  }),
  component: CgpaRebranderPage,
});

function CgpaRebranderPage() {
  const [academicIssue, setAcademicIssue] = useState<"Low CGPA (<6.5/7.0)" | "Past/Active Academic Backlogs" | "Non-CS Degree Transition" | "Career / Education Gap">("Low CGPA (<6.5/7.0)");
  const [currentDegree, setCurrentDegree] = useState("B.Tech in Mechanical Engineering");
  const [actualSkillsLearned, setActualSkillsLearned] = useState("JavaScript, React, Node.js, PostgreSQL, Git, LeetCode (120+ solved)");
  const [targetRole, setTargetRole] = useState("Full Stack Software Engineer");
  const [result, setResult] = useState<CgpaRebranderResult | null>(null);

  const rebrand = useMutation({
    mutationFn: () =>
      fetchCgpaRebrand({
        data: {
          academicIssue,
          currentDegree,
          actualSkillsLearned,
          targetRole,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Low CGPA / Non-CS rebrand strategy ready!");
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
          <ShieldAlert className="size-8 text-amber-500" />
          AI Low CGPA, Backlog & Non-CS Career Rebrander
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Don't let college exam scores or non-CS degrees stop you. Pivot your resume to proof-of-work,
          prepare calibrated recruiter defense answers, and target zero-GPA-filter hiring channels.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Academic Profile & Transition Goals</CardTitle>
          <CardDescription>
            Select your specific situation to generate customized resume positioning and verbal scripts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold">Your Primary Academic Challenge</Label>
            <div className="mt-1.5">
              <Tabs value={academicIssue} onValueChange={(v) => setAcademicIssue(v as any)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="Low CGPA (<6.5/7.0)">Low CGPA</TabsTrigger>
                  <TabsTrigger value="Past/Active Academic Backlogs">Backlogs</TabsTrigger>
                  <TabsTrigger value="Non-CS Degree Transition">Non-CS Degree</TabsTrigger>
                  <TabsTrigger value="Career / Education Gap">Career Gap</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Current / Past Degree</Label>
              <Input className="mt-1.5" value={currentDegree} onChange={(e) => setCurrentDegree(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Engineering Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Actual Hands-On Skills & Coding Experience You've Built</Label>
              <Input className="mt-1.5" value={actualSkillsLearned} onChange={(e) => setActualSkillsLearned(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={rebrand.isPending} onClick={() => rebrand.mutate()} className="signal-gradient text-primary-foreground border-0">
            {rebrand.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Lightbulb className="size-4 mr-2" />}
            {rebrand.isPending ? "Generating Rebrand Strategy…" : "Build Low-CGPA Defense & Strategy"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Verbal Defense Scripts */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" />
              Recruiter Tough Question Defense Scripts
            </h2>

            <div className="space-y-4">
              {result.verbal_defense_scripts.map((script, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-amber-500">
                      Recruiter: "{script.recruiter_question}"
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => copyText(script.recommended_verbal_answer)}>
                      <Copy className="size-3.5" />
                    </Button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-foreground leading-relaxed italic">
                    {script.recommended_verbal_answer}
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    <strong className="text-emerald-500">Psychological Intent:</strong> {script.psychological_intent}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Resume Restructuring & Zero-GPA Channels */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Resume Masking & Restructuring Hacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.resume_restructuring_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✦</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="size-4 text-primary" />
                  Zero-GPA-Filter Hiring Channels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.hiring_channels_with_zero_gpa_filter.map((ch, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">✦</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
