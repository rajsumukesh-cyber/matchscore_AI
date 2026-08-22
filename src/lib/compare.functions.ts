import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { compareResumes } from "./compare.server";

export const fetchHeadToHead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      resumeAId: string;
      resumeBId: string;
      jobDescriptionId?: string | null;
      targetRole?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    compareResumes(context.supabase, context.userId, data),
  );
