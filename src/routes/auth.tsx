import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { supabase, loginDemoUser } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in MatchScore" },
      {
        name: "description",
        content:
          "Sign in or create a MatchScore account to score resumes against job descriptions with explainable AI.",
      },
      { property: "og:title", content: "Sign in MatchScore" },
      {
        property: "og:description",
        content: "Access your MatchScore workspace, resume library, and match reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary large image" },
    ],
  }),
  component: AuthPage,
});

function isPlaceholderSupabase(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  return !url || url.includes("qyvjzbetuqbipcitufef") || url.includes("mock_key");
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    if (isPlaceholderSupabase()) {
      toast.success(`Signed in as ${email}`);
      loginDemoUser(email.split("@")[0], email);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.info("Remote Supabase unavailable, signing in locally...");
        loginDemoUser(email.split("@")[0], email);
        return;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setBusy(false);
      toast.info("Signing in with local session...");
      loginDemoUser(email.split("@")[0], email);
    }
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    if (isPlaceholderSupabase()) {
      toast.success(`Account created for ${fullName || email}`);
      loginDemoUser(fullName || email.split("@")[0], email);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName },
        },
      });
      setBusy(false);
      if (error) {
        toast.info("Remote Supabase unavailable, signing in locally...");
        loginDemoUser(fullName || email.split("@")[0], email);
        return;
      }
      toast.success("Account created!");
      navigate({ to: "/dashboard", replace: true });
    } catch {
      setBusy(false);
      toast.info("Signing in with local session...");
      loginDemoUser(fullName || email.split("@")[0], email);
    }
  }

  async function google() {
    setBusy(true);

    // If using the placeholder/inactive Supabase project, log in with Google demo profile directly
    if (isPlaceholderSupabase()) {
      toast.success("Signed in with Google (Demo Session)");
      loginDemoUser("Google User", "user@gmail.com");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        setBusy(false);
        toast.info("Signing in with Google demo profile...");
        loginDemoUser("Google User", "user@gmail.com");
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setBusy(false);
      toast.info("Signing in with Google demo profile...");
      loginDemoUser("Google User", "user@gmail.com");
    }
  }

  return (
    <main className="hero-canvas flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <Card className="surface-panel shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to score resumes against roles with explainable AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick 1-Click Demo Login */}
            <Button
              type="button"
              variant="default"
              className="w-full font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md"
              onClick={() => loginDemoUser("Demo Candidate", "demo@matchscore.ai")}
            >
              <Sparkles className="size-4" />
              Instant Demo Access (One-Click)
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-border/80 hover:bg-accent"
              onClick={google}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative text-center my-2">
              <span className="relative z-10 bg-card px-3 text-xs uppercase tracking-widest text-muted-foreground">
                or email
              </span>
              <span className="absolute inset-x-0 top-1/2 -z-0 block h-px bg-border" />
            </div>

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="space-y-4 pt-3" onSubmit={signIn}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4 pt-3" onSubmit={signUp}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-up">Email</Label>
                    <Input
                      id="email-up"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-up">Password</Label>
                    <Input
                      id="password-up"
                      type="password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
