import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
} from "./interview.server";

export const fetchInterviewQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: { resumeId: string; jobDescriptionId?: string | null; targetRole?: string | null }) =>
      input,
  )
  .handler(async ({ context, data }) =>
    generateInterviewQuestions(context.supabase, context.userId, data),
  );

export const submitAnswerEvaluation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      question: string;
      category: string;
      candidateAnswer: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    evaluateInterviewAnswer(context.supabase, context.userId, data),
  );
