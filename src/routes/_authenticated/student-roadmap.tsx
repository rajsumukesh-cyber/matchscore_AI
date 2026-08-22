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
  FileCode,
} from "lucide-react";
import { fetchStudentRoadmap } from "@/lib/student-roadmap.functions";
import type { StudentRoadmapResult } from "@/lib/student-roadmap.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/student-roadmap")({
  head: () => ({
    meta: [
      { title: "AI Semester Career Roadmap & Hackathon Prep MatchScore" },
      {
        name: "description",
        content:
          "Generate a personalized semester-by-semester career milestone roadmap, hackathon project ideas, and student developer pack benefits.",
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
      toast.success("Semester career roadmap generated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <MapPin className="size-8 text-primary" />
          AI Semester-by-Semester Career Roadmap & Hackathon Hub
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          A step-by-step engineering curriculum mapped across your college semesters. Get concrete
          DSA targets, core CS milestones, award-winning hackathon blueprints, and free developer perks.
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
            {generate.isPending ? "Generating Roadmap…" : "Generate Semester-by-Semester Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* 4 Phases Timeline */}
          <div className="space-y-4">
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
          </div>

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
