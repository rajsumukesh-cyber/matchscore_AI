import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { matchStudentInternships } from "./internship-matcher.server";

export const fetchStudentInternships = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      studentName: string;
      degreeAndYear: string;
      currentSkills: string;
      targetDomain: string;
      gpaOrCollegeTier?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    matchStudentInternships(context.supabase, context.userId, data),
  );
