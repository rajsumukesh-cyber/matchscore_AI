import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  FileText,
  Briefcase,
  Sparkles,
  Receipt,
  ShieldCheck,
  Users,
  GraduationCap,
  Mic,
  Wand2,
  DollarSign,
  MapPin,
  FileSignature,
  Scale,
  Linkedin,
  CalendarDays,
  Coins,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

const NAV_MAIN = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/analyze", label: "New analysis", icon: Sparkles },
] as const;

const NAV_AI = [
  { to: "/screening", label: "Recruiter screening", icon: Users },
  { to: "/coach", label: "Skill gap coach", icon: GraduationCap },
  { to: "/interview", label: "Mock interview", icon: Mic },
  { to: "/studio", label: "Resume studio", icon: Wand2 },
  { to: "/salary", label: "Salary predictor", icon: DollarSign },
  { to: "/career-timeline", label: "Career timeline", icon: MapPin },
  { to: "/cover-letter", label: "Cover letter", icon: FileSignature },
  { to: "/compare", label: "Resume vs resume", icon: Scale },
  { to: "/linkedin-optimizer", label: "LinkedIn studio", icon: Linkedin },
  { to: "/onboarding-plan", label: "30-60-90 plan", icon: CalendarDays },
  { to: "/offer-evaluator", label: "Offer evaluator", icon: Coins },
] as const;

const NAV_DATA = [
  { to: "/resumes", label: "Resumes", icon: FileText },
  { to: "/jobs", label: "Job roles", icon: Briefcase },
  { to: "/reports", label: "Reports", icon: BarChart3 },
] as const;

const NAV_SYSTEM = [
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
] as const;

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: ReadonlyArray<{ to: string; label: string; icon: React.ElementType }>;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">
        {label}
      </p>
      {items.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200",
              active
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            {active ? (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
            ) : null}
            <item.icon className={cn("size-4 shrink-0 transition-colors", active ? "text-primary" : "group-hover:text-primary/70")} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="flex flex-col overflow-y-auto flex-1 custom-scrollbar">
      <NavGroup label="Core" items={NAV_MAIN} pathname={pathname} onNavigate={() => setOpen(false)} />
      <NavGroup label="AI Suite" items={NAV_AI} pathname={pathname} onNavigate={() => setOpen(false)} />
      <NavGroup label="Library" items={NAV_DATA} pathname={pathname} onNavigate={() => setOpen(false)} />
      <NavGroup label="System" items={NAV_SYSTEM} pathname={pathname} onNavigate={() => setOpen(false)} />
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border/60 bg-sidebar/80 backdrop-blur-xl px-3 py-4 lg:flex">
        <Link to="/dashboard" className="mb-5 px-2.5 group">
          <Logo />
        </Link>
        {nav}
        <div className="mt-auto pt-2 border-t border-sidebar-border/40">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[13px] text-muted-foreground hover:text-destructive transition-colors"
            onClick={signOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} className="hover:bg-primary/10">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      {/* Mobile drawer */}
      {open ? (
        <div className="sticky top-14 z-30 border-b border-border/40 bg-sidebar/95 backdrop-blur-xl px-3 py-3 lg:hidden animate-fade-in">
          {nav}
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start gap-3 text-[13px] text-muted-foreground hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      ) : null}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
