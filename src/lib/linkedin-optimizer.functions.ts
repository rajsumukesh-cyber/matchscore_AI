import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { optimizeLinkedInProfile } from "./linkedin-optimizer.server";

export const fetchLinkedInOptimization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      targetRole: string;
      currentSkills: string;
      yearsExperience: string;
      keyAchievements?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    optimizeLinkedInProfile(context.supabase, context.userId, data),
  );
