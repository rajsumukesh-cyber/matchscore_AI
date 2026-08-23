import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAptitudeCoaching } from "./aptitude-coach.server";

export const fetchAptitudeCoaching = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetCompanyOrExam: string;
      focusCategory: "Quantitative Aptitude" | "Logical Reasoning" | "Verbal & Critical Thinking";
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateAptitudeCoaching(context.supabase, context.userId, data),
  );
