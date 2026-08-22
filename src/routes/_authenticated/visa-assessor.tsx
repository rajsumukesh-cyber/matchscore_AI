import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Globe,
  Loader2,
  Sparkles,
  CheckCircle2,
  Plane,
  FileCheck,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { fetchVisaAssessment } from "@/lib/visa-assessor.functions";
import type { VisaAssessmentResult } from "@/lib/visa-assessor.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/visa-assessor")({
  head: () => ({
    meta: [
      { title: "AI Global Visa & Tech Relocation Assessor MatchScore" },
      {
        name: "description",
        content:
          "Evaluate eligibility for UK Global Talent, EU Blue Card, Canada GTS, and US tech visas with custom evidence roadmaps.",
      },
    ],
  }),
  component: VisaAssessorPage,
});

function VisaAssessorPage() {
  const [targetRole, setTargetRole] = useState("Staff Software Engineer");
  const [yearsExperience, setYearsExperience] = useState<number>(6);
  const [highestEducation, setHighestEducation] = useState("Bachelor of Technology in Computer Science");
  const [hasOpenSource, setHasOpenSource] = useState(true);
  const [result, setResult] = useState<VisaAssessmentResult | null>(null);

  const assess = useMutation({
    mutationFn: () =>
      fetchVisaAssessment({
        data: {
          targetRole,
          yearsExperience: Number(yearsExperience) || 0,
          highestEducation,
          hasOpenSourceOrPatents: hasOpenSource,
          targetRegions: ["UK", "EU", "Canada", "US"],
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Global Visa Assessment ready!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Globe className="size-8 text-primary" />
          AI Global Visa & Tech Relocation Assessor
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Assess your qualifications for high-skilled tech visas (UK Global Talent, EU Blue Card, Canada
          Global Talent Stream, US O-1/H-1B) and get a personalized evidence-building roadmap.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Global Profile & Qualifications</CardTitle>
          <CardDescription>
            Enter your background to evaluate immigration pathways and talent endorsement readiness.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Target Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Years of Specialized Tech Experience</Label>
              <Input className="mt-1.5" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Highest Educational Degree</Label>
              <Input className="mt-1.5" value={highestEducation} onChange={(e) => setHighestEducation(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch id="os-toggle" checked={hasOpenSource} onCheckedChange={setHasOpenSource} />
            <Label htmlFor="os-toggle" className="text-xs font-semibold cursor-pointer">
              I have notable Open-Source contributions, public talks, or technical publications
            </Label>
          </div>

          <Button size="lg" disabled={assess.isPending} onClick={() => assess.mutate()} className="signal-gradient text-primary-foreground border-0">
            {assess.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plane className="size-4 mr-2" />}
            {assess.isPending ? "Evaluating Pathways…" : "Assess Global Visa Eligibility"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Mobility Score Banner */}
          <Card className="surface-panel p-5 border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-8 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.overall_global_mobility_score}% Global Tech Mobility Score
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.candidate_profile_summary}</p>
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Progress value={result.overall_global_mobility_score} className="h-2.5" />
              </div>
            </div>
          </Card>

          {/* Visa Pathways Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {result.pathways.map((p, i) => (
              <Card key={i} className="surface-panel p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase">{p.country}</span>
                    <Badge variant="outline" className={cn(
                      "text-xs font-semibold",
                      p.eligibility_rating === "High" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" :
                      "border-amber-500/30 text-amber-500 bg-amber-500/10"
                    )}>
                      {p.eligibility_rating} Eligibility
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{p.visa_name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span>{p.processing_speed}</span>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-foreground uppercase">Key Criteria Met</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {p.key_requirements_met.map((req, ri) => (
                        <li key={ri} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <p className="text-[11px] font-bold text-amber-500 uppercase">Evidence to Prepare</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {p.missing_evidence_to_prepare.map((evi, ei) => (
                        <li key={ei} className="flex items-start gap-2">
                          <AlertCircle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{evi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Evidence Strengthening Roadmap */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="size-4 text-primary" />
                Personalized Evidence Strengthening Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.evidence_strengthening_roadmap.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✦</span>
                    <span>{step}</span>
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
