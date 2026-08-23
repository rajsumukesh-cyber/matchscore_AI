import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calculator,
  Loader2,
  Copy,
  Sparkles,
  Zap,
  Target,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { fetchAptitudeCoaching } from "@/lib/aptitude-coach.functions";
import type { AptitudeCoachResult } from "@/lib/aptitude-coach.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/aptitude-coach")({
  head: () => ({
    meta: [
      { title: "AI Campus Placement Aptitude & Fast-Math Coach MatchScore" },
      {
        name: "description",
        content:
          "Ace campus placement exams and online assessments (TCS, Infosys, Amazon) with fast-math shortcuts, LCM work tricks, and logical reasoning rules.",
      },
    ],
  }),
  component: AptitudeCoachPage,
});

function AptitudeCoachPage() {
  const [targetCompanyOrExam, setTargetCompanyOrExam] = useState("TCS NQT / Infosys / Amazon Online Assessment");
  const [focusCategory, setFocusCategory] = useState<"Quantitative Aptitude" | "Logical Reasoning" | "Verbal & Critical Thinking">("Quantitative Aptitude");
  const [result, setResult] = useState<AptitudeCoachResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchAptitudeCoaching({
        data: {
          targetCompanyOrExam,
          focusCategory,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Aptitude shortcuts & exam tricks ready!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <BrainCircuit className="size-8 text-primary" />
          AI Campus Placement Aptitude & Fast-Math Coach
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Pass campus recruitment drives (TCS, Infosys, Cognizant, Amazon OA). Master 10-second mental-math
          shortcuts, LCM efficiency methods for Time & Work, and syllogism cross-out tricks.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Target Exam & Category Focus</CardTitle>
          <CardDescription>
            Select your assessment focus to generate instant mental shortcuts and step-by-step solved tricks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold">Assessment Category</Label>
            <div className="mt-1.5">
              <Tabs value={focusCategory} onValueChange={(v) => setFocusCategory(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="Quantitative Aptitude">Quant & Fast Math</TabsTrigger>
                  <TabsTrigger value="Logical Reasoning">Logical Reasoning</TabsTrigger>
                  <TabsTrigger value="Verbal & Critical Thinking">Verbal & English</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Target Company / Exam Drive</Label>
            <Input className="mt-1.5" value={targetCompanyOrExam} onChange={(e) => setTargetCompanyOrExam(e.target.value)} />
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Zap className="size-4 mr-2" />}
            {generate.isPending ? "Calculating Fast Tricks…" : "Generate Aptitude Shortcuts"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-8">
          {/* Shortcuts Grid */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-amber-500" />
              High-Speed Mental Math & Logical Pattern Shortcuts
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {result.shortcuts.map((sc, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                      {sc.topic_name}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {sc.category}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-xs space-y-1">
                    <strong className="text-primary block text-[11px]">📐 Standard Formula / Pattern:</strong>
                    <p className="font-mono text-foreground">{sc.core_formula_or_pattern}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                    <strong className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <Zap className="size-3.5" /> 10-Second Fast-Math Shortcut:
                    </strong>
                    <p className="text-foreground leading-relaxed">{sc.speed_shortcut_trick}</p>
                  </div>

                  <div className="space-y-1 pt-1 text-xs">
                    <strong className="text-muted-foreground block text-[11px]">📝 Sample Exam Question:</strong>
                    <p className="text-foreground italic">"{sc.sample_question}"</p>
                    <pre className="whitespace-pre-wrap font-sans text-muted-foreground bg-muted/30 p-2.5 rounded-lg text-[11px] leading-relaxed mt-1">
                      {sc.step_by_step_solution}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Exam Day Time Management */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                Exam Day Speed & Time Management Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.exam_day_time_management_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">✦</span>
                    <span>{rule}</span>
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
