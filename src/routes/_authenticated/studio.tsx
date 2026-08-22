import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Wand2,
  Sparkles,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Search,
  Zap,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  requestBulletRewrite,
  requestExecutiveSummary,
  requestAtsScan,
} from "@/lib/studio.functions";
import type { BulletRewriteResult, AtsScanResult, SummaryGenerationResult } from "@/lib/studio.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [
      { title: "AI Resume Studio MatchScore" },
      {
        name: "description",
        content: "Live ATS bullet point transformer, keyword scanner, and executive summary generator.",
      },
      { property: "og:title", content: "AI Resume Studio MatchScore" },
      {
        property: "og:description",
        content: "Transform weak bullet points into high-impact ATS metric statements.",
      },
    ],
  }),
  component: ResumeStudioPage,
});

type Tone = "metrics" | "architect" | "leadership" | "executive";

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: "metrics", label: "Quantified Impact", desc: "Percentages, speedups, latency & revenue" },
  { id: "architect", label: "System Architect", desc: "Concurrency, scalability, Redis & microservices" },
  { id: "leadership", label: "Leadership & Sprint", desc: "Team velocity, mentorship & ownership" },
  { id: "executive", label: "Executive Value", desc: "Business ROI, cost reduction & high availability" },
];

function ResumeStudioPage() {
  // Tab 1: Bullet Transformer
  const [rawBullet, setRawBullet] = useState("Worked on backend APIs and improved database performance for users.");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [selectedTone, setSelectedTone] = useState<Tone>("metrics");
  const [rewriteResult, setRewriteResult] = useState<BulletRewriteResult | null>(null);

  // Tab 2: ATS Scanner
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [atsResult, setAtsResult] = useState<AtsScanResult | null>(null);

  // Tab 3: Summary Generator
  const [summaryRole, setSummaryRole] = useState("Senior Full Stack Engineer");
  const [experienceYears, setExperienceYears] = useState("6+");
  const [topSkills, setTopSkills] = useState("TypeScript, React, Node.js, Redis, PostgreSQL, AWS");
  const [summaryResult, setSummaryResult] = useState<SummaryGenerationResult | null>(null);

  const rewriteMutation = useMutation({
    mutationFn: async () => {
      return requestBulletRewrite({
        data: {
          rawBullet,
          tone: selectedTone,
          targetRole,
        },
      });
    },
    onSuccess: (data) => {
      setRewriteResult(data);
      toast.success("Generated 3 high-impact bullet variations!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const atsScanMutation = useMutation({
    mutationFn: async () => {
      if (!resumeText.trim() || !jobText.trim()) {
        throw new Error("Please provide both resume text and job description.");
      }
      return requestAtsScan({
        data: { resumeText, jobText },
      });
    },
    onSuccess: (data) => {
      setAtsResult(data);
      toast.success(`ATS Scan complete: ${data.match_percent}% keyword match!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const summaryMutation = useMutation({
    mutationFn: async () => {
      return requestExecutiveSummary({
        data: {
          targetRole: summaryRole,
          yearsExperience: experienceYears,
          topSkills,
        },
      });
    },
    onSuccess: (data) => {
      setSummaryResult(data);
      toast.success("ATS executive summary ready!");
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
          <Wand2 className="size-8 text-primary" />
          AI Resume Studio & Live ATS Bullet Builder
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Transform weak resume bullet points into quantified impact metrics, generate tailored executive summaries, and scan ATS keyword match density in real-time.
        </p>
      </div>

      <Tabs defaultValue="bullet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="bullet">Bullet Transformer</TabsTrigger>
          <TabsTrigger value="ats">Live ATS Scanner</TabsTrigger>
          <TabsTrigger value="summary">Summary Generator</TabsTrigger>
        </TabsList>

        {/* TAB 1: Bullet Point Transformer */}
        <TabsContent value="bullet" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader>
                <CardTitle className="text-lg">Input Your Bullet Point</CardTitle>
                <CardDescription>
                  Enter any basic or weak bullet point from your resume to enhance it with metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bullet-role" className="text-xs font-semibold">
                    Target Role
                  </Label>
                  <Input
                    id="bullet-role"
                    className="mt-1.5"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="raw-bullet" className="text-xs font-semibold">
                    Original Bullet Text
                  </Label>
                  <Textarea
                    id="raw-bullet"
                    rows={4}
                    className="mt-1.5"
                    value={rawBullet}
                    onChange={(e) => setRawBullet(e.target.value)}
                    placeholder="e.g. Worked on database queries and frontend UI components..."
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Select Power Tone</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTone(t.id)}
                        className={cn(
                          "rounded-lg border p-2.5 text-left transition-all text-xs",
                          selectedTone === t.id
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        <p className="font-semibold text-foreground">{t.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={rewriteMutation.isPending || !rawBullet.trim()}
                  onClick={() => rewriteMutation.mutate()}
                >
                  {rewriteMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="size-4 mr-2" />
                  )}
                  {rewriteMutation.isPending ? "Generating 3 Variations…" : "Transform Into High-Impact Bullets"}
                </Button>
              </CardContent>
            </Card>

            {/* Variations Output */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground flex items-center justify-between">
                <span>Transformed Variations</span>
                {rewriteResult ? (
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                    3 AI Variations Ready
                  </Badge>
                ) : null}
              </h2>

              {!rewriteResult ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  <Wand2 className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                  Click "Transform Into High-Impact Bullets" to generate 3 formula-backed variations with active action verbs and metrics.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {rewriteResult.variations.map((v, idx) => (
                    <Card key={idx} className="surface-panel border-primary/20 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="text-[11px] font-medium">
                            Option {idx + 1} · {v.action_verb}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => copyText(v.text)}
                          >
                            <Copy className="size-3" />
                            Copy
                          </Button>
                        </div>

                        <p className="text-sm font-medium text-foreground leading-relaxed">
                          "{v.text}"
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border">
                          <span className="text-[11px] text-muted-foreground mr-1">Metrics:</span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-500 border-emerald-500/30 font-mono">
                            {v.metric_focus}
                          </Badge>
                          {v.keywords_included.map((k) => (
                            <Badge key={k} variant="outline" className="text-[10px] bg-background">
                              {k}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Live ATS Keyword Scanner */}
        <TabsContent value="ats" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader>
                <CardTitle className="text-lg">Paste Resume & Job Text</CardTitle>
                <CardDescription>
                  Scan for missing keywords and formatting checks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ats-resume" className="text-xs font-semibold">
                    Resume Text
                  </Label>
                  <Textarea
                    id="ats-resume"
                    rows={6}
                    className="mt-1.5 text-xs font-mono"
                    placeholder="Paste resume content here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="ats-job" className="text-xs font-semibold">
                    Job Description Text
                  </Label>
                  <Textarea
                    id="ats-job"
                    rows={6}
                    className="mt-1.5 text-xs font-mono"
                    placeholder="Paste job posting requirements here..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={atsScanMutation.isPending || !resumeText.trim() || !jobText.trim()}
                  onClick={() => atsScanMutation.mutate()}
                >
                  {atsScanMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : (
                    <Search className="size-4 mr-2" />
                  )}
                  {atsScanMutation.isPending ? "Scanning ATS Keywords…" : "Run Live ATS Keyword Scan"}
                </Button>
              </CardContent>
            </Card>

            {/* ATS Scan Results */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">ATS Coverage & Heatmap</h2>

              {!atsResult ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  <Search className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                  Paste your resume and job description to see instant keyword coverage and formatting checks.
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="surface-panel border-primary/20 p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Keyword Match Density</span>
                      <span className="font-display text-3xl font-extrabold text-primary">
                        {atsResult.match_percent}%
                      </span>
                    </div>
                    <Progress value={atsResult.match_percent} className="mt-2" />
                  </Card>

                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-2">
                      <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" /> Matched Keywords ({atsResult.matched_keywords.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {atsResult.matched_keywords.map((k) => (
                          <Badge key={k} variant="outline" className="text-[10px] bg-background text-emerald-500 border-emerald-500/30">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 space-y-2">
                      <p className="font-semibold text-destructive flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" /> Missing Critical Keywords ({atsResult.missing_keywords.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {atsResult.missing_keywords.map((k) => (
                          <Badge key={k} variant="outline" className="text-[10px] bg-background text-destructive border-destructive/30">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Card className="surface-panel p-4 space-y-2.5">
                    <p className="text-xs font-semibold text-foreground">ATS Compliance Checks</p>
                    {atsResult.formatting_checklist.map((chk, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        {chk.passed ? (
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{chk.rule}</p>
                          <p className="text-[11px] text-muted-foreground">{chk.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: Summary Generator */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader>
                <CardTitle className="text-lg">Executive Summary Generator</CardTitle>
                <CardDescription>
                  Generate a punchy, ATS-tailored 3-line summary header for the top of your resume.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sum-role" className="text-xs font-semibold">
                    Target Role Title
                  </Label>
                  <Input
                    id="sum-role"
                    className="mt-1.5"
                    value={summaryRole}
                    onChange={(e) => setSummaryRole(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="sum-years" className="text-xs font-semibold">
                    Years of Experience
                  </Label>
                  <Input
                    id="sum-years"
                    className="mt-1.5"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="sum-skills" className="text-xs font-semibold">
                    Top 5-6 Technical Skills
                  </Label>
                  <Input
                    id="sum-skills"
                    className="mt-1.5"
                    value={topSkills}
                    onChange={(e) => setTopSkills(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={summaryMutation.isPending}
                  onClick={() => summaryMutation.mutate()}
                >
                  {summaryMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="size-4 mr-2" />
                  )}
                  {summaryMutation.isPending ? "Crafting Executive Summary…" : "Generate ATS Executive Summary"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">Generated Resume Header</h2>

              {!summaryResult ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  <FileEdit className="size-8 mx-auto text-muted-foreground/50 mb-3" />
                  Fill in your role and top skills to produce an executive summary.
                </div>
              ) : (
                <Card className="surface-panel border-primary/20 space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {summaryResult.word_count} words · Optimal Length
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs"
                      onClick={() => copyText(`${summaryResult.suggested_header}\n\n${summaryResult.summary}`)}
                    >
                      <Copy className="size-3.5" />
                      Copy Header & Summary
                    </Button>
                  </div>

                  <div className="rounded-lg bg-background p-3.5 border border-border space-y-1.5">
                    <span className="text-xs text-muted-foreground uppercase font-medium">Suggested Headline:</span>
                    <p className="text-sm font-bold text-foreground">{summaryResult.suggested_header}</p>
                  </div>

                  <div className="rounded-lg bg-primary/5 p-4 border border-primary/20 space-y-2">
                    <span className="text-xs text-primary uppercase font-bold">Executive Summary:</span>
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      "{summaryResult.summary}"
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
