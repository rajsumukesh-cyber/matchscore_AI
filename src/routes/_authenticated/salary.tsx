import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  Building2,
  Sparkles,
  Copy,
  CheckCircle2,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { fetchSalaryBenchmark } from "@/lib/salary.functions";
import type { SalaryBenchmarkResult } from "@/lib/salary.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/salary")({
  head: () => ({
    meta: [
      { title: "AI Salary & Market Value Benchmark MatchScore" },
      {
        name: "description",
        content: "Predict your market compensation, calculate skill gap salary multipliers, and generate negotiation scripts.",
      },
      { property: "og:title", content: "AI Salary & Market Value Benchmark MatchScore" },
      {
        property: "og:description",
        content: "Predict your market compensation and skill boost multipliers in INR and USD.",
      },
    ],
  }),
  component: SalaryBenchmarkPage,
});

const QUICK_ROLES = [
  "Senior Full Stack Engineer",
  "Backend System Architect",
  "AI & LLM Application Engineer",
  "Cloud & DevOps Engineer",
  "Engineering Lead / Manager",
];

function SalaryBenchmarkPage() {
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [experienceYears, setExperienceYears] = useState("5");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [benchmarkData, setBenchmarkData] = useState<SalaryBenchmarkResult | null>(null);

  const predictMutation = useMutation({
    mutationFn: async () => {
      return fetchSalaryBenchmark({
        data: {
          targetRole,
          experienceYears: Number(experienceYears) || 5,
        },
      });
    },
    onSuccess: (data) => {
      setBenchmarkData(data);
      toast.success("Market compensation benchmarks calculated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function copyScript(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Negotiation script copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <DollarSign className="size-8 text-primary" />
          AI Salary & Market Value Benchmark Predictor
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Evaluate expected compensation ranges, discover the monetary value of closing specific technical skill gaps, and generate proven salary negotiation scripts.
        </p>
      </div>

      {/* Benchmark Input Card */}
      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Calculate Your Market Value</CardTitle>
          <CardDescription>
            Enter your target role and experience to project compensation tiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="role-input" className="text-xs font-semibold">
                Target Role
              </Label>
              <Input
                id="role-input"
                className="mt-1.5"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
              />
            </div>

            <div>
              <Label htmlFor="years-input" className="text-xs font-semibold">
                Years of Experience
              </Label>
              <Input
                id="years-input"
                className="mt-1.5"
                type="number"
                min="0"
                max="25"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Quick select roles:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTargetRole(r)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-all",
                    targetRole === r
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Button
              size="lg"
              disabled={predictMutation.isPending}
              onClick={() => predictMutation.mutate()}
            >
              {predictMutation.isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <TrendingUp className="size-4 mr-2" />
              )}
              {predictMutation.isPending ? "Calculating Market Benchmarks…" : "Predict Market Compensation"}
            </Button>

            <div className="flex items-center gap-2 border border-border rounded-lg p-1 bg-background">
              <span className="text-xs font-medium px-2 text-muted-foreground">Currency:</span>
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-colors",
                  currency === "INR" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                INR (₹ Lakhs)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition-colors",
                  currency === "USD" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                USD ($)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {benchmarkData ? (
        <div className="space-y-6">
          {/* Base Compensation Range Card */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="surface-panel p-5">
              <span className="text-xs text-muted-foreground uppercase font-medium">Lower Quartile (25th %)</span>
              <p className="font-display text-2xl font-bold text-foreground mt-1">
                {currency === "INR" ? benchmarkData.base_salary_inr.min : benchmarkData.base_salary_usd.min}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Entry baseline for this experience level</p>
            </Card>

            <Card className="surface-panel p-5 border-primary/40 bg-primary/5">
              <span className="text-xs text-primary uppercase font-bold">Median Market Baseline (50th %)</span>
              <p className="font-display text-3xl font-extrabold text-primary mt-1">
                {currency === "INR" ? benchmarkData.base_salary_inr.median : benchmarkData.base_salary_usd.median}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Standard package for matched candidates</p>
            </Card>

            <Card className="surface-panel p-5">
              <span className="text-xs text-emerald-500 uppercase font-medium">Upper Quartile (Top 10%)</span>
              <p className="font-display text-2xl font-bold text-foreground mt-1">
                {currency === "INR" ? benchmarkData.base_salary_inr.max : benchmarkData.base_salary_usd.max}
              </p>
              <p className="text-xs text-muted-foreground mt-1">High-impact candidates with verified skill mastery</p>
            </Card>
          </div>

          {/* Skill Boost Multiplier Table */}
          <Card className="surface-panel border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Skill Gap Salary Multiplier (Annual Compensation Boost)
              </CardTitle>
              <CardDescription>
                Monetary uplift gained by acquiring each prioritized technical skill.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {benchmarkData.skill_boosts.map((boost) => (
                  <div
                    key={boost.skill}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5 bg-background/60 hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-semibold text-foreground">{boost.skill}</span>
                      <p className="text-[11px] text-muted-foreground">Market Demand: {boost.demand_level}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
                      {currency === "INR" ? boost.annual_boost_inr : boost.annual_boost_usd}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Paying Companies Benchmark */}
          <Card className="surface-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                Top Paying Employer Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {benchmarkData.top_paying_companies.map((comp) => (
                  <div key={comp.company} className="rounded-xl border border-border p-4 space-y-2 bg-background/50">
                    <Badge variant="secondary" className="text-[10px]">
                      {comp.tier}
                    </Badge>
                    <p className="font-bold text-base text-foreground">{comp.company}</p>
                    <p className="font-mono text-xs text-primary font-semibold">
                      {currency === "INR" ? comp.compensation_range_inr : comp.compensation_range_usd}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {comp.top_demanded_skills.map((s) => (
                        <Badge key={s} variant="outline" className="text-[9px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Negotiation Strategy & Script */}
          <Card className="surface-panel border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  AI Salary Negotiation Strategy & Script
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs border-primary/30 hover:bg-primary/10"
                  onClick={() => copyScript(benchmarkData.negotiation_strategy.negotiation_email_script)}
                >
                  <Copy className="size-3" />
                  Copy Script
                </Button>
              </div>
              <CardDescription>
                {benchmarkData.negotiation_strategy.recommended_target}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-background p-3.5 border border-border space-y-1.5 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Key Leverage Points to Emphasize:</p>
                {benchmarkData.negotiation_strategy.key_leverage_points.map((pt, i) => (
                  <p key={i}>• {pt}</p>
                ))}
              </div>

              <div className="rounded-xl bg-background p-4 border border-primary/20 space-y-1.5">
                <span className="text-xs font-bold uppercase text-primary">Negotiation Email Template:</span>
                <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground leading-relaxed">
                  {benchmarkData.negotiation_strategy.negotiation_email_script}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
