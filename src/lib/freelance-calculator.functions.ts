import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { calculateFreelanceRates } from "./freelance-calculator.server";

export const fetchFreelanceRates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      targetRole: string;
      annualFteSalary: number;
      currency: "INR" | "USD";
      billableWeeksPerYear?: number;
      billableHoursPerWeek?: number;
    }) => input,
  )
  .handler(async ({ context, data }) =>
    calculateFreelanceRates(context.supabase, context.userId, data),
  );
