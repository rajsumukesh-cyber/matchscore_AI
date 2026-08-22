import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateStarStoryBank } from "./star-story-bank.server";

export const fetchStarStoryBank = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      coreDomain: string;
      majorProject: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateStarStoryBank(context.supabase, context.userId, data),
  );
