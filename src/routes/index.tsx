import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, Flame, ListChecks } from "lucide-react";

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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-medium text-primary">Streaky</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-brand-deep sm:text-5xl">
        Small habits, every single day.
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Add the habits that matter, tick them off as you go, and watch a week of progress build
        into a streak you won't want to break.
      </p>

      <div className="mt-8 flex gap-3">
        {signedIn ? (
          <Button size="lg" onClick={() => navigate({ to: "/dashboard" })}>
            Go to my habits
          </Button>
        ) : (
          <>
            <Button size="lg" asChild>
              <Link to="/auth">Get started</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          </>
        )}
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { icon: ListChecks, title: "Add habits", text: "Anything you want to repeat." },
          { icon: CalendarCheck, title: "Check off daily", text: "One tap per day, per habit." },
          { icon: Flame, title: "See your streak", text: "A clear seven-day view." },
        ].map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl bg-card p-5 shadow-sm shadow-primary/5">
            <Icon className="size-5 text-primary" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
