import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateStarterProjects } from "./starter-projects.server";

export const fetchStarterProjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      languageOrFramework: "Python & FastAPI" | "JavaScript / React / Node.js" | "Java & Spring Boot" | "Go & Microservices";
      targetRole: string;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateStarterProjects(context.supabase, context.userId, data),
  );
