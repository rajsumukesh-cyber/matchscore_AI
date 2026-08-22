import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileCode,
  Loader2,
  Copy,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  ShieldCheck,
  FolderGit2,
} from "lucide-react";
import { fetchAcademicTranslation } from "@/lib/academic-translator.functions";
import type { AcademicTranslatorResult } from "@/lib/academic-translator.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/academic-translator")({
  head: () => ({
    meta: [
      { title: "AI Academic to Industry Resume Translator MatchScore" },
      {
        name: "description",
        content:
          "Convert college course assignments and lab projects into high-impact, industry-calibrated metric resume bullet points.",
      },
    ],
  }),
  component: AcademicTranslatorPage,
});

function AcademicTranslatorPage() {
  const [studentDegree, setStudentDegree] = useState("B.Tech / B.S. in Computer Science");
  const [targetRole, setTargetRole] = useState("Entry-Level Software Engineer");
  const [rawText, setRawText] = useState(
    "1. Created an online shopping website for my web development course using React and Node.\n2. Implemented sorting algorithms and binary trees in C++ for Data Structures assignment.\n3. Built a chat app using Python sockets for Computer Networks lab.\n4. Set up a database for a library management system using MySQL.",
  );
  const [result, setResult] = useState<AcademicTranslatorResult | null>(null);

  const translate = useMutation({
    mutationFn: () => {
      const lines = rawText
        .split("\n")
        .map((l) => l.replace(/^[0-9]+[.)]\s*/, "").trim())
        .filter(Boolean);

      return fetchAcademicTranslation({
        data: {
          studentDegree,
          targetRole,
          rawCourseworkBullets: lines,
        },
      });
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success("Academic coursework translated into industry bullets!");
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
          <FileCode className="size-8 text-primary" />
          AI Academic-to-Industry Resume Translator
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Don't let college lab assignments look amateur on your resume. Translate standard classroom
          coursework into enterprise-level metric statements with architectural keywords.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Course Projects & Lab Assignments</CardTitle>
          <CardDescription>
            Paste your raw academic project descriptions or course assignments (one per line).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Degree</Label>
              <Input className="mt-1.5" value={studentDegree} onChange={(e) => setStudentDegree(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Target Job Role</Label>
              <Input className="mt-1.5" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Raw Academic Bullets / Coursework</Label>
              <Textarea className="mt-1.5 min-h-[120px]" value={rawText} onChange={(e) => setRawText(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={translate.isPending} onClick={() => translate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {translate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {translate.isPending ? "Translating Coursework…" : "Translate to Industry Bullets"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Translated Bullets List */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-500" />
              Enterprise Industry Formatted Bullet Points
            </h2>

            <div className="space-y-4">
              {result.translated_bullets.map((b, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                      {b.impact_category}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => copyText(b.industry_rephrased)}>
                      <Copy className="size-3.5 mr-1" /> Copy Bullet
                    </Button>
                  </div>

                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-muted-foreground">
                    <strong className="text-red-500 block mb-0.5">Academic Original:</strong>
                    "{b.academic_original}"
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-foreground font-medium leading-relaxed">
                    <strong className="text-emerald-500 block mb-0.5">Industry Rephrased (Put on Resume):</strong>
                    {b.industry_rephrased}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {b.industry_keywords_added.map((kw, ki) => (
                      <Badge key={ki} variant="secondary" className="text-[10px]">
                        ✦ {kw}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* GitHub README Template */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderGit2 className="size-4 text-primary" />
                Industry Grade GitHub README Blueprint (Recruiter Ready)
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.github_readme_template)}>
                <Copy className="size-3.5 mr-1.5" /> Copy README.md
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-mono leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.github_readme_template}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
