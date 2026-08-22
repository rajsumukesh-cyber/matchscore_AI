import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateCoverLetter, generateColdOutreach } from "./cover-letter.server";

export const fetchCoverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      targetRole: string;
      companyName: string;
      topSkills: string;
      yearsExperience: string;
      keyAchievement?: string | null;
      tone: "professional" | "conversational" | "bold";
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateCoverLetter(context.supabase, context.userId, data),
  );

export const fetchColdOutreach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateName: string;
      recipientName: string;
      recipientTitle: string;
      companyName: string;
      targetRole: string;
      sharedConnection?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateColdOutreach(context.supabase, context.userId, data),
  );
