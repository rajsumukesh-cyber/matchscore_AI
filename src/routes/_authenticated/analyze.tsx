import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Sparkles, ShieldCheck, Check, Plus } from "lucide-react";
import { fetchResumes } from "@/lib/resumes.functions";
import { fetchJobs } from "@/lib/jobs.functions";
import { fetchPaymentMode, fetchPricing } from "@/lib/payments.functions";
import { runMatchAnalysis } from "@/lib/analysis.functions";
import { useX402Payment, STAGE_COPY } from "@/hooks/use-x402-payment";
import type { ProductCode } from "@/lib/x402";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/currency";

export const Route = createFileRoute("/_authenticated/analyze")({
  head: () => ({
    meta: [
      { title: "New analysis MatchScore" },
      { name: "description", content: "Score a resume against a role with explainable AI." },
      { property: "og:title", content: "New analysis MatchScore" },
      { property: "og:description", content: "Score a resume against a role with explainable AI." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductCode>("match_analysis");

  const resumes = useQuery({ queryKey: ["resumes"], queryFn: () => fetchResumes() });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => fetchJobs() });
  const pricing = useQuery({ queryKey: ["pricing"], queryFn: () => fetchPricing() });
  const payMode = useQuery({ queryKey: ["payment-mode"], queryFn: () => fetchPaymentMode() });

  const resumeList = Array.isArray(resumes.data) ? resumes.data : [];
  const jobList = Array.isArray(jobs.data) ? jobs.data : [];
  const pricingList = Array.isArray(pricing.data) ? pricing.data : [];

  // Default selection for seamless 1-click analysis
  useEffect(() => {
    if (!resumeId && resumeList.length > 0) {
      setResumeId(resumeList[0].id);
    }
  }, [resumeList, resumeId]);

  useEffect(() => {
    if (!jobId && jobList.length > 0) {
      setJobId(jobList[0].id);
    }
  }, [jobList, jobId]);

  const { pay, stage } = useX402Payment();
  const [running, setRunning] = useState(false);

  const analyze = useMutation({
    mutationFn: async () => {
      const activeResumeId = resumeId || (resumeList[0]?.id ?? "demo-resume-1");
      const activeJobId = jobId || (jobList[0]?.id ?? "demo-job-1");

      const receipt = await pay(product);
      const paymentId = receipt?.paymentId ?? `sbx-${Date.now()}`;

      setRunning(true);
      const result = await runMatchAnalysis({
        data: {
          resumeId: activeResumeId,
          jobDescriptionId: activeJobId,
          product,
          paymentId,
        },
      });
      return result;
    },
    onSuccess: (result) => {
      setRunning(false);
      if (!result) return;
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`Analysis complete: ${result.overallScore}/100`);
      navigate({ to: "/reports/$id", params: { id: result.id } });
    },
    onError: (error: Error) => {
      setRunning(false);
      toast.error(error.message);
    },
  });

  const busy = analyze.isPending || running;
  const selectedPrice = pricingList.find((p) => p.product === product)?.price_usd ?? 0.5;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            New analysis
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a resume and a target role, choose a report tier, then score match alignment.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => {
            if (resumeList.length > 0) setResumeId(resumeList[0].id);
            if (jobList.length > 0) setJobId(jobList[0].id);
            setProduct("match_analysis");
            toast.info("Reset selections for a new analysis");
          }}
        >
          <Plus className="size-4 mr-1.5" />
          Reset analysis
        </Button>
      </div>

      <Alert>
        <ShieldCheck className="size-4 text-primary" />
        <AlertTitle>Test Mode Active</AlertTitle>
        <AlertDescription>
          Analyses run with full explainable scoring, ATS compatibility reports, and actionable keyword suggestions instantly.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base">1 · Choose a resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumes.isLoading ? (
              <Skeleton className="h-28" />
            ) : resumeList.length === 0 ? (
              <EmptyPicker to="/resumes" label="Upload a resume first" />
            ) : (
              resumeList.map((r) => (
                <PickRow
                  key={r.id}
                  active={resumeId === r.id}
                  title={r.title}
                  subtitle={r.candidate_name ?? `Version ${r.version}`}
                  onClick={() => setResumeId(r.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel">
          <CardHeader>
            <CardTitle className="text-base">2 · Choose a job role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {jobs.isLoading ? (
              <Skeleton className="h-28" />
            ) : jobList.length === 0 ? (
              <EmptyPicker to="/jobs" label="Save a job description first" />
            ) : (
              jobList.map((j) => (
                <PickRow
                  key={j.id}
                  active={jobId === j.id}
                  title={j.title}
                  subtitle={j.company ?? j.seniority ?? "Saved role"}
                  onClick={() => setJobId(j.id)}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-panel">
        <CardHeader>
          <CardTitle className="text-base">3 · Report tier</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {pricing.isLoading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-28" />)
            : pricingList.map((tier) => (
                <button
                  type="button"
                  key={tier.product}
                  onClick={() => setProduct(tier.product)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all",
                    product === tier.product
                      ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{tier.label}</span>
                    {product === tier.product ? (
                      <Check className="size-4 text-primary" />
                    ) : null}
                  </div>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">
                    {formatInr(tier.price_usd)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{tier.description}</p>
                </button>
              ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          disabled={busy}
          onClick={() => analyze.mutate()}
        >
          {busy ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
          {running ? "Analyzing match fit…" : STAGE_COPY[stage]}
          {selectedPrice != null && !busy ? (
            <Badge variant="secondary" className="ml-2 font-mono">
              {formatInr(selectedPrice)}
            </Badge>
          ) : null}
        </Button>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Priced in INR · Instant full explainable candidate and ATS analysis.
        </p>
      </div>
    </div>
  );
}

function PickRow({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
        active ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border hover:bg-accent/10",
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      {active ? <Check className="size-4 shrink-0 text-primary" /> : null}
    </button>
  );
}

function EmptyPicker({ to, label }: { to: "/resumes" | "/jobs"; label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Button asChild size="sm" variant="outline" className="mt-3">
        <Link to={to}>Open library</Link>
      </Button>
    </div>
  );
}
