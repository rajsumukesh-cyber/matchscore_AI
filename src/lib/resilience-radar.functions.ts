import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { evaluateCareerResilience } from "./resilience-radar.server";

export const fetchCareerResilience = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      primaryTechStack: string;
      yearsExperience: number;
      industrySector: string;
      hasPublicArtifacts: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    evaluateCareerResilience(context.supabase, context.userId, data),
  );
