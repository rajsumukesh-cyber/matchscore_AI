import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Award,
  Loader2,
  Copy,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { fetchRecommendations } from "@/lib/recommendations.functions";
import type { ReferenceCheckResult } from "@/lib/recommendations.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/recommendations")({
  head: () => ({
    meta: [
      { title: "AI Recommendation Letter & Reference Prep MatchScore" },
      {
        name: "description",
        content:
          "Generate LinkedIn recommendation letters from 3 perspectives and reference check prep sheets.",
      },
    ],
  }),
  component: RecommendationsPage,
});

function RecommendationsPage() {
  const [candidateName, setCandidateName] = useState("Alex Johnson");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [keySkills, setKeySkills] = useState("TypeScript, React, Node.js, Distributed Architecture, AWS");
  const [notableAchievement, setNotableAchievement] = useState("architecting an event-driven payment service handling 15,000 RPS with zero downtime");
  const [result, setResult] = useState<ReferenceCheckResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchRecommendations({
        data: {
          candidateName,
          targetRole,
          keySkills,
          notableAchievement,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Recommendation letters & reference prep generated!");
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
          <Award className="size-8 text-primary" />
          AI Reference Check & Recommendation Letter Studio
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Draft high-impact LinkedIn recommendation letters for your former managers, peers, and mentees
          to sign, and prepare your references with bulletproof talking points for recruiter calls.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Details & Background</CardTitle>
          <CardDescription>
            Specify the role and notable contributions to generate authentic recommendation letters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Full Name</Label>
              <Input className="mt-1.5" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Key Skills to Highlight</Label>
              <Input className="mt-1.5" value={keySkills} onChange={(e) => setKeySkills(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Notable Project / Achievement</Label>
              <Input className="mt-1.5" value={notableAchievement} onChange={(e) => setNotableAchievement(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {generate.isPending ? "Generating Recommendations…" : "Generate Recommendation Letters"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* 3 Letters */}
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              3 Tailored Recommendation Letters
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {result.recommendations.map((rec, i) => (
                <Card key={i} className="surface-panel flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      {rec.perspective}
                    </Badge>
                    <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg leading-relaxed italic">
                      "{rec.letter_text}"
                    </p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {rec.key_traits_highlighted.map((t, ti) => (
                        <Badge key={ti} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyText(rec.letter_text)} className="w-full">
                    <Copy className="size-3.5 mr-1.5" /> Copy Letter Text
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Reference Check Prep Q&A */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="size-4 text-emerald-500" />
                Reference Call Prep Sheet (Send to your references before calls)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.reference_prep_qas.map((qa, i) => (
                <div key={i} className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">Q: {qa.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{qa.suggested_answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
