import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findOpenSourceContributions } from "./open-source.server";

export const fetchOpenSourceContributions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      primaryLanguage: "JavaScript / TypeScript" | "Python" | "Go / Rust" | "Java / C++";
      studentInterests: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    findOpenSourceContributions(context.supabase, context.userId, data),
  );
