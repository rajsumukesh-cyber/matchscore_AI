import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { analyzeTechMatrix } from "./tech-matrix.server";

export const fetchTechMatrix = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      candidateStack: string;
      targetStack: string;
      targetRole?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    analyzeTechMatrix(context.supabase, context.userId, data),
  );
