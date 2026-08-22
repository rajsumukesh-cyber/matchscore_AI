import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assessVisaEligibility } from "./visa-assessor.server";

export const fetchVisaAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      yearsExperience: number;
      highestEducation: string;
      hasOpenSourceOrPatents: boolean;
      targetRegions: string[];
    }) => input,
  )
  .handler(async ({ context, data }) =>
    assessVisaEligibility(context.supabase, context.userId, data),
  );
