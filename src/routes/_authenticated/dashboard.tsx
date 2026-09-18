import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Check, Flame, LogOut, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddHabit,
  useCompletions,
  useDeleteHabit,
  useHabits,
  useToggleCompletion,
} from "@/hooks/useHabits";
import { currentStreak, dayLabel, toISODate, weekWindow } from "@/lib/dates";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your habits — Streaky" },
      {
        name: "description",
        content: "Add habits, check them off each day, and watch your weekly streaks grow.",
      },
      { property: "og:title", content: "Your habits — Streaky" },
      {
        property: "og:description",
        content: "Add habits, check them off each day, and watch your weekly streaks grow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const habits = useHabits();
  const completions = useCompletions();
  const addHabit = useAddHabit();
  const deleteHabit = useDeleteHabit();
  const toggle = useToggleCompletion();
  const [name, setName] = useState("");

  const week = useMemo(() => weekWindow(), []);
  const today = toISODate(new Date());

  const byHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions.data ?? []) {
      if (!map.has(c.habit_id)) map.set(c.habit_id, new Set());
      map.get(c.habit_id)!.add(c.completed_on);
    }
    return map;
  }, [completions.data]);

  const doneToday = (habits.data ?? []).filter((h) => byHabit.get(h.id)?.has(today)).length;
  const total = habits.data?.length ?? 0;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addHabit.mutate(
      { name: trimmed, color: "primary" },
      {
        onSuccess: () => setName(""),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Streaky</p>
          <h1 className="text-2xl font-bold tracking-tight text-brand-deep">Today</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <Card className="mt-6 border-none bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <CardContent className="flex items-baseline gap-3 py-5">
          <span className="text-4xl font-bold">{doneToday}</span>
          <span className="text-sm opacity-90">
            of {total} {total === 1 ? "habit" : "habits"} done today
          </span>
        </CardContent>
      </Card>

      <form onSubmit={onAdd} className="mt-6 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a habit, e.g. Read 20 pages"
          className="bg-card"
          maxLength={60}
        />
        <Button type="submit" disabled={addHabit.isPending}>
          <Plus className="size-4" /> Add
        </Button>
      </form>

      <section className="mt-8 space-y-3">
        {habits.isLoading || completions.isLoading ? (
          <>
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </>
        ) : total === 0 ? (
          <Card className="border-dashed bg-card/60 shadow-none">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No habits yet. Add your first one above.
            </CardContent>
          </Card>
        ) : (
          habits.data!.map((habit) => {
            const dates = byHabit.get(habit.id) ?? new Set<string>();
            const streak = currentStreak(dates);
            return (
              <Card key={habit.id} className="border-none shadow-sm shadow-primary/5">
                <CardContent className="py-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{habit.name}</h2>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                        <Flame className="size-3.5" />
                        {streak} day{streak === 1 ? "" : "s"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${habit.name}`}
                        onClick={() => deleteHabit.mutate(habit.id)}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-7 gap-2">
                    {week.map((day) => {
                      const iso = toISODate(day);
                      const done = dates.has(iso);
                      const isToday = iso === today;
                      return (
                        <button
                          key={iso}
                          type="button"
                          aria-label={`${habit.name} on ${iso}`}
                          aria-pressed={done}
                          onClick={() =>
                            toggle.mutate(
                              { habitId: habit.id, date: iso, done },
                              { onError: (error) => toast.error(error.message) },
                            )
                          }
                          className={[
                            "flex flex-col items-center gap-1.5 rounded-xl py-2 transition-colors",
                            done ? "bg-primary/10" : "hover:bg-muted",
                          ].join(" ")}
                        >
                          <span className="text-[11px] uppercase text-muted-foreground">
                            {dayLabel(day)}
                          </span>
                          <span
                            className={[
                              "flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                              done
                                ? "border-transparent bg-primary text-primary-foreground"
                                : isToday
                                  ? "border-primary text-primary"
                                  : "border-border text-muted-foreground",
                            ].join(" ")}
                          >
                            {done ? <Check className="size-4" /> : day.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>
    </main>
  );
}
