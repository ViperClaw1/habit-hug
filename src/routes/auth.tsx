import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Flame, LockKeyhole, Mail, Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Streaky habit tracker" },
      {
        name: "description",
        content: "Sign in to Streaky to track your daily habits and keep your streaks alive.",
      },
      { property: "og:title", content: "Sign in — Streaky habit tracker" },
      {
        property: "og:description",
        content: "Sign in to Streaky to track your daily habits and keep your streaks alive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setCheckEmail(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="landing-shell min-h-screen bg-background p-3 text-foreground sm:p-5 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.05fr_.95fr]">
        <section className="auth-visual relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <Link to="/" className="relative z-10 flex w-fit items-center gap-3" aria-label="Streaky home">
            <span className="grid size-10 place-items-center rounded-lg bg-primary-foreground text-primary shadow-lg shadow-ink/15">
              <Check className="size-5 stroke-[3]" />
            </span>
            <span className="font-display text-2xl font-bold">Streaky</span>
          </Link>

          <div className="relative z-10 my-14 max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase text-primary-foreground/70">
              <Sparkles className="size-4" /> Your week, in motion
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.02] xl:text-6xl">
              One check today.<br />A stronger week tomorrow.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-primary-foreground/75">
              Sign in to see your habits, protect your streak, and turn small daily actions into visible progress.
            </p>

            <div className="mt-12 max-w-md rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-primary-foreground/60">This week</p>
                  <p className="mt-1 font-display text-2xl font-bold">Morning walk</p>
                </div>
                <span className="auth-flame grid size-12 place-items-center rounded-xl bg-coral text-coral-foreground">
                  <Flame className="size-6 fill-current" />
                </span>
              </div>
              <div className="mt-7 grid grid-cols-7 gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div key={`${day}-${index}`} className="text-center">
                    <span className={`auth-day mx-auto grid aspect-square max-w-11 place-items-center rounded-lg border ${index < 6 ? "border-primary-foreground bg-primary-foreground text-primary" : "border-primary-foreground/30 bg-primary-foreground/10"}`} style={{ animationDelay: `${300 + index * 90}ms` }}>
                      {index < 6 && <Check className="size-4 stroke-[3]" />}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold text-primary-foreground/60">{day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/15 pt-5">
                <span className="text-sm text-primary-foreground/70">Current streak</span>
                <strong className="font-display text-xl">14 days</strong>
              </div>
            </div>
          </div>

          <p className="relative z-10 flex items-center gap-2 text-sm text-primary-foreground/70">
            <LockKeyhole className="size-4" /> Your habits stay private to your account.
          </p>
        </section>

        <section className="flex min-h-[calc(100vh-1.5rem)] flex-col p-5 sm:min-h-[calc(100vh-2.5rem)] sm:p-10 lg:p-14 xl:p-20">
          <div className="flex items-center justify-between lg:justify-end">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold lg:hidden">
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Check className="size-5 stroke-[3]" /></span>
              Streaky
            </Link>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
              <Link to="/"><ArrowLeft /> Back home</Link>
            </Button>
          </div>

          <div className="auth-form mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <div className="mb-8">
              <p className="text-sm font-bold text-primary">{mode === "signin" ? "Welcome back" : "Start your streak"}</p>
              <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                {mode === "signin" ? "Pick up where you left off." : "Build a week you’re proud of."}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {checkEmail
                  ? "We sent you a confirmation link. Open it, then return here to sign in."
                  : mode === "signin"
                    ? "Your habits and latest streak are ready when you are."
                    : "Create your private space and start with one small habit."}
              </p>
            </div>

            {checkEmail ? (
              <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
                <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground"><Mail className="size-5" /></span>
                <h3 className="mt-5 font-display text-xl font-bold">Check your inbox</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Confirm your email address to finish creating your account.</p>
                <Button variant="outline" className="mt-5" onClick={() => { setCheckEmail(false); setMode("signin"); }}>
                  Return to sign in
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-background px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-background px-4"
                  />
                </div>
                <Button type="submit" size="lg" className="group h-12 w-full text-base shadow-lg shadow-primary/20" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create my account"}
                  {!busy && <ArrowRight className="transition-transform group-hover:translate-x-1" />}
                </Button>
              </form>
            )}

            {!checkEmail && (
              <div className="mt-7 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>{mode === "signin" ? "New to Streaky?" : "Already have an account?"}</span>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-1 font-semibold text-primary"
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setCheckEmail(false);
                  }}
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </Button>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">Simple habits. Private progress. No noise.</p>
        </section>
      </div>
    </main>
  );
}
