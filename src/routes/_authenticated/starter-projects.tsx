import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FolderKanban,
  Loader2,
  Copy,
  Sparkles,
  Layers,
  Code2,
  Video,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCode,
  Flame,
  Lightbulb,
} from "lucide-react";
import { fetchStarterProjects } from "@/lib/starter-projects.functions";
import type { StarterProjectsResult } from "@/lib/starter-projects.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/starter-projects")({
  head: () => ({
    meta: [
      { title: "AI 48-Hour Zero Experience Starter Project Hub MatchScore" },
      {
        name: "description",
        content:
          "Build impressive, recruiter-approved portfolio projects in 48 hours with step-by-step code roadmaps, starter templates, and free hosting guides.",
      },
    ],
  }),
  component: StarterProjectsPage,
});

function StarterProjectsPage() {
  const [languageOrFramework, setLanguageOrFramework] = useState<"Python & FastAPI" | "JavaScript / React / Node.js" | "Java & Spring Boot" | "Go & Microservices">("JavaScript / React / Node.js");
  const [targetRole, setTargetRole] = useState("Full Stack Software Engineer");
  const [result, setResult] = useState<StarterProjectsResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchStarterProjects({
        data: {
          languageOrFramework,
          targetRole,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("48-Hour starter project blueprints & code templates ready!");
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
          <FolderKanban className="size-8 text-primary" />
          AI 48-Hour Starter Projects & Step-by-Step Code Roadmaps
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Zero prior experience? No problem. Follow an exact hour-by-hour roadmap, copy verified starter
          code templates, avoid common beginner bugs, and deploy live full-stack projects in 48 hours.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Choose Your Preferred Language</CardTitle>
          <CardDescription>
            Select your comfort tech stack to generate tailored architecture blueprints and starter code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold">Primary Coding Stack</Label>
            <div className="mt-1.5">
              <Tabs value={languageOrFramework} onValueChange={(v) => setLanguageOrFramework(v as any)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="JavaScript / React / Node.js">React & Node</TabsTrigger>
                  <TabsTrigger value="Python & FastAPI">Python & AI</TabsTrigger>
                  <TabsTrigger value="Java & Spring Boot">Java Spring</TabsTrigger>
                  <TabsTrigger value="Go & Microservices">Go Microservices</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Target Job Role</Label>
            <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Flame className="size-4 mr-2" />}
            {generate.isPending ? "Building Roadmaps & Code…" : "Generate Step-by-Step Project Roadmaps"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-8">
          {/* Zero to Hero Golden Rules */}
          <Card className="surface-panel p-5 border-2 border-primary/30 bg-primary/5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
              <Lightbulb className="size-5 text-primary" />
              Golden Rules for Below-Average Students to Stand Out
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {result.zero_to_hero_rules.map((rule, ri) => (
                <div key={ri} className="p-3 rounded-lg bg-background/80 border border-border text-xs text-muted-foreground leading-relaxed">
                  {rule}
                </div>
              ))}
            </div>
          </Card>

          {/* Projects with Hour-by-Hour Roadmaps & Code */}
          <div className="space-y-8">
            {result.projects.map((proj, i) => (
              <Card key={i} className="surface-panel p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                  <div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold mb-1">
                      {proj.difficulty_level}
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground">{proj.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Free Hosting: {proj.architecture_components.free_deployment_platform}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{proj.short_summary}</p>

                {/* Architecture Specs */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border grid gap-2 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-semibold">Frontend Layer</span>
                    <strong className="text-foreground">{proj.architecture_components.frontend}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-semibold">Backend API</span>
                    <strong className="text-foreground">{proj.architecture_components.backend}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] font-semibold">Database & Cache</span>
                    <strong className="text-foreground">{proj.architecture_components.database_and_cache}</strong>
                  </div>
                </div>

                {/* Hour-by-Hour Guided Roadmap */}
                <div className="space-y-3">
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="size-4 text-emerald-500" />
                    48-Hour Step-by-Step Implementation Roadmap
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {proj.hour_by_hour_roadmap.map((block, bi) => (
                      <div key={bi} className="p-4 rounded-xl bg-muted/20 border border-border space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-primary uppercase">{block.time_window}</span>
                            <Badge variant="outline" className="text-[10px]">Phase {bi + 1}</Badge>
                          </div>
                          <strong className="text-xs font-bold text-foreground block">{block.milestone_title}</strong>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {block.tasks_to_complete.map((t, ti) => (
                              <li key={ti} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 font-bold shrink-0">✦</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 mt-2">
                          <strong>⚠️ Beginner Warning:</strong> {block.beginner_pitfall_and_fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Starter Code Templates */}
                {proj.starter_code_templates && proj.starter_code_templates.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Code2 className="size-4 text-primary" />
                      Starter Code Templates (Copy & Run)
                    </h4>

                    <div className="space-y-3">
                      {proj.starter_code_templates.map((tpl, ti) => (
                        <div key={ti} className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border text-xs">
                            <span className="font-mono font-bold text-primary flex items-center gap-1.5">
                              <FileCode className="size-3.5" /> {tpl.filename}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => copyText(tpl.code_content)}>
                              <Copy className="size-3 mr-1" /> Copy Code
                            </Button>
                          </div>
                          <pre className="p-4 text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed overflow-x-auto">
                            {tpl.code_content}
                          </pre>
                          <div className="p-2.5 bg-muted/40 border-t border-border text-[11px] text-muted-foreground italic">
                            💡 {tpl.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Resume Bullet & Loom Pitch */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-foreground">📄 Ready-to-Paste Resume Bullet</strong>
                    <Button variant="ghost" size="sm" onClick={() => copyText(proj.resume_bullet_point)}>
                      <Copy className="size-3.5 mr-1" /> Copy Bullet
                    </Button>
                  </div>
                  <p className="text-xs text-foreground font-medium italic">"{proj.resume_bullet_point}"</p>

                  <div className="pt-2 border-t border-primary/10 text-[11px] text-muted-foreground">
                    <strong className="text-foreground flex items-center gap-1 mb-0.5">
                      <Video className="size-3 text-primary" /> 45-Second Loom / YouTube Demo Pitch Script:
                    </strong>
                    {proj.demo_video_talking_script}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Deployment Checklist */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Portfolio Review Checklist (What Tech Recruiters Look For)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.portfolio_deployment_checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✦</span>
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
