import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildPromotionCase } from "./promotion-case.server";

export const fetchPromotionCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      currentLevel: string;
      targetLevel: string;
      topShippedProjects: string;
      leadershipExamples: string;
      businessMetrics: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    buildPromotionCase(context.supabase, context.userId, data),
  );
