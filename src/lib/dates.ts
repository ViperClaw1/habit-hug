export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

/** Last 7 days, oldest first, ending today. */
export function weekWindow(today = new Date()): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
}

export function dayLabel(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "narrow" });
}

/** Consecutive completed days ending today (or yesterday if today isn't done yet). */
export function currentStreak(dates: Set<string>, today = new Date()): number {
  let cursor = dates.has(toISODate(today)) ? today : addDays(today, -1);
  if (!dates.has(toISODate(cursor))) return 0;
  let streak = 0;
  while (dates.has(toISODate(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
