import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MapPin,
  Loader2,
  Sparkles,
  Award,
  Code2,
  Terminal,
  Trophy,
  Gift,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  Flame,
} from "lucide-react";
import { fetchStudentRoadmap } from "@/lib/student-roadmap.functions";
import type { StudentRoadmapResult } from "@/lib/student-roadmap.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveMindMap } from "@/components/mind-map";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/student-roadmap")({
  head: () => ({
    meta: [
      { title: "AI Semester Career Roadmap & Zero-to-Hero Guide MatchScore" },
      {
        name: "description",
        content:
          "Generate personalized semester milestone roadmaps and a 6-month zero-to-hero placement survival guide for below-average students.",
      },
    ],
  }),
  component: StudentRoadmapPage,
});

function StudentRoadmapPage() {
  const [currentYearOrSemester, setCurrentYearOrSemester] = useState("2nd Year (Semester 3-4)");
  const [targetRole, setTargetRole] = useState("Full Stack & Cloud Software Engineer");
  const [preferredTrack, setPreferredTrack] = useState<"Full Stack Web" | "AI & Machine Learning" | "Cloud & DevOps" | "Data Engineering">("Full Stack Web");
  const [result, setResult] = useState<StudentRoadmapResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchStudentRoadmap({
        data: {
          currentYearOrSemester,
          targetRole,
          preferredTrack,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Semester career roadmap & Zero-to-Hero plan generated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <MapPin className="size-8 text-primary" />
          AI Semester Career Roadmap & Zero-to-Hero Survival Guide
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Whether you have a 4-year degree timeline or only 6 months to get placement-ready from scratch:
          follow structured DSA targets, core CS milestones, winning hackathons, and free student perks.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your College Status & Career Goal</CardTitle>
          <CardDescription>
            Input your current semester and desired specialization to generate your customized roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Current Semester / Year</Label>
              <Input className="mt-1.5" value={currentYearOrSemester} onChange={(e) => setCurrentYearOrSemester(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Engineering Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Preferred Track</Label>
              <div className="mt-1.5">
                <Tabs value={preferredTrack} onValueChange={(v) => setPreferredTrack(v as any)}>
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="Full Stack Web">Full Stack</TabsTrigger>
                    <TabsTrigger value="AI & Machine Learning">AI / ML</TabsTrigger>
                    <TabsTrigger value="Cloud & DevOps">Cloud / DevOps</TabsTrigger>
                    <TabsTrigger value="Data Engineering">Data Eng</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <MapPin className="size-4 mr-2" />}
            {generate.isPending ? "Generating Roadmap…" : "Generate Semester & 6-Month Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-8">
          {/* Visual Career & Engineering Mind Map */}
          <InteractiveMindMap
            rootTitle="Computer Science Career & Skills Mind Map"
            rootSubtitle="A high-level visual branch overview connecting foundational DSA, core computer systems, full-stack development, and interview placement milestones."
            rootBadge="Interactive Mind Map"
            nodes={[
              {
                id: "dsa",
                label: "Data Structures & Algorithms",
                icon: "⚡",
                color: "emerald",
                badge: "Core Logic",
                description: "Master computational problem-solving patterns from basic arrays to complex dynamic programming.",
                children: [
                  { id: "dsa-1", label: "Arrays, Two Pointers & Hash Maps (Blind 75)" },
                  { id: "dsa-2", label: "Binary Search, Stacks & Linked Lists" },
                  { id: "dsa-3", label: "Binary Trees, BFS / DFS & Graphs" },
                  { id: "dsa-4", label: "Dynamic Programming & Recursion" },
                ],
              },
              {
                id: "systems",
                label: "Core Computer Systems",
                icon: "🖥️",
                color: "cyan",
                badge: "System Core",
                description: "Fundamental computer science theory asked in technical rounds at Tier-1 companies.",
                children: [
                  { id: "sys-1", label: "Database Management (SQL, Indexes, ACID)" },
                  { id: "sys-2", label: "Operating Systems (Threads, Deadlocks, Virtual Memory)" },
                  { id: "sys-3", label: "Computer Networks (TCP/IP, HTTP/3, WebSockets)" },
                  { id: "sys-4", label: "Low-Level Design (SOLID & Design Patterns)" },
                ],
              },
              {
                id: "fullstack",
                label: "Full Stack & Cloud Architecture",
                icon: "🛠️",
                color: "primary",
                badge: "Proof of Work",
                description: "Ship full-stack enterprise web applications with databases and live cloud hosting.",
                children: [
                  { id: "fs-1", label: "Modern Frontend (React, SSR, Tailwind)" },
                  { id: "fs-2", label: "Backend APIs (Node.js Express / Python FastAPI)" },
                  { id: "fs-3", label: "Database & Cache (PostgreSQL + Redis)" },
                  { id: "fs-4", label: "Docker, CI/CD & Free Deployment (Render/Vercel)" },
                ],
              },
              {
                id: "placement",
                label: "Placement & Interview Mastery",
                icon: "🎯",
                color: "amber",
                badge: "Placement Drive",
                description: "Turn technical mastery into high-paying job offers with structured communication.",
                children: [
                  { id: "pl-1", label: "Behavioral STAR Stories & Leadership Answers" },
                  { id: "pl-2", label: "Placement Aptitude & Fast-Math Shortcuts" },
                  { id: "pl-3", label: "Cold Email Outreach to Startup Founders" },
                  { id: "pl-4", label: "Offer Evaluation & Salary Negotiation" },
                ],
              },
            ]}
          />

          {/* Main Tabs: 4-Year Semester Timeline vs 6-Month Zero-to-Hero Intensive */}
          <Tabs defaultValue="zero-to-hero" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
              <TabsTrigger value="zero-to-hero" className="flex items-center gap-1.5">
                <Flame className="size-4 text-amber-500" />
                6-Month Zero-to-Hero Intensive
              </TabsTrigger>
              <TabsTrigger value="semesters" className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                4-Year Semester Roadmap
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: 6-Month Zero-to-Hero Intensive Plan */}
            <TabsContent value="zero-to-hero" className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <strong>🔥 The Zero-to-Hero Blueprint:</strong> Designed for students starting late, with low CGPA or zero coding background. Spend 1.5 to 2 hours daily following this month-by-month routine to become job-ready in 180 days.
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.zero_to_hero_intensive_plan.map((m, mi) => (
                  <Card key={mi} className="surface-panel p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-500 font-bold">
                          Month {m.month_number}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-semibold">Stage {mi + 1}/6</span>
                      </div>

                      <h3 className="text-sm font-bold text-foreground">{m.month_title}</h3>

                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-xs space-y-1">
                        <strong className="text-primary block text-[11px]">⏰ Daily Routine:</strong>
                        <p className="text-muted-foreground">{m.weekly_routine}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                        <strong className="text-emerald-500 block text-[11px]">🎯 DSA Target:</strong>
                        <p className="text-foreground">{m.dsa_leetcode_target}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs space-y-1">
                        <strong className="text-blue-500 block text-[11px]">🛠️ Project & System Goal:</strong>
                        <p className="text-foreground">{m.project_and_system_goal}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border text-[11px] text-muted-foreground italic">
                      💡 <strong>Consistency Tip:</strong> {m.how_to_stay_consistent}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab 2: 4-Year Semester Roadmap */}
            <TabsContent value="semesters" className="space-y-4">
              {result.semesters.map((sem, i) => (
                <Card key={i} className="surface-panel p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="text-xs font-bold text-primary uppercase">{sem.semester_range}</span>
                      <h3 className="text-base font-bold text-foreground">{sem.phase_name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Focus: {sem.focus_area}
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 text-xs">
                    {/* DSA Column */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2">
                      <strong className="text-emerald-500 flex items-center gap-1.5 font-bold">
                        <Code2 className="size-4" /> DSA & Problem Solving
                      </strong>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {sem.dsa_milestones.map((d, di) => (
                          <li key={di} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">✦</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Systems & Core CS */}
                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2">
                      <strong className="text-blue-500 flex items-center gap-1.5 font-bold">
                        <Terminal className="size-4" /> Systems & Core CS
                      </strong>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {sem.system_core_topics.map((s, si) => (
                          <li key={si} className="flex items-start gap-1.5">
                            <span className="text-blue-500 font-bold shrink-0">✦</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hackathon Project Idea */}
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                      <strong className="text-primary flex items-center gap-1.5 font-bold">
                        <Trophy className="size-4" /> Hackathon Project Blueprint
                      </strong>
                      <p className="font-bold text-foreground">{sem.recommended_hackathon_project.project_title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        <strong className="text-foreground">Stack:</strong> {sem.recommended_hackathon_project.architecture_stack}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        <strong className="text-foreground">To Win:</strong> {sem.recommended_hackathon_project.killer_feature_to_win}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Student Developer Pack Checklist */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="size-4 text-primary" />
                Free Student Developer Pack Checklist (Worth $5,000+)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.free_student_developer_pack_checklist.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{item.benefit}</span>
                      <Badge variant="outline" className="text-[10px]">{item.provider}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.how_to_claim}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
