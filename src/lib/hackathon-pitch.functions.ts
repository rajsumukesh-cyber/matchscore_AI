import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateHackathonPitch } from "./hackathon-pitch.server";

export const fetchHackathonPitch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      projectName: string;
      targetProblem: string;
      coreTechStack: string;
      uniqueMoatOrFeature: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateHackathonPitch(context.supabase, context.userId, data),
  );
