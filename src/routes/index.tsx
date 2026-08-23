import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Coins,
  FileSearch,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  Mic,
  Wand2,
  DollarSign,
  GraduationCap,
  Users,
  MapPin,
  FileSignature,
  Scale,
  Linkedin,
  CalendarDays,
  Cpu,
  Award,
  TrendingUp,
  Calculator,
  BookOpen,
  Globe,
  HelpCircle,
  Radar,
  Mic2,
  Compass,
  FileCode,
  Briefcase,
  FolderKanban,
  HeartHandshake,
  GitPullRequest,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
} from "lucide-react";
import { fetchPricing } from "@/lib/payments.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatInr } from "@/lib/currency";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchScore AI Resume to Role Match Scorer" },
      {
        name: "description",
        content:
          "Score any resume against any job description with explainable AI. 29-in-1 career & student intelligence suite with open source PR finders, placement aptitude coaches, low CGPA defense, and ATS builders.",
      },
      { property: "og:title", content: "MatchScore AI Resume to Role Match Scorer" },
      {
        property: "og:description",
        content:
          "Explainable resume-to-role matching with 29 AI-powered career and student intelligence tools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: FileSearch,
    title: "Deep Match Analysis",
    body: "Every resume is parsed into skills, experience, and education, then compared against the role's real requirements with explainable category breakdowns.",
  },
  {
    icon: Users,
    title: "Explainable Recruiter Screening",
    body: "Shortlist candidate batches with customizable cutoffs, bias-safe redaction, and personalized study roadmaps for everyone below the line.",
  },
  {
    icon: GraduationCap,
    title: "AI Skill Gap Coach",
    body: "Identify missing skills, launch free verified courses (freeCodeCamp, Harvard CS50, edX, AWS), and build portfolio projects with copyable bullets.",
  },
  {
    icon: Mic,
    title: "Mock Interview Simulator",
    body: "Practice 5 tailored technical & STAR behavioral interview questions with real-time AI grading, accuracy metrics, and principal model answers.",
  },
  {
    icon: Wand2,
    title: "Resume Studio & ATS Builder",
    body: "Transform weak bullets into high-impact metric statements, generate tailored executive summaries, and scan ATS keyword density in real-time.",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmark Predictor",
    body: "Calculate market compensation in INR and USD, see exact salary multipliers for closing skill gaps, and copy proven negotiation scripts.",
  },
  {
    icon: MapPin,
    title: "Career Timeline Predictor",
    body: "Visualise your 5-year career trajectory with projected roles, salary growth arcs, skill acquisition milestones, risk alerts, and career accelerators.",
  },
  {
    icon: FileSignature,
    title: "Cover Letter & Outreach Generator",
    body: "Generate recruiter-ready cover letters in 3 tones, cold networking emails, follow-ups, and optimised LinkedIn connection messages.",
  },
  {
    icon: Scale,
    title: "Resume Head-to-Head Comparator",
    body: "Compare two candidates side-by-side across 5 scoring dimensions with a data-driven verdict and hiring recommendation.",
  },
  {
    icon: Linkedin,
    title: "AI LinkedIn Profile & Headline Studio",
    body: "Generate high-converting LinkedIn headlines in 3 styles, storytelling About sections, and Boolean recruiter search keywords.",
  },
  {
    icon: CalendarDays,
    title: "30-60-90 Day Executive Onboarding Plan",
    body: "Create a structured, interview-ready 30-60-90 day strategic plan with objectives, deliverables, and verbal elevator pitch.",
  },
  {
    icon: Coins,
    title: "AI Offer Evaluator & Comp Analyzer",
    body: "Compare base salary, equity, and bonuses side-by-side, evaluate total comp, and generate custom counter-offer negotiation letters.",
  },
  {
    icon: Cpu,
    title: "AI Tech Stack Compatibility & Migration",
    body: "Map your known stack against target company requirements, calculate semantic transferability, and get interview bridge arguments.",
  },
  {
    icon: Award,
    title: "AI Recommendation Letter & Reference Prep",
    body: "Draft authentic recommendation letters from 3 perspectives (Manager, Peer, Mentee) and prepare your references for recruiter calls.",
  },
  {
    icon: TrendingUp,
    title: "AI Promotion & Review Case Builder",
    body: "Format your shipped projects, OKRs, and leadership impact into an executive-ready promotion dossier and 1-on-1 manager script.",
  },
  {
    icon: Calculator,
    title: "AI Freelance & Consulting Rate Calculator",
    body: "Convert full-time salary into calibrated consulting rates (hourly, day, monthly retainer) and generate client proposals.",
  },
  {
    icon: BookOpen,
    title: "AI Behavioral & Leadership STAR Story Bank",
    body: "Structure and polish an interview repository of STAR stories with verified metrics across major leadership principles.",
  },
  {
    icon: Globe,
    title: "AI Global Visa & Relocation Assessor",
    body: "Evaluate qualifications for UK Global Talent, EU Blue Card, Canada GTS, and US tech visas with custom evidence roadmaps.",
  },
  {
    icon: HelpCircle,
    title: "AI Reverse Interview & Due Diligence",
    body: "Generate high-conviction questions for managers, peers, and CTOs to spot company red flags before accepting an offer.",
  },
  {
    icon: Radar,
    title: "AI Layoff Risk & Career Resilience Radar",
    body: "Assess your career defensibility against AI automation and tech stack obsolescence with a 4-pillar antifragile blueprint.",
  },
  {
    icon: Mic2,
    title: "AI Executive Bio & Keynote Speaker Pitch",
    body: "Generate executive bios in 3 lengths and conference keynote CFP proposals to build public authority.",
  },
  {
    icon: Briefcase,
    title: "AI Student Internship Matcher & Outreach",
    body: "Match student profiles to Big Tech, startup, and open-source fellowships (GSoC, MLH) and generate founder cold emails.",
  },
  {
    icon: Compass,
    title: "AI Semester Career Roadmap & Hackathons",
    body: "Semester-by-semester milestones covering DSA targets, core CS topics, winning hackathon blueprints, and free developer perks.",
  },
  {
    icon: FileCode,
    title: "AI Academic to Industry Resume Translator",
    body: "Convert college coursework, lab assignments, and student projects into enterprise metric statements with architecture keywords.",
  },
  {
    icon: ShieldAlert,
    title: "AI Low CGPA, Backlog & Non-CS Rebrander",
    body: "Overcome lower grades and non-CS backgrounds with proof-of-work rebrand strategies and recruiter interview scripts.",
  },
  {
    icon: FolderKanban,
    title: "AI 48-Hour Zero Experience Starter Projects",
    body: "Build recruiter-approved full-stack portfolio apps over a single weekend with architectures and free hosting steps.",
  },
  {
    icon: HeartHandshake,
    title: "AI Live Interview Anxiety & Hint Coach",
    body: "Master the 4-step panic-free coding interview framework and emergency verbal lifelines when stuck.",
  },
  {
    icon: GitPullRequest,
    title: "AI Open Source PR Finder",
    body: "Discover curated beginner-friendly GitHub repositories, step-by-step Git fork workflows, and PR templates.",
  },
  {
    icon: BrainCircuit,
    title: "AI Campus Placement Aptitude Coach",
    body: "10-second mental-math shortcuts, LCM efficiency methods for Time & Work, and syllogism cross-out tricks.",
  },
];

const STATS = [
  { value: "29", label: "AI Modules", suffix: "" },
  { value: "50", label: "Scoring Dimensions", suffix: "+" },
  { value: "10K", label: "Resumes Analysed", suffix: "+" },
  { value: "97", label: "ATS Pass Rate", suffix: "%" },
];

function Landing() {
  const pricing = useQuery({ queryKey: ["pricing"], queryFn: () => fetchPricing() });
  const pricingList = Array.isArray(pricing.data) ? pricing.data : [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="#features">Features</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href="#pricing">Pricing</a>
            </Button>
            <Button asChild size="sm" className="signal-gradient text-primary-foreground border-0 shadow-md hover:shadow-lg transition-shadow">
              <Link to="/auth">
                Get started <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden">
          {/* Background orbs */}
          <div className="hero-orb-primary -top-32 -left-24 opacity-60" />
          <div className="hero-orb-accent -top-16 right-0 opacity-50" />
          <div className="hero-orb-primary bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30" />

          <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
            {/* Top badge */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <Sparkles className="size-3.5" />
                29-in-1 AI Career & Student Intelligence Suite
              </span>
            </div>

            {/* Main headline */}
            <h1 className="animate-fade-in-up stagger-1 mt-8 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              See the <span className="text-signal-gradient">exact reasons</span>{" "}
              behind every match score
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up stagger-2 mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Score resumes against job postings, practice technical mock interviews,
              transform ATS bullets, calculate market salaries, project career timelines,
              generate cover letters, and compare candidates head-to-head.
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="signal-gradient text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-base px-8 h-12">
                <Link to="/auth">
                  <Sparkles className="size-4 mr-2" />
                  Start for free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <a href="#features">
                  Explore all 9 modules
                  <ChevronRight className="size-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="animate-fade-in-up stagger-4 mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" /> No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" /> Pay per analysis
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" /> x402 USDC micropayments
              </span>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="relative border-y border-border/40 bg-surface/50">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`animate-fade-in-up stagger-${i + 1} text-center`}
                >
                  <p className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {s.value}
                    <span className="text-primary">{s.suffix}</span>
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
              <Zap className="size-3 mr-1.5" /> All 9 Modules
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to master your career
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Built for ambitious candidates and data-driven hiring managers.
              Every module works standalone or together as one unified suite.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 9)} feature-card p-6 group cursor-default`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg">
                    <f.icon className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-accent/20 text-accent bg-accent/5">
              <Coins className="size-3 mr-1.5" /> Pricing
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Transparent, per-report pricing
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Pay only for what you run. No monthly subscriptions, no locked-in tiers.
              Powered by x402 USDC micropayments.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pricingList.map((p, i) => (
              <Card
                key={p.product}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 9)} surface-panel flex flex-col justify-between hover:border-primary/40 transition-all duration-300 hover:shadow-lg group`}
              >
                <CardHeader>
                  <CardTitle className="text-base">{p.label}</CardTitle>
                  <p className="font-display mt-4 text-4xl font-extrabold tracking-tight text-foreground">
                    {formatInr(p.price_usd)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">${p.price_usd} USD per run</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  <Button asChild className="w-full group-hover:signal-gradient group-hover:text-primary-foreground group-hover:border-0 transition-all duration-300" size="sm" variant="outline">
                    <Link to="/auth">
                      Use now <ArrowRight className="size-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative overflow-hidden border-t border-border/40">
          <div className="hero-orb-primary -bottom-32 left-1/4 opacity-40" />
          <div className="hero-orb-accent -bottom-24 right-1/4 opacity-30" />

          <div className="relative mx-auto max-w-3xl px-4 py-20 sm:py-28 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to unlock your career potential?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto">
              Join thousands of candidates and hiring managers using AI-powered
              career intelligence to make smarter decisions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="signal-gradient text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-base px-8 h-12 animate-pulse-glow">
                <Link to="/auth">
                  <Sparkles className="size-4 mr-2" />
                  Get started for free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground">
            MatchScore AI · Explainable resume matching and career intelligence
          </p>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-xs text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-xs text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <Link to="/auth" className="text-xs text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
