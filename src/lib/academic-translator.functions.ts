import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { translateAcademicResume } from "./academic-translator.server";

export const fetchAcademicTranslation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      studentDegree: string;
      targetRole: string;
      rawCourseworkBullets: string[];
    }) => input,
  )
  .handler(async ({ context, data }) =>
    translateAcademicResume(context.supabase, context.userId, data),
  );
