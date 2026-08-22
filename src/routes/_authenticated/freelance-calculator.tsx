import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calculator,
  Loader2,
  Copy,
  Sparkles,
  DollarSign,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { fetchFreelanceRates } from "@/lib/freelance-calculator.functions";
import type { FreelanceCalculatorResult } from "@/lib/freelance-calculator.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/freelance-calculator")({
  head: () => ({
    meta: [
      { title: "AI Freelance & Consulting Rate Calculator MatchScore" },
      {
        name: "description",
        content:
          "Calculate market consulting rates (hourly, daily, retainer) and generate client proposals and value-based pitches.",
      },
    ],
  }),
  component: FreelanceCalculatorPage,
});

function FreelanceCalculatorPage() {
  const [targetRole, setTargetRole] = useState("Staff Cloud Architect / Consultant");
  const [annualFteSalary, setAnnualFteSalary] = useState<number>(35);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [billableWeeks, setBillableWeeks] = useState<number>(44);
  const [billableHours, setBillableHours] = useState<number>(25);
  const [result, setResult] = useState<FreelanceCalculatorResult | null>(null);

  const calculate = useMutation({
    mutationFn: () =>
      fetchFreelanceRates({
        data: {
          targetRole,
          annualFteSalary: Number(annualFteSalary) || 0,
          currency,
          billableWeeksPerYear: Number(billableWeeks) || 44,
          billableHoursPerWeek: Number(billableHours) || 25,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Consulting rates & proposal generated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  const sym = currency === "INR" ? "₹" : "$";
  const unit = currency === "INR" ? "Lakhs" : "k USD";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Calculator className="size-8 text-primary" />
          AI Freelance & Consulting Rate Calculator
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Convert full-time market compensation into calibrated consulting rates (Hourly, Day Rate,
          and Monthly Retainer), and generate client proposals with value-based ROI positioning.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Compensation & Workload Inputs</CardTitle>
          <CardDescription>
            Input your target full-time equivalent salary and billable availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Consulting Domain / Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Currency</Label>
              <div className="mt-1.5">
                <Tabs value={currency} onValueChange={(v) => setCurrency(v as "INR" | "USD")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="INR">INR (₹ Lakhs)</TabsTrigger>
                    <TabsTrigger value="USD">USD ($ k)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Equivalent Annual Full-Time Salary ({sym} {unit})</Label>
              <Input className="mt-1.5" type="number" value={annualFteSalary} onChange={(e) => setAnnualFteSalary(Number(e.target.value))} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Billable Hours / Week</Label>
              <Input className="mt-1.5" type="number" value={billableHours} onChange={(e) => setBillableHours(Number(e.target.value))} />
            </div>
          </div>

          <Button size="lg" disabled={calculate.isPending} onClick={() => calculate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {calculate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <DollarSign className="size-4 mr-2" />}
            {calculate.isPending ? "Calculating Rates…" : "Calculate Rates & Generate Proposal"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Rate Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="surface-panel p-4 space-y-1.5 border-primary/30">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Hourly Advisory</p>
              <p className="text-2xl font-extrabold text-primary">{sym}{result.rates.hourly_rate.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">Per billable hour</p>
            </Card>

            <Card className="surface-panel p-4 space-y-1.5 border-emerald-500/30">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Daily Intensive Rate</p>
              <p className="text-2xl font-extrabold text-emerald-500">{sym}{result.rates.daily_rate.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">8-hour dedicated sprint</p>
            </Card>

            <Card className="surface-panel p-4 space-y-1.5 border-blue-500/30">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Part-Time Retainer</p>
              <p className="text-2xl font-extrabold text-blue-500">{sym}{result.rates.monthly_retainer_part_time.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">20 hrs/week · Monthly</p>
            </Card>

            <Card className="surface-panel p-4 space-y-1.5 border-amber-500/30">
              <p className="text-[11px] font-bold text-muted-foreground uppercase">Dedicated Retainer</p>
              <p className="text-2xl font-extrabold text-amber-500">{sym}{result.rates.monthly_retainer_full_time.toLocaleString()}</p>
              <p className="text-[11px] text-muted-foreground">40 hrs/week · Monthly</p>
            </Card>
          </div>

          {/* Client Proposal Template */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                Ready-to-Send Client Proposal Template
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.proposal_template)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Proposal
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.proposal_template}
              </pre>
            </CardContent>
          </Card>

          {/* Value Pitch & Pricing Tips */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  Value-Based Pitch Script
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg">
                  {result.value_based_pitch}
                </p>
              </CardContent>
            </Card>

            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Pricing Strategy & Retainer Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.pricing_strategy_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✦</span>
                      <span>{tip}</span>
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
