import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Scale,
  Loader2,
  Trophy,
  Users,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { fetchResumes } from "@/lib/resumes.functions";
import { fetchHeadToHead } from "@/lib/compare.functions";
import type { HeadToHeadResult, ComparisonDimension } from "@/lib/compare.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/compare")({
  head: () => ({
    meta: [
      { title: "AI Resume Head-to-Head Comparator MatchScore" },
      {
        name: "description",
        content:
          "Compare two candidate resumes side by side across 5 scoring dimensions to find the best hire.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => fetchResumes(),
  });

  const [resumeAId, setResumeAId] = useState("");
  const [resumeBId, setResumeBId] = useState("");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [result, setResult] = useState<HeadToHeadResult | null>(null);

  const compare = useMutation({
    mutationFn: () =>
      fetchHeadToHead({
        data: { resumeAId, resumeBId, targetRole },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Comparison complete!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Scale className="size-8 text-primary" />
          AI Resume Head-to-Head Comparator
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Compare two candidates side-by-side across 5 scoring dimensions with a data-driven
          verdict and hiring recommendation.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Select Candidates to Compare</CardTitle>
          <CardDescription>
            Pick two resumes from your library and a target role to evaluate against.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="size-4 animate-spin" /> Loading resumes…</div>
          ) : resumes.length < 2 ? (
            <div className="flex items-center gap-2 text-amber-500 text-sm">
              <AlertCircle className="size-4" /> You need at least 2 resumes in your library to use this feature.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold">Candidate A</Label>
                  <select
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={resumeAId}
                    onChange={(e) => setResumeAId(e.target.value)}
                  >
                    <option value="">Select resume A…</option>
                    {resumes.map((r: any) => (
                      <option key={r.id} value={r.id} disabled={r.id === resumeBId}>
                        {r.candidate_name || r.title || r.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold">Candidate B</Label>
                  <select
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={resumeBId}
                    onChange={(e) => setResumeBId(e.target.value)}
                  >
                    <option value="">Select resume B…</option>
                    {resumes.map((r: any) => (
                      <option key={r.id} value={r.id} disabled={r.id === resumeAId}>
                        {r.candidate_name || r.title || r.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="max-w-xs">
                <Label className="text-xs font-semibold">Target Role</Label>
                <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
              </div>
            </>
          )}

          <Button
            size="lg"
            disabled={compare.isPending || !resumeAId || !resumeBId || resumeAId === resumeBId}
            onClick={() => compare.mutate()}
          >
            {compare.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Scale className="size-4 mr-2" />}
            {compare.isPending ? "Comparing…" : "Run Head-to-Head Comparison"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Verdict Banner */}
          <Card className={cn(
            "surface-panel p-5 border-2",
            result.verdict.includes("A") ? "border-blue-500/40 bg-blue-500/5" :
            result.verdict.includes("B") ? "border-amber-500/40 bg-amber-500/5" :
            "border-muted bg-muted/10",
          )}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className={cn(
                  "size-8",
                  result.verdict.includes("A") ? "text-blue-500" :
                  result.verdict.includes("B") ? "text-amber-500" :
                  "text-muted-foreground",
                )} />
                <div>
                  <p className="text-xl font-bold text-foreground">{result.verdict}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.verdict_rationale}</p>
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">{result.candidate_a_label}</p>
                  <p className="text-2xl font-bold text-blue-500">{result.overall_a}</p>
                </div>
                <div className="text-xl font-bold text-muted-foreground self-center">vs</div>
                <div>
                  <p className="text-xs text-muted-foreground">{result.candidate_b_label}</p>
                  <p className="text-2xl font-bold text-amber-500">{result.overall_b}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Dimension Breakdown */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Dimension-by-Dimension Breakdown
            </h2>

            {result.dimensions.map((d) => (
              <Card key={d.dimension} className="surface-panel">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{d.dimension}</p>
                    <Badge variant={d.winner === "Tie" ? "secondary" : "outline"} className={cn(
                      "text-xs",
                      d.winner === "A" ? "border-blue-500/30 text-blue-500" :
                      d.winner === "B" ? "border-amber-500/30 text-amber-500" :
                      "",
                    )}>
                      {d.winner === "Tie" ? "Tie" : d.winner === "A" ? `${result.candidate_a_label} Wins` : `${result.candidate_b_label} Wins`}
                    </Badge>
                  </div>

                  {/* Dual progress bars */}
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-500 font-medium">{result.candidate_a_label}</span>
                        <span className="font-mono font-bold text-blue-500">{d.candidate_a_score}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${d.candidate_a_score}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{d.candidate_a_rationale}</p>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-500 font-medium">{result.candidate_b_label}</span>
                        <span className="font-mono font-bold text-amber-500">{d.candidate_b_score}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${d.candidate_b_score}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{d.candidate_b_rationale}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Hiring Recommendation */}
          <Card className="surface-panel border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <Users className="size-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase text-primary">Hiring Recommendation</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{result.hiring_recommendation}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
