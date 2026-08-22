import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarDays,
  Loader2,
  Copy,
  Sparkles,
  CheckCircle2,
  Target,
  Rocket,
  ShieldAlert,
  Quote,
} from "lucide-react";
import { fetchOnboardingPlan } from "@/lib/onboarding-plan.functions";
import type { OnboardingPlanResult } from "@/lib/onboarding-plan.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding-plan")({
  head: () => ({
    meta: [
      { title: "30-60-90 Day Executive Onboarding Plan MatchScore" },
      {
        name: "description",
        content:
          "Generate a strategic 30-60-90 day onboarding plan for your final-round leadership interviews.",
      },
    ],
  }),
  component: OnboardingPlanPage,
});

function OnboardingPlanPage() {
  const [candidateName, setCandidateName] = useState("Alex Johnson");
  const [targetRole, setTargetRole] = useState("Staff Software Engineer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [coreDomain, setCoreDomain] = useState("Distributed Systems & Payment Infrastructure");
  const [result, setResult] = useState<OnboardingPlanResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchOnboardingPlan({
        data: {
          candidateName,
          targetRole,
          companyName,
          coreDomain,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("30-60-90 Day Plan generated!");
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
          <CalendarDays className="size-8 text-emerald-500" />
          30-60-90 Day Executive Onboarding Plan
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Bring a structured, high-impact 30-60-90 Day Plan to your final-round manager and VP
          interviews to demonstrate Day-1 leadership and stand out from all other candidates.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Role & Company Information</CardTitle>
          <CardDescription>
            Specify the company and role to generate a tailored strategic onboarding roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Name</Label>
              <Input className="mt-1.5" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Company Name</Label>
              <Input className="mt-1.5" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Technical Domain / Focus</Label>
              <Input className="mt-1.5" value={coreDomain} onChange={(e) => setCoreDomain(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {generate.isPending ? "Generating Strategy…" : "Generate 30-60-90 Day Plan"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Executive Summary */}
          <Card className="surface-panel border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-5">
              <p className="text-xs font-bold uppercase text-emerald-500">Executive Summary</p>
              <p className="text-sm text-foreground mt-2 leading-relaxed">{result.executive_summary}</p>
            </CardContent>
          </Card>

          {/* 3 Phases */}
          <div className="grid gap-6 lg:grid-cols-3">
            {result.phases.map((p, i) => (
              <Card key={p.phase} className="surface-panel flex flex-col justify-between p-5 space-y-4">
                <div className="space-y-3">
                  <Badge variant="outline" className={cn(
                    "text-xs font-bold",
                    i === 0 ? "border-blue-500/30 text-blue-500 bg-blue-500/10" :
                    i === 1 ? "border-amber-500/30 text-amber-500 bg-amber-500/10" :
                    "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
                  )}>
                    {p.phase}
                  </Badge>
                  <p className="text-sm font-semibold text-foreground">{p.theme}</p>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Key Objectives</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {p.key_objectives.map((obj, oi) => (
                        <li key={oi} className="flex items-start gap-2">
                          <span className="text-primary font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Tangible Deliverables</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {p.deliverables.map((del, di) => (
                        <li key={di} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">📦</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-[11px] font-medium text-foreground">
                    <strong className="text-primary">Milestone:</strong> {p.stakeholder_milestone}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Interview Elevator Pitch */}
          <Card className="surface-panel border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Quote className="size-4 text-primary" />
                Final Interview Verbal Pitch Script
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.interview_pitch)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Script
              </Button>
            </CardHeader>
            <CardContent>
              <p className="italic text-sm text-foreground bg-muted/40 p-4 rounded-xl leading-relaxed">
                {result.interview_pitch}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
