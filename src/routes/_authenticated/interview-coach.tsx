import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  HeartHandshake,
  Loader2,
  Copy,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  Zap,
} from "lucide-react";
import { fetchInterviewCoaching } from "@/lib/interview-coach.functions";
import type { InterviewCoachResult } from "@/lib/interview-coach.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/interview-coach")({
  head: () => ({
    meta: [
      { title: "AI Live Interview Anxiety & Panic-Free Coach MatchScore" },
      {
        name: "description",
        content:
          "Overcome coding interview panic with a 4-step verbal framework, emergency scripts when stuck, and post-interview follow-ups.",
      },
    ],
  }),
  component: InterviewCoachPage,
});

function InterviewCoachPage() {
  const [codingTopic, setCodingTopic] = useState<"Array / Two Pointers" | "Hash Map & String Manipulation" | "Binary Trees & BST" | "Dynamic Programming & Recursion" | "System Architecture & APIs">("Hash Map & String Manipulation");
  const [anxietyLevel, setAnxietyLevel] = useState<"High (Freeze up under timer)" | "Moderate (Struggle explaining thoughts)" | "Mild (Need structuring)">("High (Freeze up under timer)");
  const [result, setResult] = useState<InterviewCoachResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchInterviewCoaching({
        data: {
          codingTopic,
          anxietyLevel,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Panic-free interview coaching ready!");
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
          <HeartHandshake className="size-8 text-rose-500" />
          AI Live Interview Anxiety & Step-by-Step Hint Coach
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Designed for students and developers who freeze up under interview pressure. Master the 4-step
          Panic-Free Method, learn what to say when stuck, and guarantee passing scores.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Interview Topic & Anxiety Level</CardTitle>
          <CardDescription>
            Tailor the coaching protocol to the exact coding topic and nervous pressure level you face.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold">Technical Interview Topic</Label>
            <div className="mt-1.5">
              <Tabs value={codingTopic} onValueChange={(v) => setCodingTopic(v as any)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
                  <TabsTrigger value="Hash Map & String Manipulation">Hash Maps & Strings</TabsTrigger>
                  <TabsTrigger value="Array / Two Pointers">Arrays & Pointers</TabsTrigger>
                  <TabsTrigger value="Binary Trees & BST">Trees & Graphs</TabsTrigger>
                  <TabsTrigger value="Dynamic Programming & Recursion">DP & Recursion</TabsTrigger>
                  <TabsTrigger value="System Architecture & APIs">System & APIs</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Your Anxiety / Panic Tendency</Label>
            <div className="mt-1.5">
              <Tabs value={anxietyLevel} onValueChange={(v) => setAnxietyLevel(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="High (Freeze up under timer)">High (Freeze Up)</TabsTrigger>
                  <TabsTrigger value="Moderate (Struggle explaining thoughts)">Moderate (Stumble)</TabsTrigger>
                  <TabsTrigger value="Mild (Need structuring)">Mild (Need Structure)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <ShieldCheck className="size-4 mr-2" />}
            {generate.isPending ? "Generating Coaching Protocol…" : "Generate Panic-Free Interview Protocol"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* 4-Step Panic-Free Protocol */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              The 4-Step Panic-Free Live Interview Framework
            </h2>

            <div className="space-y-4">
              {result.panic_prevention_protocol.map((step, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                      Step {step.step_number}: {step.phase_title}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyText(step.what_to_say_out_loud)}>
                      <Copy className="size-3.5 mr-1" /> Copy Script
                    </Button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground font-medium leading-relaxed">
                    <strong className="text-primary block mb-0.5">🗣️ Say This Out Loud:</strong>
                    {step.what_to_say_out_loud}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 text-xs pt-1">
                    <p className="text-muted-foreground"><strong className="text-foreground">Why this saves you:</strong> {step.why_this_works}</p>
                    <p className="text-emerald-600 dark:text-emerald-400"><strong className="text-foreground">Interviewer impression:</strong> {step.interviewer_impression}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Emergency Scripts When Stuck */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="size-4 text-amber-500" />
                Emergency Lifeline Scripts (When You Get Completely Stuck)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.emergency_scripts_when_stuck.map((em, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500">{em.scenario}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyText(em.script)}>
                      <Copy className="size-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-foreground italic bg-muted/40 p-2.5 rounded-lg leading-relaxed">
                    "{em.script}"
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Follow-up Note */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Post-Interview Thank You & Edge Case Follow-Up Email
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.post_interview_followup_note)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Email
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.post_interview_followup_note}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
