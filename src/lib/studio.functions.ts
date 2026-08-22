import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  rewriteBulletPoint,
  generateExecutiveSummary,
  scanAtsKeywords,
} from "./studio.server";

export const requestBulletRewrite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      rawBullet: string;
      tone: "metrics" | "architect" | "leadership" | "executive";
      targetRole?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    rewriteBulletPoint(context.supabase, context.userId, data),
  );

export const requestExecutiveSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      yearsExperience?: string | null;
      topSkills?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateExecutiveSummary(context.supabase, context.userId, data),
  );

export const requestAtsScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { resumeText: string; jobText: string }) => input)
  .handler(async ({ context, data }) =>
    scanAtsKeywords(context.supabase, context.userId, data),
  );
