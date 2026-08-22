import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { predictSalaryBenchmark } from "./salary.server";

export const fetchSalaryBenchmark = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      experienceYears?: number | string | null;
      primarySkills?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    predictSalaryBenchmark(context.supabase, context.userId, data),
  );
