import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 group", className)}>
      <span className="signal-gradient flex size-9 items-center justify-center rounded-xl text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <Target className="size-4.5" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Match<span className="text-signal-gradient">Score</span>
      </span>
    </span>
  );
}
