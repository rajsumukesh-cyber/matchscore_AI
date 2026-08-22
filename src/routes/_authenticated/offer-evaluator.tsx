import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Coins,
  Loader2,
  Copy,
  Sparkles,
  Trophy,
  Scale,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { fetchOfferEvaluation } from "@/lib/offer-evaluator.functions";
import type { OfferEvaluationResult } from "@/lib/offer-evaluator.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/offer-evaluator")({
  head: () => ({
    meta: [
      { title: "AI Offer Evaluator & Equity Analyzer MatchScore" },
      {
        name: "description",
        content:
          "Evaluate and compare job offers across base salary, annual bonuses, equity, and sign-on perks with custom counter-offer scripts.",
      },
    ],
  }),
  component: OfferEvaluatorPage,
});

function OfferEvaluatorPage() {
  // Offer A
  const [companyA, setCompanyA] = useState("Google");
  const [roleA, setRoleA] = useState("Senior Software Engineer");
  const [baseA, setBaseA] = useState<number>(35);
  const [currencyA, setCurrencyA] = useState<"INR" | "USD">("INR");
  const [bonusA, setBonusA] = useState<number>(15);
  const [equityA, setEquityA] = useState<number>(12);
  const [signOnA, setSignOnA] = useState<number>(5);
  const [workModeA, setWorkModeA] = useState<"Remote" | "Hybrid" | "On-site">("Hybrid");

  // Offer B Toggle
  const [hasOfferB, setHasOfferB] = useState(true);
  const [companyB, setCompanyB] = useState("Microsoft");
  const [roleB, setRoleB] = useState("Senior SDE");
  const [baseB, setBaseB] = useState<number>(38);
  const [currencyB, setCurrencyB] = useState<"INR" | "USD">("INR");
  const [bonusB, setBonusB] = useState<number>(10);
  const [equityB, setEquityB] = useState<number>(10);
  const [signOnB, setSignOnB] = useState<number>(3);
  const [workModeB, setWorkModeB] = useState<"Remote" | "Hybrid" | "On-site">("Remote");

  const [result, setResult] = useState<OfferEvaluationResult | null>(null);

  const evaluate = useMutation({
    mutationFn: () =>
      fetchOfferEvaluation({
        data: {
          companyA,
          roleA,
          baseA: Number(baseA) || 0,
          currencyA,
          bonusA: Number(bonusA) || 0,
          equityA: Number(equityA) || 0,
          signOnA: Number(signOnA) || 0,
          workModeA,
          hasOfferB,
          companyB: hasOfferB ? companyB : undefined,
          roleB: hasOfferB ? roleB : undefined,
          baseB: hasOfferB ? Number(baseB) || 0 : undefined,
          currencyB: hasOfferB ? currencyB : undefined,
          bonusB: hasOfferB ? Number(bonusB) || 0 : undefined,
          equityB: hasOfferB ? Number(equityB) || 0 : undefined,
          signOnB: hasOfferB ? Number(signOnB) || 0 : undefined,
          workModeB: hasOfferB ? workModeB : undefined,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Offer evaluation completed!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  const sym = currencyA === "INR" ? "₹" : "$";
  const unit = currencyA === "INR" ? "L" : "k";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Coins className="size-8 text-amber-500" />
          AI Offer Evaluator & Comp Package Analyzer
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Compare total compensation packages side-by-side (Base, Equity, Bonuses & Perks), identify
          hidden trade-offs, and generate a customized Counter-Offer letter to ask for 10-15% more.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="toggle-b" checked={hasOfferB} onCheckedChange={setHasOfferB} />
        <Label htmlFor="toggle-b" className="text-sm font-semibold cursor-pointer">
          Compare 2 Offers Side-by-Side
        </Label>
      </div>

      <div className={cn("grid gap-6", hasOfferB ? "lg:grid-cols-2" : "max-w-2xl")}>
        {/* Offer A */}
        <Card className="surface-panel border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Offer 1 Details</span>
              <Badge variant="outline" className="text-xs">Primary</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Company Name</Label>
                <Input className="mt-1" value={companyA} onChange={(e) => setCompanyA(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Role Title</Label>
                <Input className="mt-1" value={roleA} onChange={(e) => setRoleA(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Base Salary ({sym}{unit})</Label>
                <Input className="mt-1" type="number" value={baseA} onChange={(e) => setBaseA(Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Annual Bonus (%)</Label>
                <Input className="mt-1" type="number" value={bonusA} onChange={(e) => setBonusA(Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Year 1 Equity ({sym}{unit})</Label>
                <Input className="mt-1" type="number" value={equityA} onChange={(e) => setEquityA(Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-xs">Sign-on Bonus ({sym}{unit})</Label>
                <Input className="mt-1" type="number" value={signOnA} onChange={(e) => setSignOnA(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer B */}
        {hasOfferB ? (
          <Card className="surface-panel border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Offer 2 Details</span>
                <Badge variant="secondary" className="text-xs">Comparison</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Company Name</Label>
                  <Input className="mt-1" value={companyB} onChange={(e) => setCompanyB(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Role Title</Label>
                  <Input className="mt-1" value={roleB} onChange={(e) => setRoleB(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Base Salary ({sym}{unit})</Label>
                  <Input className="mt-1" type="number" value={baseB} onChange={(e) => setBaseB(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Annual Bonus (%)</Label>
                  <Input className="mt-1" type="number" value={bonusB} onChange={(e) => setBonusB(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Year 1 Equity ({sym}{unit})</Label>
                  <Input className="mt-1" type="number" value={equityB} onChange={(e) => setEquityB(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Sign-on Bonus ({sym}{unit})</Label>
                  <Input className="mt-1" type="number" value={signOnB} onChange={(e) => setSignOnB(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Button size="lg" disabled={evaluate.isPending} onClick={() => evaluate.mutate()} className="signal-gradient text-primary-foreground border-0">
        {evaluate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Scale className="size-4 mr-2" />}
        {evaluate.isPending ? "Evaluating Offers…" : "Evaluate & Compare Compensation"}
      </Button>

      {result ? (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <Card className="surface-panel p-5 border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="size-8 text-primary shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {result.winner === "Offer A" ? `${result.offer_a.company_name} Leads` :
                     result.winner === "Offer B" ? `${result.offer_b?.company_name} Leads` :
                     "Offer Analysis Complete"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.overall_verdict}</p>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">{result.offer_a.company_name} Total</p>
                  <p className="text-2xl font-bold text-primary">{sym}{result.offer_a.total_year_1_comp}{unit}</p>
                </div>
                {result.offer_b ? (
                  <>
                    <div className="text-xl font-bold text-muted-foreground self-center">vs</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{result.offer_b.company_name} Total</p>
                      <p className="text-2xl font-bold text-amber-500">{sym}{result.offer_b.total_year_1_comp}{unit}</p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Counter-Offer Letter & Leverage Points */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="size-4 text-primary" />
                  Custom Counter-Offer Letter
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => copyText(result.counter_offer_letter)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy Letter
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                  {result.counter_offer_letter}
                </pre>
              </CardContent>
            </Card>

            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-4 text-emerald-500" />
                  Negotiation Leverage Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {result.negotiation_leverage_points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
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
