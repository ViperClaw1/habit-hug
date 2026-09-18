import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addDays, toISODate } from "@/lib/dates";

export type Habit = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

export type Completion = {
  id: string;
  habit_id: string;
  completed_on: string;
};

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async (): Promise<Habit[]> => {
      const { data, error } = await supabase
        .from("habits")
        .select("id, name, color, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Completions for the last 60 days — enough for the week view and streaks. */
export function useCompletions() {
  const since = toISODate(addDays(new Date(), -60));
  return useQuery({
    queryKey: ["completions", since],
    queryFn: async (): Promise<Completion[]> => {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("id, habit_id, completed_on")
        .gte("completed_on", since);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAddHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("You need to be signed in.");
      const { error } = await supabase
        .from("habits")
        .insert({ name, color, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase.from("habits").delete().eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habits"] });
      qc.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}

export function useToggleCompletion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      done,
    }: {
      habitId: string;
      date: string;
      done: boolean;
    }) => {
      if (done) {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_on", date);
        if (error) throw error;
        return;
      }
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("You need to be signed in.");
      const { error } = await supabase
        .from("habit_completions")
        .insert({ habit_id: habitId, completed_on: date, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["completions"] }),
  });
}
