import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Flame,
  ListPlus,
  LockKeyhole,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Streaky — a simple daily habit tracker" },
      {
        name: "description",
        content:
          "Streaky is a minimal habit tracker: add habits, check them off each day, and keep your weekly streak alive.",
      },
      { property: "og:title", content: "Streaky — a simple daily habit tracker" },
      {
        property: "og:description",
        content:
          "Streaky is a minimal habit tracker: add habits, check them off each day, and keep your weekly streak alive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <main className="landing-shell min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link to="/" className="group flex items-center gap-3" aria-label="Streaky home">
          <span className="brand-mark grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
            <Check className="size-5 stroke-[3]" />
          </span>
          <span className="font-display text-xl font-bold">Streaky</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
          <a href="#features" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Features
          </a>
          {signedIn ? (
            <Button onClick={() => navigate({ to: "/dashboard" })} className="group">
              My habits <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </header>

      <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:min-h-[760px] lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-10">
        <div className="landing-copy relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase text-primary">
            <Sparkles className="size-3.5" />
            Small steps. Visible momentum.
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl xl:text-8xl">
            Habits that <span className="text-primary">actually</span> stick.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Make consistency feel effortless. Check in once a day, see your week take shape,
            and keep the momentum going.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {signedIn ? (
              <Button size="lg" onClick={() => navigate({ to: "/dashboard" })} className="group h-13 px-6 text-base shadow-xl shadow-primary/20">
                Go to my habits <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button size="lg" asChild className="group h-13 px-6 text-base shadow-xl shadow-primary/20">
                <Link to="/auth">
                  Start your streak <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild className="h-13 border-border bg-card/60 px-6 text-base backdrop-blur-xl">
              <a href="#features">See how it works</a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="size-4 text-success" /> Free to start</span>
            <span className="flex items-center gap-1.5"><LockKeyhole className="size-4 text-success" /> Your habits stay private</span>
          </div>
        </div>

        <HabitPreview />
      </section>

      <section id="features" className="relative z-10 border-t border-border/70 bg-surface-soft px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-primary">One clear week at a time</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Everything you need. Nothing you don’t.</h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
            <article className="feature-tile min-h-72 bg-primary p-7 text-primary-foreground lg:col-span-7 lg:row-span-2 lg:p-10">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-lg bg-primary-foreground/15"><TrendingUp className="size-5" /></span>
                <span className="text-sm font-semibold opacity-70">Your week</span>
              </div>
              <div className="mt-14 grid grid-cols-7 gap-2 sm:gap-3">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div key={`${day}-${index}`} className="text-center">
                    <div className={`mx-auto grid aspect-square w-full max-w-14 place-items-center rounded-lg border ${index < 6 ? "border-primary-foreground/20 bg-primary-foreground text-primary" : "border-primary-foreground/25 bg-primary-foreground/10"}`}>
                      {index < 6 && <Check className="size-5 stroke-[3]" />}
                    </div>
                    <span className="mt-2 block text-xs font-bold opacity-70">{day}</span>
                  </div>
                ))}
              </div>
              <h3 className="mt-10 font-display text-3xl font-bold">Progress you can feel.</h3>
              <p className="mt-2 max-w-lg text-primary-foreground/75">A clean seven-day view turns every check-in into visible momentum.</p>
            </article>

            <article className="feature-tile bg-card p-7 lg:col-span-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-coral">Make it yours</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">Add any habit in seconds.</h3>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-coral-soft text-coral"><ListPlus className="size-5" /></span>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                Drink more water <span className="ml-auto grid size-8 place-items-center rounded-md bg-coral text-coral-foreground"><Check className="size-4" /></span>
              </div>
            </article>

            <article className="feature-tile bg-ink p-7 text-ink-foreground lg:col-span-5">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-lg bg-coral text-coral-foreground"><Flame className="size-5 fill-current" /></span>
                <span className="text-4xl font-display font-bold">14</span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold">Keep the chain alive.</h3>
              <p className="mt-2 text-ink-muted">Your current streak stays in sight, without guilt or clutter.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

const previewHabits = [
  { name: "Morning walk", progress: "100%", done: true },
  { name: "Read 20 pages", progress: "72%", done: true },
  { name: "No phone after 10", progress: "45%", done: false },
];

function HabitPreview() {
  return (
    <div className="preview-wrap relative mx-auto w-full max-w-lg" aria-label="Example weekly habit progress">
      <div className="preview-card relative overflow-hidden rounded-3xl border border-card-highlight bg-card/75 p-5 shadow-2xl shadow-primary/15 backdrop-blur-2xl sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">Current streak</p>
            <p className="mt-2 font-display text-4xl font-bold">14 days</p>
          </div>
          <span className="streak-flame grid size-14 place-items-center rounded-xl bg-coral-soft text-coral">
            <Flame className="size-7 fill-current" />
          </span>
        </div>

        <div className="mt-8 space-y-3">
          {previewHabits.map((habit, index) => (
            <div key={habit.name} className="habit-row flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 p-4" style={{ animationDelay: `${350 + index * 120}ms` }}>
              <span className={`grid size-6 shrink-0 place-items-center rounded-md border ${habit.done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"}`}>
                {habit.done && <Check className="size-4 stroke-[3]" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                  <span className="truncate">{habit.name}</span>
                  <span className="text-xs text-muted-foreground">{habit.progress}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <span className="progress-fill block h-full rounded-full bg-primary" style={{ width: habit.progress, animationDelay: `${650 + index * 120}ms` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {[true, true, true, true, true, true, false].map((done, index) => (
            <div key={index} className="text-center">
              <span className={`grid aspect-square place-items-center rounded-md text-xs font-bold ${done ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-muted-foreground"}`}>
                {done ? <Check className="size-3.5 stroke-[3]" /> : index + 15}
              </span>
              <span className="mt-1.5 block text-[10px] font-semibold text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="floating-note absolute -right-2 -top-5 flex items-center gap-2 rounded-lg bg-coral px-3 py-2 text-xs font-bold text-coral-foreground shadow-xl sm:-right-5">
        <Sparkles className="size-3.5" /> Best week yet
      </div>
      <div className="floating-streak absolute -bottom-5 -left-2 flex items-center gap-3 rounded-xl border border-card-highlight bg-ink px-4 py-3 text-ink-foreground shadow-xl sm:-left-6">
        <span className="grid size-8 place-items-center rounded-lg bg-coral text-coral-foreground"><Flame className="size-4 fill-current" /></span>
        <span><strong className="block text-sm">6 of 7</strong><small className="text-ink-muted">days complete</small></span>
      </div>
    </div>
  );
}
