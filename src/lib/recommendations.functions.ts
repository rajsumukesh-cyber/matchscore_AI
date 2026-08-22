import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateRecommendations } from "./recommendations.server";

export const fetchRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      targetRole: string;
      keySkills: string;
      notableAchievement: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateRecommendations(context.supabase, context.userId, data),
  );
