import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Linkedin,
  Loader2,
  Copy,
  Sparkles,
  CheckCircle2,
  Search,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { fetchLinkedInOptimization } from "@/lib/linkedin-optimizer.functions";
import type { LinkedInOptimizationResult } from "@/lib/linkedin-optimizer.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/linkedin-optimizer")({
  head: () => ({
    meta: [
      { title: "AI LinkedIn Profile Optimizer MatchScore" },
      {
        name: "description",
        content:
          "Generate recruiter-optimized LinkedIn headlines, storytelling About sections, and search keyword tags.",
      },
    ],
  }),
  component: LinkedInOptimizerPage,
});

function LinkedInOptimizerPage() {
  const [candidateName, setCandidateName] = useState("Alex Johnson");
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [currentSkills, setCurrentSkills] = useState("TypeScript, React, Node.js, Distributed Systems, AWS");
  const [yearsExperience, setYearsExperience] = useState("5+");
  const [keyAchievements, setKeyAchievements] = useState("scaled backend services to 15,000 RPS and reduced cloud spend by 35%");
  const [result, setResult] = useState<LinkedInOptimizationResult | null>(null);

  const optimize = useMutation({
    mutationFn: () =>
      fetchLinkedInOptimization({
        data: {
          candidateName,
          targetRole,
          currentSkills,
          yearsExperience,
          keyAchievements,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("LinkedIn profile optimized!");
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
          <Linkedin className="size-8 text-blue-500" />
          AI LinkedIn Profile & Headline Studio
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Transform your LinkedIn profile into a recruiter magnet with high-converting headlines,
          storytelling About sections, and Boolean search keyword optimization.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Profile Details</CardTitle>
          <CardDescription>
            Enter your professional background to generate tailored LinkedIn assets.
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
              <Label className="text-xs font-semibold">Top Skills (comma-separated)</Label>
              <Input className="mt-1.5" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Years of Experience</Label>
              <Input className="mt-1.5" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Key Quantified Achievement</Label>
              <Input className="mt-1.5" value={keyAchievements} onChange={(e) => setKeyAchievements(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={optimize.isPending} onClick={() => optimize.mutate()} className="signal-gradient text-primary-foreground border-0">
            {optimize.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {optimize.isPending ? "Optimizing Profile…" : "Optimize LinkedIn Profile"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Headlines */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              3 High-Converting Headline Options
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {result.headlines.map((h) => (
                <Card key={h.style} className="surface-panel flex flex-col justify-between p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">{h.style}</Badge>
                      <span className="text-[10px] text-muted-foreground">{h.character_count} chars</span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-foreground leading-relaxed">{h.headline}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{h.best_for}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyText(h.headline)} className="w-full">
                    <Copy className="size-3.5 mr-1.5" /> Copy Headline
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* About Section */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Optimized "About" Section
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.about_section)}>
                <Copy className="size-3.5 mr-1.5" /> Copy About Text
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-foreground bg-muted/30 p-4 rounded-xl">
                {result.about_section}
              </pre>
            </CardContent>
          </Card>

          {/* Recruiter Keywords & Post Prompts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="size-4 text-blue-500" />
                  Recruiter Boolean Search Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.recruiter_keywords.map((kw) => (
                    <Badge key={kw} variant="secondary" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="size-4 text-emerald-500" />
                  Thought-Leadership Post Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.post_prompts.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✦</span>
                      <span>{p}</span>
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
