import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GitPullRequest,
  Loader2,
  Copy,
  Sparkles,
  Github,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  Terminal,
  BookOpen,
} from "lucide-react";
import { fetchOpenSourceContributions } from "@/lib/open-source.functions";
import type { OpenSourceResult } from "@/lib/open-source.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveMindMap } from "@/components/mind-map";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/open-source")({
  head: () => ({
    meta: [
      { title: "AI Open Source Contribution & First PR Finder MatchScore" },
      {
        name: "description",
        content:
          "Find beginner-friendly open-source repositories on GitHub and follow a step-by-step Git PR workflow.",
      },
    ],
  }),
  component: OpenSourcePage,
});

function OpenSourcePage() {
  const [primaryLanguage, setPrimaryLanguage] = useState<"JavaScript / TypeScript" | "Python" | "Go / Rust" | "Java / C++">("JavaScript / TypeScript");
  const [studentInterests, setStudentInterests] = useState("Web Development, Developer Tools, AI Frameworks");
  const [result, setResult] = useState<OpenSourceResult | null>(null);

  const findRepos = useMutation({
    mutationFn: () =>
      fetchOpenSourceContributions({
        data: {
          primaryLanguage,
          studentInterests,
        },
      }),
    onSuccess: (data) => {
      setResult(data);
      toast.success("Open-source contribution roadmap ready!");
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
          <GitPullRequest className="size-8 text-primary" />
          AI Open Source Contribution & First PR Finder
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
          Get your first merged Pull Request on major open-source repositories. Discover 'Good First Issues',
          master clean Git branching etiquette, and build verifiable public engineering credentials.
        </p>
      </div>

      <Card className="surface-panel border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Open-Source Track</CardTitle>
          <CardDescription>
            Select your language and area of interest to discover active beginner-friendly repositories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-semibold">Primary Coding Language</Label>
            <div className="mt-1.5">
              <Tabs value={primaryLanguage} onValueChange={(v) => setPrimaryLanguage(v as any)}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="JavaScript / TypeScript">JS / TypeScript</TabsTrigger>
                  <TabsTrigger value="Python">Python</TabsTrigger>
                  <TabsTrigger value="Go / Rust">Go & Rust</TabsTrigger>
                  <TabsTrigger value="Java / C++">Java & C++</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Your Interests (AI, Web, DevTools, Infrastructure)</Label>
            <Input className="mt-1.5" value={studentInterests} onChange={(e) => setStudentInterests(e.target.value)} />
          </div>

          <Button size="lg" disabled={findRepos.isPending} onClick={() => findRepos.mutate()} className="signal-gradient text-primary-foreground border-0">
            {findRepos.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Github className="size-4 mr-2" />}
            {findRepos.isPending ? "Finding Repositories…" : "Find Repositories & First PR Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-8">
          {/* Visual Open Source PR Journey Mind Map */}
          <InteractiveMindMap
            rootTitle="Open-Source GitHub Contribution Mind Map"
            rootSubtitle="A visual step-by-step branch roadmap showing how to discover beginner issues, set up local Git workflows, write verified tests, and get your PR merged."
            rootBadge="Open Source Mind Map"
            nodes={[
              {
                id: "discovery",
                label: "Issue Discovery & Triage",
                icon: "🔎",
                color: "primary",
                badge: "Discovery",
                description: "Find active, beginner-friendly issues in high-profile open-source repositories.",
                children: [
                  { id: "disc-1", label: "Filter by 'good first issue' / 'help wanted'" },
                  { id: "disc-2", label: "Read CONTRIBUTING.md & Code of Conduct" },
                  { id: "disc-3", label: "Comment on issue to claim assignment" },
                ],
              },
              {
                id: "git-fork",
                label: "Git Fork & Feature Branching",
                icon: "🌿",
                color: "emerald",
                badge: "Git Flow",
                description: "Maintain a clean, sync-friendly local git repository structure.",
                children: [
                  { id: "gf-1", label: "Fork repository to personal GitHub profile" },
                  { id: "gf-2", label: "git clone & set upstream remote" },
                  { id: "gf-3", label: "git checkout -b fix/issue-name" },
                ],
              },
              {
                id: "testing",
                label: "Local Testing & Linting",
                icon: "🧪",
                color: "cyan",
                badge: "Quality Gate",
                description: "Guarantee that your pull request does not break any existing test suites or CI workflows.",
                children: [
                  { id: "t-1", label: "Run test runner (npm test / pytest)" },
                  { id: "t-2", label: "Verify code style (npm run lint)" },
                  { id: "t-3", label: "Add unit test for your modified logic" },
                ],
              },
              {
                id: "pr-merge",
                label: "PR Description & Maintainer Review",
                icon: "🚀",
                color: "amber",
                badge: "Merge Stage",
                description: "Write clear, structured PR notes with screenshots and thank maintainers.",
                children: [
                  { id: "prm-1", label: "Reference issue number (#123) in PR body" },
                  { id: "prm-2", label: "Attach working UI screenshots or logs" },
                  { id: "prm-3", label: "Address code review feedback promptly" },
                ],
              },
            ]}
          />

          {/* Top Repositories Grid */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Github className="size-5 text-primary" />
              Curated High-Impact Open-Source Repositories
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {result.top_recommended_repositories.map((repo, i) => (
                <Card key={i} className="surface-panel p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{repo.primary_language}</span>
                      <a href={repo.github_url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        View GitHub <ExternalLink className="size-3" />
                      </a>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{repo.repository_name}</h3>
                    <p className="text-xs text-muted-foreground">{repo.domain_category}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {repo.beginner_friendly_tags.map((t, ti) => (
                        <Badge key={ti} variant="secondary" className="text-[10px]">
                          🏷️ {t}
                        </Badge>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground mt-2">
                      <strong className="text-primary block mb-0.5">🎯 Recommended First Issue:</strong>
                      {repo.recommended_first_issue_type}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Step-by-Step Git PR Workflow */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="size-4 text-emerald-500" />
                Step-by-Step Git Fork & Pull Request Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-xs text-muted-foreground font-mono">
                {result.step_by_step_git_pr_workflow.map((step, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-muted/30 border border-border">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* PR Description Template */}
          <Card className="surface-panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="size-4 text-primary" />
                High-Acceptance Pull Request (PR) Description Template
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => copyText(result.pull_request_description_template)}>
                <Copy className="size-3.5 mr-1.5" /> Copy PR Template
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-xs font-mono leading-relaxed text-foreground bg-muted/40 p-4 rounded-xl">
                {result.pull_request_description_template}
              </pre>
            </CardContent>
          </Card>

          {/* Maintainer Etiquette */}
          <Card className="surface-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Open-Source Maintainer Etiquette (Get Merged in 24 Hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.maintainer_etiquette_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✦</span>
                    <span>{rule}</span>
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
