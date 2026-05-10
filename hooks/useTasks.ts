"use client";

import { useCallback } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { Task, Priority, Category } from "@/types";

/**
 * Unified CRUD hook for tasks.
 *
 * - Always updates localStorage via taskStore (Zustand persist)
 * - If user is logged in: also writes to Supabase simultaneously
 */
export function useTasks() {
  const {
    tasks,
    filters,
    isLoading,
    error,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete: storeToggleComplete,
    setFilters,
    clearFilters,
    setLoading,
    setError,
    getFilteredTasks,
  } = useTaskStore();

  const { isAuthenticated } = useAuthStore();
  const supabase = createClient();

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const taskToRow = (t: Task) => ({
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
  });

  // ─── Sync Logic ────────────────────────────────────────────────────────────
  
  /**
   * Fetch tasks from Supabase and sync with local store
   */
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    const { data, error: sbError } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (sbError) {
      setError(sbError.message);
    } else if (data) {
      const formattedTasks: Task[] = data.map((t: any) => ({
        id: t.id,
        user_id: t.user_id,
        title: t.title,
        description: t.description || undefined,
        priority: t.priority,
        category: t.category,
        deadline: t.deadline || undefined,
        timeSuggestion: t.time_suggestion || undefined,
        completed: t.completed,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      }));
      setTasks(formattedTasks);
    }
    setLoading(false);
  }, [isAuthenticated, supabase, setTasks, setLoading, setError]);

  // Sync on mount or when auth state changes
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchTasks();
  //   }
  // }, [isAuthenticated, fetchTasks]);

  // ─── CRUD Operations ───────────────────────────────────────────────────────

  /**
   * Add a task — writes to local store immediately,
   * and to Supabase if authenticated.
   */
  const createTask = useCallback(
    async (task: Task) => {
      addTask(task); // localStorage via Zustand persist

      if (isAuthenticated) {
        const { data: userData } = await supabase.auth.getUser();
        const user_id = userData.user?.id;
        
        const taskWithUser = { ...task, user_id };
        const { error: sbError } = await supabase.from("tasks").insert(taskToRow(taskWithUser as Task));
        if (sbError) setError(sbError.message);
      }

      return task;
    },
    [isAuthenticated, supabase]
  );

  /**
   * Update task fields.
   */
  const patchTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      updateTask(id, updates); // optimistic local update

      if (isAuthenticated) {
        const dbUpdates: Record<string, any> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
        if (updates.timeSuggestion !== undefined) dbUpdates.time_suggestion = updates.timeSuggestion;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        dbUpdates.updated_at = new Date().toISOString();

        const { error: sbError } = await supabase
          .from("tasks")
          .update(dbUpdates)
          .eq("id", id);
        if (sbError) setError(sbError.message);
      }
    },
    [isAuthenticated, supabase]
  );

  /**
   * Delete a task.
   */
  const removeTask = useCallback(
    async (id: string) => {
      deleteTask(id); // optimistic local delete

      if (isAuthenticated) {
        const { error: sbError } = await supabase.from("tasks").delete().eq("id", id);
        if (sbError) setError(sbError.message);
      }
    },
    [isAuthenticated, supabase]
  );

  /**
   * Toggle completed state.
   */
  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const newCompleted = !task.completed;

      storeToggleComplete(id); // optimistic local toggle

      if (isAuthenticated) {
        const { error: sbError } = await supabase
          .from("tasks")
          .update({ completed: newCompleted, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (sbError) setError(sbError.message);
      }
    },
    [isAuthenticated, tasks, supabase]
  );

  return {
    tasks,
    filteredTasks: getFilteredTasks(),
    filters,
    isLoading,
    error,
    setTasks,
    addTask: createTask,
    updateTask: patchTask,
    deleteTask: removeTask,
    toggleComplete,
    setFilters,
    clearFilters,
    fetchTasks,
  };
}
