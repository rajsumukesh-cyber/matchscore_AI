import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateInterviewCoaching } from "./interview-coach.server";

export const fetchInterviewCoaching = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      codingTopic: "Array / Two Pointers" | "Hash Map & String Manipulation" | "Binary Trees & BST" | "Dynamic Programming & Recursion" | "System Architecture & APIs";
      anxietyLevel: "High (Freeze up under timer)" | "Moderate (Struggle explaining thoughts)" | "Mild (Need structuring)";
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateInterviewCoaching(context.supabase, context.userId, data),
  );
