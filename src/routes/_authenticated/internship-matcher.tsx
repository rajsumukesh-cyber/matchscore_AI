import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GraduationCap,
  Loader2,
  Copy,
  Sparkles,
  Briefcase,
  Mail,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
} from "lucide-react";
import { fetchStudentInternships } from "@/lib/internship-matcher.functions";
import type { InternshipMatcherResult } from "@/lib/internship-matcher.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InteractiveMindMap } from "@/components/mind-map";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/internship-matcher")({
  head: () => ({
    meta: [
      { title: "AI Student Internship Matcher & Outreach MatchScore" },
      {
        name: "description",
        content:
          "Match your student resume with Big Tech, Startup, and Open Source internships and generate founder cold emails.",
      },
    ],
  }),
  component: InternshipMatcherPage,
});

function InternshipMatcherPage() {
  const [studentName, setStudentName] = useState("Alex Sharma");
  const [degreeAndYear, setDegreeAndYear] = useState("B.Tech Computer Science (3rd Year)");
  const [currentSkills, setCurrentSkills] = useState("Python, JavaScript, React, Node.js, PostgreSQL, Git");
  const [targetDomain, setTargetDomain] = useState("Full Stack Web & Cloud Software Engineering");
  const [result, setResult] = useState<InternshipMatcherResult | null>(null);

  const match = useMutation({
    mutationFn: () =>
      fetchStudentInternships({
        data: {
          studentName,
          degreeAndYear,
          currentSkills,
          targetDomain,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Internship matches & outreach ready!");
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
          <GraduationCap className="size-8 text-primary" />
          AI Student Internship Matcher & Cold Outreach Engine
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Designed specifically for college and university students. Match your academic background with
          tier-specific internship tracks and generate founder-tested cold outreach emails.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Student Profile & Ambitions</CardTitle>
          <CardDescription>
            Enter your degree, graduation timeline, and current coding stack.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Full Name</Label>
              <Input className="mt-1.5" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Degree & Year of Study</Label>
              <Input className="mt-1.5" value={degreeAndYear} onChange={(e) => setDegreeAndYear(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Languages & Frameworks You Know</Label>
              <Input className="mt-1.5" value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Engineering Track</Label>
              <Input className="mt-1.5" value={targetDomain} onChange={(e) => setTargetDomain(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={match.isPending} onClick={() => match.mutate()} className="signal-gradient text-primary-foreground border-0">
            {match.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Briefcase className="size-4 mr-2" />}
            {match.isPending ? "Matching Internships…" : "Match Internships & Generate Outreach"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Visual Student Internship Outreach Mind Map */}
          <InteractiveMindMap
            rootTitle="Student Internship Strategy & Conversion Mind Map"
            rootSubtitle="A comprehensive breakdown of Big Tech formal pathways, fast-track startup outreach, open-source fellowships, and cold email conversion mechanics."
            rootBadge="Internship Mind Map"
            nodes={[
              {
                id: "big-tech",
                label: "Tier 1 Big Tech Programs",
                icon: "🏢",
                color: "primary",
                badge: "Formal Season",
                description: "Structured university hiring pipelines with strict online assessment deadlines.",
                children: [
                  { id: "bt-1", label: "Google STEP & Microsoft Explore (Year 1-2)" },
                  { id: "bt-2", label: "Amazon Summer SDE Intern (Blind 75 OA focus)" },
                  { id: "bt-3", label: "Apply in August - October for next summer" },
                ],
              },
              {
                id: "high-growth",
                label: "YC & VC-Backed Startups",
                icon: "🚀",
                color: "emerald",
                badge: "Fast Track",
                description: "Direct engineering hiring without algorithmic OA filters; focuses 100% on shipped code.",
                children: [
                  { id: "st-1", label: "WorkAtAStartup / AngelList Job Board" },
                  { id: "st-2", label: "Founder / CTO Direct Inbound on Twitter & LinkedIn" },
                  { id: "st-3", label: "Attach Live Deployed Project Links" },
                ],
              },
              {
                id: "fellowships",
                label: "Open Source Fellowships",
                icon: "🌍",
                color: "cyan",
                badge: "Global Stipend",
                description: "Prestigious global stipends for contributing to open-source foundation repositories.",
                children: [
                  { id: "fs-1", label: "Google Summer of Code (GSoC) - $3,000+ Stipend" },
                  { id: "fs-2", label: "MLH Fellowship & LFX Mentorship" },
                  { id: "fs-3", label: "Proposal Drafting in February - March" },
                ],
              },
              {
                id: "outreach-rules",
                label: "Cold Outreach Conversion",
                icon: "📨",
                color: "amber",
                badge: "Inbound Engine",
                description: "High-response outreach habits that secure interview callbacks in 48 hours.",
                children: [
                  { id: "or-1", label: "Keep cold emails under 100 words" },
                  { id: "or-2", label: "Mention 1 specific company feature you tested" },
                  { id: "or-3", label: "Follow up once after 4 business days" },
                ],
              },
            ]}
          />

          {/* Tier Matches Grid */}
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Tailored Internship Tier Opportunities
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {result.tier_matches.map((tier, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                        {tier.match_fit_percentage}% Fit
                      </Badge>
                      <Progress value={tier.match_fit_percentage} className="w-16 h-1.5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{tier.tier_name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{tier.what_they_look_for}"
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <p className="text-[11px] font-bold text-foreground uppercase">Top Programs</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {tier.recommended_programs.map((prog, pi) => (
                          <li key={pi} className="flex items-start gap-1.5">
                            <span className="text-primary font-bold shrink-0">✦</span>
                            <span>{prog}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground mt-2">
                    <strong className="text-foreground block mb-0.5">Your Edge:</strong>
                    {tier.student_edge_strategy}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Founder Cold Outreach Template */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Founder & Lead Engineer Cold Inbound Email
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.founder_cold_email)}>
                <Copy className="size-3.5 mr-1.5" /> Copy Email
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.founder_cold_email}
              </pre>
            </CardContent>
          </Card>

          {/* Recruiter Pitch & Student Hacks */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="surface-panel">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Linkedin className="size-4 text-blue-500" />
                  Recruiter LinkedIn InMail Script
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyText(result.recruiter_linkedin_pitch)}>
                  <Copy className="size-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg">
                  {result.recruiter_linkedin_pitch}
                </p>
              </CardContent>
            </Card>

            <Card className="surface-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Student Resume Hacks (Skip Past the ATS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {result.student_resume_hacks.map((hack, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✦</span>
                      <span>{hack}</span>
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
