import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileSignature,
  Loader2,
  Send,
  Copy,
  Linkedin,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { fetchCoverLetter, fetchColdOutreach } from "@/lib/cover-letter.functions";
import type { CoverLetterResult, ColdEmailResult } from "@/lib/cover-letter.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/cover-letter")({
  head: () => ({
    meta: [
      { title: "AI Cover Letter & Outreach Generator MatchScore" },
      {
        name: "description",
        content:
          "Generate recruiter-ready cover letters and cold networking emails tailored to any job posting.",
      },
    ],
  }),
  component: CoverLetterPage,
});

function CoverLetterPage() {
  const [tab, setTab] = useState("cover-letter");

  // Cover letter state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [years, setYears] = useState("");
  const [achievement, setAchievement] = useState("");
  const [tone, setTone] = useState<"professional" | "conversational" | "bold">("professional");
  const [clResult, setClResult] = useState<CoverLetterResult | null>(null);

  // Cold outreach state
  const [coName, setCoName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [coCompany, setCoCompany] = useState("");
  const [coRole, setCoRole] = useState("");
  const [sharedConn, setSharedConn] = useState("");
  const [coResult, setCoResult] = useState<ColdEmailResult | null>(null);

  const genCL = useMutation({
    mutationFn: () =>
      fetchCoverLetter({
        data: {
          candidateName: name,
          targetRole: role,
          companyName: company,
          topSkills: skills,
          yearsExperience: years,
          keyAchievement: achievement || null,
          tone,
        },
      }),
    onSuccess: (data) => {
      setClResult(data);
      toast.success("Cover letter generated!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const genCO = useMutation({
    mutationFn: () =>
      fetchColdOutreach({
        data: {
          candidateName: coName,
          recipientName,
          recipientTitle,
          companyName: coCompany,
          targetRole: coRole,
          sharedConnection: sharedConn || null,
        },
      }),
    onSuccess: (data) => {
      setCoResult(data);
      toast.success("Outreach templates generated!");
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
          <FileSignature className="size-8 text-primary" />
          AI Cover Letter & Cold Outreach Generator
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Generate personalized, recruiter-ready cover letters in 3 tones, plus cold email and
          LinkedIn networking templates tailored to any company and role.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
          <TabsTrigger value="cold-outreach">Cold Outreach</TabsTrigger>
        </TabsList>

        {/* ── Cover Letter Tab ── */}
        <TabsContent value="cover-letter" className="space-y-6 mt-4">
          <Card className="surface-panel border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Your Details</CardTitle>
              <CardDescription>Fill in your info and the target job to generate a tailored cover letter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold">Your Full Name</Label>
                  <Input className="mt-1.5" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Target Role</Label>
                  <Input className="mt-1.5" placeholder="Senior Full Stack Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Company Name</Label>
                  <Input className="mt-1.5" placeholder="Google" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Top Skills</Label>
                  <Input className="mt-1.5" placeholder="TypeScript, React, Node.js" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Years of Experience</Label>
                  <Input className="mt-1.5" type="number" min="0" max="30" placeholder="5" value={years} onChange={(e) => setYears(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Key Achievement (optional)</Label>
                  <Input className="mt-1.5" placeholder="Reduced API latency by 40%" value={achievement} onChange={(e) => setAchievement(e.target.value)} />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Writing Tone</Label>
                <div className="flex gap-2 flex-wrap">
                  {(["professional", "conversational", "bold"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={tone === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTone(t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button size="lg" disabled={genCL.isPending} onClick={() => genCL.mutate()}>
                {genCL.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
                {genCL.isPending ? "Generating…" : "Generate Cover Letter"}
              </Button>
            </CardContent>
          </Card>

          {clResult ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    {clResult.tone}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {clResult.word_count} words
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Personalization: {clResult.personalization_score}%
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyText(clResult.cover_letter)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy
                </Button>
              </div>

              <Card className="surface-panel">
                <CardContent className="p-5">
                  <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed text-foreground">
                    {clResult.cover_letter}
                  </pre>
                </CardContent>
              </Card>

              <Card className="surface-panel border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    Key Personalization Hooks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {clResult.key_hooks.map((h, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-primary">✦</span>{h}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* ── Cold Outreach Tab ── */}
        <TabsContent value="cold-outreach" className="space-y-6 mt-4">
          <Card className="surface-panel border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Outreach Details</CardTitle>
              <CardDescription>Enter the recipient's info to generate cold email and LinkedIn templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold">Your Name</Label>
                  <Input className="mt-1.5" placeholder="Alex Johnson" value={coName} onChange={(e) => setCoName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Recipient's Name</Label>
                  <Input className="mt-1.5" placeholder="Sarah Chen" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Recipient's Title</Label>
                  <Input className="mt-1.5" placeholder="Engineering Manager" value={recipientTitle} onChange={(e) => setRecipientTitle(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Company</Label>
                  <Input className="mt-1.5" placeholder="Stripe" value={coCompany} onChange={(e) => setCoCompany(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Target Role</Label>
                  <Input className="mt-1.5" placeholder="Senior Backend Engineer" value={coRole} onChange={(e) => setCoRole(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Shared Connection (optional)</Label>
                  <Input className="mt-1.5" placeholder="e.g. IIT Delhi alumni network" value={sharedConn} onChange={(e) => setSharedConn(e.target.value)} />
                </div>
              </div>

              <Button size="lg" disabled={genCO.isPending} onClick={() => genCO.mutate()}>
                {genCO.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                {genCO.isPending ? "Generating…" : "Generate Outreach Templates"}
              </Button>
            </CardContent>
          </Card>

          {coResult ? (
            <div className="space-y-5">
              {/* Email */}
              <Card className="surface-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="size-4 text-primary" /> Cold Email
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">{coResult.subject_line}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/50 p-3 rounded-md">
                    {coResult.email_body}
                  </pre>
                  <Button variant="outline" size="sm" onClick={() => copyText(coResult.email_body)}>
                    <Copy className="size-3 mr-1.5" /> Copy Email
                  </Button>
                </CardContent>
              </Card>

              {/* Follow-up */}
              <Card className="surface-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <RefreshCcw className="size-4 text-amber-500" /> Follow-up Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground bg-muted/50 p-3 rounded-md">
                    {coResult.follow_up_body}
                  </pre>
                  <Button variant="outline" size="sm" onClick={() => copyText(coResult.follow_up_body)}>
                    <Copy className="size-3 mr-1.5" /> Copy Follow-up
                  </Button>
                </CardContent>
              </Card>

              {/* LinkedIn */}
              <Card className="surface-panel border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-500">
                    <Linkedin className="size-4" /> LinkedIn Connection Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs bg-muted/50 p-3 rounded-md text-foreground leading-relaxed">{coResult.linkedin_message}</p>
                  <Button variant="outline" size="sm" onClick={() => copyText(coResult.linkedin_message)}>
                    <Copy className="size-3 mr-1.5" /> Copy Message
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="surface-panel border-primary/10 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase text-primary">Outreach Best Practices</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                      {coResult.tips.map((t, i) => (
                        <li key={i} className="flex gap-2"><span className="text-primary shrink-0">→</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
