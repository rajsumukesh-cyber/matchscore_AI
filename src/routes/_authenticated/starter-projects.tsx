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
  ExternalLink,
  Flame,
} from "lucide-react";
import { fetchStarterProjects } from "@/lib/starter-projects.functions";
import type { StarterProjectsResult } from "@/lib/starter-projects.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/starter-projects")({
  head: () => ({
    meta: [
      { title: "AI 48-Hour Zero Experience Starter Project Hub MatchScore" },
      {
        name: "description",
        content:
          "Build impressive, recruiter-approved portfolio projects in 48 hours with architectures, free hosting steps, and resume bullets.",
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
      toast.success("48-Hour starter project blueprints ready!");
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
          AI 48-Hour Starter Project Hub (Zero Experience to Recruiter-Ready)
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Don't have prior internships? Build high-impact, full-stack portfolio projects over a single
          weekend with verified architectures, free 1-click deployment on Render/Vercel, and resume bullets.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Preferred Language & Target Role</CardTitle>
          <CardDescription>
            Select your comfort stack to generate beginner-friendly but architecturally impressive projects.
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
            {generate.isPending ? "Generating 48-Hour Blueprints…" : "Generate 48-Hour Project Blueprints"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Projects Grid */}
          <div className="space-y-6">
            {result.projects.map((proj, i) => (
              <Card key={i} className="surface-panel p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold mb-1">
                      {proj.difficulty_level}
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground">{proj.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Free Hosting: {proj.architecture_components.free_deployment_platform}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{proj.short_summary}</p>

                {/* Architecture & Timeline */}
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5">
                    <strong className="text-primary block font-bold">🛠️ Full-Stack Architecture Components</strong>
                    <p><strong className="text-foreground">Frontend:</strong> {proj.architecture_components.frontend}</p>
                    <p><strong className="text-foreground">Backend:</strong> {proj.architecture_components.backend}</p>
                    <p><strong className="text-foreground">Database & Cache:</strong> {proj.architecture_components.database_and_cache}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-1.5">
                    <strong className="text-emerald-500 block font-bold">⏱️ 48-Hour Step-by-Step Schedule</strong>
                    <ul className="space-y-1 text-muted-foreground">
                      {proj.step_by_step_milestones.map((m, mi) => (
                        <li key={mi} className="flex items-start gap-1">
                          <span className="text-emerald-500 font-bold shrink-0">✦</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Resume Bullet Point & Loom Pitch */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-foreground">📄 Ready-to-Copy Resume Bullet Point</strong>
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
                Portfolio Review Checklist (What Hiring Managers Check)
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
