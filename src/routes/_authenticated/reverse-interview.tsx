import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  HelpCircle,
  Loader2,
  Copy,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
} from "lucide-react";
import { fetchReverseInterview } from "@/lib/reverse-interview.functions";
import type { ReverseInterviewResult } from "@/lib/reverse-interview.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reverse-interview")({
  head: () => ({
    meta: [
      { title: "AI Reverse Interview & Due Diligence MatchScore" },
      {
        name: "description",
        content:
          "Generate high-conviction reverse interview questions for managers, peers, and CTOs to detect red flags.",
      },
    ],
  }),
  component: ReverseInterviewPage,
});

function ReverseInterviewPage() {
  const [companyName, setCompanyName] = useState("Acme Cloud Corp");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [companyStage, setCompanyStage] = useState("Series B - High-Growth Scaleup");
  const [result, setResult] = useState<ReverseInterviewResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchReverseInterview({
        data: {
          companyName,
          targetRole,
          companyStage,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Reverse interview questions generated!");
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
          <HelpCircle className="size-8 text-primary" />
          AI Reverse Interviewer & Company Due Diligence
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Don't accept an offer blind. Equip yourself with high-conviction questions categorized by
          interviewer type (Hiring Manager, Staff Peer, VP/CTO) with red-flag detection guides.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Target Company Details</CardTitle>
          <CardDescription>
            Specify the company and interview stage to tailor sharp reverse interview questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Company Name</Label>
              <Input className="mt-1.5" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Company Stage / Size</Label>
              <Input className="mt-1.5" value={companyStage} onChange={(e) => setCompanyStage(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {generate.isPending ? "Generating Questions…" : "Generate Reverse Interview Questions"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Categories Grid */}
          <div className="space-y-4">
            {result.categories.map((cat, i) => (
              <Card key={i} className="surface-panel p-5 space-y-4">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                  Ask: {cat.interviewer_type}
                </Badge>

                <div className="space-y-4">
                  {cat.questions.map((q, qi) => (
                    <div key={qi} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-bold text-foreground leading-snug">
                          "{q.question}"
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => copyText(q.question)} className="shrink-0">
                          <Copy className="size-3.5" />
                        </Button>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                          <strong className="text-emerald-500 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="size-3.5" /> What to Listen For
                          </strong>
                          <p className="text-muted-foreground leading-relaxed">{q.what_to_listen_for}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 space-y-1">
                          <strong className="text-red-500 flex items-center gap-1 font-bold">
                            <AlertTriangle className="size-3.5" /> Red Flag Answer
                          </strong>
                          <p className="text-muted-foreground leading-relaxed">{q.red_flag_response}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Due Diligence Checklist */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-500" />
                Pre-Offer Due Diligence Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.due_diligence_checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">✦</span>
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
