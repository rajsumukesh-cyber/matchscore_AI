import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mic2,
  Loader2,
  Copy,
  Sparkles,
  Award,
  Radio,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { fetchSpeakerPitches } from "@/lib/speaker-pitch.functions";
import type { SpeakerPitchResult } from "@/lib/speaker-pitch.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/speaker-pitch")({
  head: () => ({
    meta: [
      { title: "AI Executive Bio & Keynote Speaker Pitch MatchScore" },
      {
        name: "description",
        content:
          "Generate executive bios in 3 lengths and conference keynote CFP proposals to build public authority.",
      },
    ],
  }),
  component: SpeakerPitchPage,
});

function SpeakerPitchPage() {
  const [candidateName, setCandidateName] = useState("Alex Johnson");
  const [currentRole, setCurrentRole] = useState("Staff Software Engineer");
  const [primaryExpertise, setPrimaryExpertise] = useState("Distributed Systems, LLM Agent Pipelines & Cloud Scale");
  const [flagshipProject, setFlagshipProject] = useState("scaling zero-downtime microservices to 10M+ daily active users");
  const [result, setResult] = useState<SpeakerPitchResult | null>(null);

  const generate = useMutation({
    mutationFn: () =>
      fetchSpeakerPitches({
        data: {
          candidateName,
          currentRole,
          primaryExpertise,
          flagshipProject,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Executive bios & keynote proposals generated!");
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
          <Mic2 className="size-8 text-primary" />
          AI Executive Bio & Keynote Speaker Pitch Studio
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Build instant public technical authority. Generate executive bios across 3 lengths (50, 100,
          and 250 words) and high-acceptance conference & podcast Call for Papers (CFP) proposals.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Technical Authority Profile</CardTitle>
          <CardDescription>
            Enter your domain expertise and flagship accomplishments to tailor executive copy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold">Your Full Name</Label>
              <Input className="mt-1.5" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-semibold">Your Professional Title</Label>
              <Input className="mt-1.5" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Primary Domain Expertise</Label>
              <Input className="mt-1.5" value={primaryExpertise} onChange={(e) => setPrimaryExpertise(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold">Flagship Project / War Story</Label>
              <Input className="mt-1.5" value={flagshipProject} onChange={(e) => setFlagshipProject(e.target.value)} />
            </div>
          </div>

          <Button size="lg" disabled={generate.isPending} onClick={() => generate.mutate()} className="signal-gradient text-primary-foreground border-0">
            {generate.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            {generate.isPending ? "Drafting Authority Assets…" : "Generate Bios & Keynote Pitches"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          {/* Executive Bios Tabs */}
          <Card className="surface-panel p-5 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Executive Bios (3 Format Lengths)
            </h2>

            <Tabs defaultValue="short" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="short">Short (50 Words)</TabsTrigger>
                <TabsTrigger value="medium">Medium (100 Words)</TabsTrigger>
                <TabsTrigger value="long">Long (250 Words)</TabsTrigger>
              </TabsList>

              <TabsContent value="short" className="mt-4 space-y-3">
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs leading-relaxed text-foreground">
                  {result.bios.short_50_words}
                </div>
                <Button variant="outline" size="sm" onClick={() => copyText(result.bios.short_50_words)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy 50-Word Bio
                </Button>
              </TabsContent>

              <TabsContent value="medium" className="mt-4 space-y-3">
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs leading-relaxed text-foreground">
                  {result.bios.medium_100_words}
                </div>
                <Button variant="outline" size="sm" onClick={() => copyText(result.bios.medium_100_words)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy 100-Word Bio
                </Button>
              </TabsContent>

              <TabsContent value="long" className="mt-4 space-y-3">
                <pre className="p-4 rounded-xl bg-muted/30 border border-border text-xs font-sans whitespace-pre-wrap leading-relaxed text-foreground">
                  {result.bios.long_250_words}
                </pre>
                <Button variant="outline" size="sm" onClick={() => copyText(result.bios.long_250_words)}>
                  <Copy className="size-3.5 mr-1.5" /> Copy 250-Word Bio
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Keynote CFP Proposals */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Radio className="size-5 text-primary" />
              Conference & Podcast Keynote Proposals (CFPs)
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {result.keynote_proposals.map((k, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Audience: {k.target_audience}
                    </Badge>
                    <h3 className="text-base font-bold text-foreground">{k.talk_title}</h3>
                    <p className="text-xs font-semibold text-muted-foreground">{k.catchy_subtitle}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{k.abstract}</p>

                    <div className="space-y-1 pt-2 border-t border-border">
                      <p className="text-[11px] font-bold text-foreground uppercase">Key Audience Takeaways</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {k.key_takeaways.map((t, ti) => (
                          <li key={ti} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">✦</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => copyText(`TITLE: ${k.talk_title}\n\nABSTRACT:\n${k.abstract}\n\nTAKEAWAYS:\n${k.key_takeaways.join("\n")}`)} className="w-full mt-2">
                    <Copy className="size-3.5 mr-1.5" /> Copy Keynote Pitch
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
