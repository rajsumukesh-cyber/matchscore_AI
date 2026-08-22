import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateStudentRoadmap } from "./student-roadmap.server";

export const fetchStudentRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      currentYearOrSemester: string;
      targetRole: string;
      preferredTrack: "Full Stack Web" | "AI & Machine Learning" | "Cloud & DevOps" | "Data Engineering";
    }) => input,
  )
  .handler(async ({ context, data }) =>
    generateStudentRoadmap(context.supabase, context.userId, data),
  );
