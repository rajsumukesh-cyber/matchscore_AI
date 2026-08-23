import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: "primary" | "emerald" | "amber" | "rose" | "cyan" | "indigo";
  icon?: string;
  badge?: string;
  children?: MindMapNode[];
}

export interface MindMapProps {
  rootTitle: string;
  rootSubtitle?: string;
  rootBadge?: string;
  nodes: MindMapNode[];
  className?: string;
}

const COLOR_MAP = {
  primary: {
    badge: "border-primary/30 text-primary bg-primary/10",
    border: "border-primary/30 hover:border-primary/60",
    bg: "bg-primary/5 hover:bg-primary/10",
    dot: "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    line: "stroke-primary/40",
  },
  emerald: {
    badge: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10",
    border: "border-emerald-500/30 hover:border-emerald-500/60",
    bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    line: "stroke-emerald-500/40",
  },
  amber: {
    badge: "border-amber-500/30 text-amber-500 bg-amber-500/10",
    border: "border-amber-500/30 hover:border-amber-500/60",
    bg: "bg-amber-500/5 hover:bg-amber-500/10",
    dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    line: "stroke-amber-500/40",
  },
  rose: {
    badge: "border-rose-500/30 text-rose-500 bg-rose-500/10",
    border: "border-rose-500/30 hover:border-rose-500/60",
    bg: "bg-rose-500/5 hover:bg-rose-500/10",
    dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
    line: "stroke-rose-500/40",
  },
  cyan: {
    badge: "border-cyan-500/30 text-cyan-500 bg-cyan-500/10",
    border: "border-cyan-500/30 hover:border-cyan-500/60",
    bg: "bg-cyan-500/5 hover:bg-cyan-500/10",
    dot: "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]",
    line: "stroke-cyan-500/40",
  },
  indigo: {
    badge: "border-indigo-500/30 text-indigo-500 bg-indigo-500/10",
    border: "border-indigo-500/30 hover:border-indigo-500/60",
    bg: "bg-indigo-500/5 hover:bg-indigo-500/10",
    dot: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]",
    line: "stroke-indigo-500/40",
  },
};

export function InteractiveMindMap({
  rootTitle,
  rootSubtitle,
  rootBadge = "Visual Mind Map",
  nodes,
  className,
}: MindMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  return (
    <div className={cn("rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 sm:p-7 shadow-lg space-y-6 overflow-hidden", className)}>
      {/* Root Header Node */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-bold border-primary/30 text-primary bg-primary/10 flex items-center gap-1">
              <Sparkles className="size-3" /> {rootBadge}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">Click any node to explore key takeaways</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            🧠 {rootTitle}
          </h3>
          {rootSubtitle && (
            <p className="text-xs text-muted-foreground leading-relaxed">{rootSubtitle}</p>
          )}
        </div>
      </div>

      {/* Visual Branches Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {nodes.map((branch, index) => {
          const colorTheme = COLOR_MAP[branch.color || "primary"];
          const isSelected = activeNodeId === branch.id;

          return (
            <div
              key={branch.id || index}
              className={cn(
                "relative rounded-xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3",
                colorTheme.border,
                colorTheme.bg,
                isSelected ? "ring-2 ring-primary/40 shadow-md scale-[1.01]" : ""
              )}
              onClick={() => setActiveNodeId(isSelected ? null : branch.id)}
            >
              {/* Branch Node Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2.5 rounded-full shrink-0", colorTheme.dot)} />
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {branch.icon && <span>{branch.icon}</span>}
                      {branch.label}
                    </span>
                  </div>
                  {branch.badge && (
                    <Badge variant="outline" className={cn("text-[10px] shrink-0 font-semibold", colorTheme.badge)}>
                      {branch.badge}
                    </Badge>
                  )}
                </div>

                {branch.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                    {branch.description}
                  </p>
                )}
              </div>

              {/* Child Sub-Nodes / Connected Steps */}
              {branch.children && branch.children.length > 0 && (
                <div className="space-y-1.5 pl-4 border-l border-border/80 mt-2">
                  {branch.children.map((child, ci) => (
                    <div
                      key={child.id || ci}
                      className="p-2 rounded-lg bg-background/60 border border-border/40 text-xs text-foreground flex items-start gap-2 hover:bg-background/90 transition-colors"
                    >
                      <ArrowRight className="size-3 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="block text-[11px] font-semibold text-foreground">
                          {child.label}
                        </strong>
                        {child.description && (
                          <span className="block text-[10px] text-muted-foreground">
                            {child.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
