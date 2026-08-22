import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Mic,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Award,
} from "lucide-react";
import { fetchResumes } from "@/lib/resumes.functions";
import {
  fetchInterviewQuestions,
  submitAnswerEvaluation,
} from "@/lib/interview.functions";
import type { InterviewQuestion, QuestionEvaluation } from "@/lib/interview.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview Simulator MatchScore" },
      {
        name: "description",
        content: "Practice technical and behavioral interview questions tailored to your resume.",
      },
      { property: "og:title", content: "AI Mock Interview Simulator MatchScore" },
      {
        property: "og:description",
        content: "Practice real technical interview questions with instant AI grading.",
      },
    ],
  }),
  component: MockInterviewPage,
});

function MockInterviewPage() {
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, QuestionEvaluation>>({});
  const [sessionStarted, setSessionStarted] = useState(false);

  const resumes = useQuery({ queryKey: ["resumes"], queryFn: () => fetchResumes() });
  const resumeList = Array.isArray(resumes.data) ? resumes.data : [];

  useEffect(() => {
    if (!resumeId && resumeList.length > 0) {
      setResumeId(resumeList[0].id);
    }
  }, [resumeList, resumeId]);

  const loadQuestions = useMutation({
    mutationFn: async () => {
      const activeResumeId = resumeId || (resumeList[0]?.id ?? "demo-resume-1");
      return fetchInterviewQuestions({
        data: {
          resumeId: activeResumeId,
          targetRole: targetRole.trim() || "Senior Full Stack Engineer",
        },
      });
    },
    onSuccess: (data) => {
      setSessionStarted(true);
      setActiveQuestionIdx(0);
      setAnswers({});
      setEvaluations({});
      toast.success("Interview session initialized with 5 custom questions!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const gradeAnswer = useMutation({
    mutationFn: async (question: InterviewQuestion) => {
      const currentAnswer = answers[question.id] || "";
      if (!currentAnswer.trim()) {
        throw new Error("Please enter your answer before submitting for evaluation.");
      }
      return submitAnswerEvaluation({
        data: {
          targetRole,
          question: question.question,
          category: question.category,
          candidateAnswer: currentAnswer,
        },
      });
    },
    onSuccess: (evalData, question) => {
      setEvaluations((prev) => ({ ...prev, [question.id]: evalData }));
      toast.success(`Answer evaluated: ${evalData.score}/100 score!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const questions: InterviewQuestion[] = loadQuestions.data?.questions ?? [];
  const currentQ = questions[activeQuestionIdx];
  const currentEval = currentQ ? evaluations[currentQ.id] : undefined;

  const totalAnswered = Object.keys(evaluations).length;
  const avgScore =
    totalAnswered > 0
      ? Math.round(
          Object.values(evaluations).reduce((acc, cur) => acc + cur.score, 0) / totalAnswered,
        )
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Mic className="size-8 text-primary" />
              AI Technical Mock Interview Simulator
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
              Practice real-world technical, system design, and STAR behavioral interview questions tailored to your exact target role, with instant feedback and model answers.
            </p>
          </div>
          {sessionStarted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSessionStarted(false);
                loadQuestions.reset();
              }}
            >
              <RefreshCw className="size-3.5 mr-1.5" /> Start New Session
            </Button>
          ) : null}
        </div>
      </div>

      {!sessionStarted ? (
        <Card className="surface-panel border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Configure Your Mock Interview</CardTitle>
            <CardDescription>
              Select your resume and target role to generate custom technical questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="resume-select" className="text-xs font-semibold">
                  Select Resume Profile
                </Label>
                <select
                  id="resume-select"
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={resumeId ?? ""}
                  onChange={(e) => setResumeId(e.target.value)}
                >
                  {resumeList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.candidate_name ?? "Candidate"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="target-role" className="text-xs font-semibold">
                  Target Interview Role
                </Label>
                <Input
                  id="target-role"
                  className="mt-1.5"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>
            </div>

            <Button
              size="lg"
              disabled={loadQuestions.isPending}
              onClick={() => loadQuestions.mutate()}
            >
              {loadQuestions.isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="size-4 mr-2" />
              )}
              {loadQuestions.isPending ? "Generating 5 Custom Questions…" : "Launch Mock Interview Simulator"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Top Progress & Score Tracker */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="surface-panel p-4">
              <span className="text-xs text-muted-foreground uppercase font-medium">Session Progress</span>
              <p className="text-xl font-bold text-foreground mt-1">
                Question {activeQuestionIdx + 1} of {questions.length}
              </p>
              <Progress value={((activeQuestionIdx + 1) / questions.length) * 100} className="mt-2" />
            </Card>

            <Card className="surface-panel p-4">
              <span className="text-xs text-muted-foreground uppercase font-medium">Evaluated Answers</span>
              <p className="text-xl font-bold text-foreground mt-1">
                {totalAnswered} / {questions.length} completed
              </p>
              <div className="flex gap-1.5 mt-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      evaluations[q.id]
                        ? evaluations[q.id].score >= 80
                          ? "bg-emerald-500"
                          : evaluations[q.id].score >= 65
                            ? "bg-primary"
                            : "bg-amber-500"
                        : "bg-muted",
                    )}
                  />
                ))}
              </div>
            </Card>

            <Card className="surface-panel p-4 bg-primary/5 border-primary/20">
              <span className="text-xs text-primary uppercase font-bold">Interview Readiness Score</span>
              <p className="text-2xl font-extrabold text-primary mt-1">
                {avgScore > 0 ? `${avgScore}/100` : "Ready to Grade"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {avgScore >= 80 ? "🔥 Top Tier Candidate" : avgScore >= 65 ? "👍 Competitive Profile" : "Start answering to see grade"}
              </p>
            </Card>
          </div>

          {/* Active Question Box */}
          {currentQ ? (
            <Card className="surface-panel border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 font-semibold">
                    {currentQ.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">
                    Question {activeQuestionIdx + 1} of {questions.length}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-foreground mt-2 leading-snug">
                  {currentQ.question}
                </CardTitle>
                <p className="text-xs text-muted-foreground pt-1">
                  <strong>Evaluator Context: </strong>
                  {currentQ.context}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="candidate-answer" className="text-xs font-semibold text-foreground">
                      Your Response (Speak or Type):
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {(answers[currentQ.id] || "").length} characters · Use STAR method
                    </span>
                  </div>
                  <Textarea
                    id="candidate-answer"
                    rows={6}
                    placeholder="Structure your answer: 1) Core architecture/approach, 2) Specific technology choices (e.g. Redis, PostgreSQL, Node.js), 3) Measurable outcome and trade-offs considered..."
                    value={answers[currentQ.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeQuestionIdx === 0}
                      onClick={() => setActiveQuestionIdx((prev) => prev - 1)}
                    >
                      <ArrowLeft className="size-4 mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeQuestionIdx === questions.length - 1}
                      onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                    >
                      Next <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </div>

                  <Button
                    disabled={gradeAnswer.isPending || !(answers[currentQ.id] || "").trim()}
                    onClick={() => gradeAnswer.mutate(currentQ)}
                  >
                    {gradeAnswer.isPending ? (
                      <Loader2 className="size-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="size-4 mr-2" />
                    )}
                    {gradeAnswer.isPending ? "AI is Grading Your Answer…" : "Evaluate My Answer"}
                  </Button>
                </div>

                {/* Instant Evaluation Feedback Card */}
                {currentEval ? (
                  <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          AI Answer Grade
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-display text-3xl font-extrabold text-foreground">
                            {currentEval.score}/100
                          </span>
                          <Badge variant={currentEval.score >= 80 ? "default" : "secondary"}>
                            {currentEval.star_rating} Rating
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">Technical Accuracy</span>
                        <p className="font-mono text-lg font-bold text-primary">
                          {currentEval.technical_accuracy}%
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div className="rounded-lg bg-background/80 p-3 border border-border">
                        <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="size-3.5" /> What You Did Well
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {currentEval.strengths.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg bg-background/80 p-3 border border-border">
                        <p className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 mb-1.5">
                          <AlertCircle className="size-3.5" /> Missed Points & Growth Areas
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {currentEval.missed_points.map((m, i) => (
                            <li key={i}>• {m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg bg-background p-4 border border-primary/20 space-y-2 text-xs">
                      <p className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                        <Award className="size-4 text-primary" /> Ideal Model Answer from Principal Engineer:
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentEval.ideal_model_answer}
                      </p>
                    </div>

                    <p className="text-xs text-primary font-medium flex items-center gap-1.5">
                      <Sparkles className="size-3.5" /> <strong>Quick Tip: </strong> {currentEval.quick_tip}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
