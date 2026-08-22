import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateSpeakerPitches } from "./speaker-pitch.server";

export const fetchSpeakerPitches = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      currentRole: string;
      primaryExpertise: string;
      flagshipProject: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateSpeakerPitches(context.supabase, context.userId, data),
  );
