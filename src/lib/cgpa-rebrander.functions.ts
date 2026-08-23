import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rebrandLowCgpaProfile } from "./cgpa-rebrander.server";

export const fetchCgpaRebrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      academicIssue: "Low CGPA (<6.5/7.0)" | "Past/Active Academic Backlogs" | "Non-CS Degree Transition" | "Career / Education Gap";
      currentDegree: string;
      actualSkillsLearned: string;
      targetRole: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    rebrandLowCgpaProfile(context.supabase, context.userId, data),
  );
