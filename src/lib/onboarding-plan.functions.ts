import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateOnboardingPlan } from "./onboarding-plan.server";

export const fetchOnboardingPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      targetRole: string;
      companyName: string;
      coreDomain: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateOnboardingPlan(context.supabase, context.userId, data),
  );
