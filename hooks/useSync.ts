"use client";

import { useState, useCallback } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { mergeLocalWithCloud, loadLocalTasks, saveTasksLocally } from "@/lib/utils/sync";
import { Task } from "@/types";

export function useSync() {
  const { tasks, setTasks } = useTaskStore();
  const { isAuthenticated } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  /** Fetch cloud tasks for the current user */
  const fetchCloudTasks = useCallback(async (): Promise<Task[]> => {
    const { data, error: sbError } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (sbError) throw new Error(sbError.message);

    return (data ?? []).map((row: any): Task => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      category: row.category,
      deadline: row.deadline,
      timeSuggestion: row.time_suggestion,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }, []);

  /**
   * Upsert all given tasks to Supabase.
   * Called after merge to push local-only tasks to the cloud.
   */
  const syncToCloud = useCallback(async (tasksToSync: Task[]) => {
    if (!isAuthenticated) return;
    const rows = tasksToSync.map((t) => ({
      id: t.id,
      user_id: t.user_id,
      title: t.title,
      description: t.description ?? null,
      priority: t.priority,
      category: t.category,
      deadline: t.deadline ?? null,
      time_suggestion: t.timeSuggestion ?? null,
      completed: t.completed,
      created_at: t.createdAt,
      updated_at: t.updatedAt,
    }));
    const { error: sbError } = await supabase.from("tasks").upsert(rows, { onConflict: "id" });
    if (sbError) throw new Error(sbError.message);
  }, [isAuthenticated]);

  /**
   * Full sync flow triggered on login:
   * 1. Fetch cloud tasks
   * 2. Merge with localStorage (cloud wins on conflict)
   * 3. Push merged result back to cloud (covers new local tasks)
   * 4. Save merged result to localStorage + Zustand store
   */
  const syncOnLogin = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsSyncing(true);
    setError(null);
    try {
      const cloudTasks = await fetchCloudTasks();
      const localTasks = loadLocalTasks();
      const merged = mergeLocalWithCloud(localTasks, cloudTasks);

      // Push merged back to cloud (covers local-only tasks)
      await syncToCloud(merged);

      // Persist merged state everywhere
      setTasks(merged);
      saveTasksLocally(merged);
      setLastSynced(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, fetchCloudTasks, syncToCloud]);

  return { isSyncing, lastSynced, error, syncOnLogin, syncToCloud };
}
