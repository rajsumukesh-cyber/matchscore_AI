import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateReverseInterview } from "./reverse-interview.server";

export const fetchReverseInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      companyName: string;
      targetRole: string;
      companyStage?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateReverseInterview(context.supabase, context.userId, data),
  );
