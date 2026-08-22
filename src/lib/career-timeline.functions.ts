import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { predictCareerTimeline } from "./career-timeline.server";

export const fetchCareerTimeline = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      currentRole?: string | null;
      targetRole: string;
      currentSkills?: string | null;
      experienceYears?: number | string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    predictCareerTimeline(context.supabase, context.userId, data),
  );
