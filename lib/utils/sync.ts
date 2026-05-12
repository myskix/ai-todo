import { Task } from "@/types";

// ─── Local Storage Helpers ────────────────────────────────────────────────────

const STORAGE_KEY = "kynda-do:tasks";

export function saveTasksLocally(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadLocalTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

// ─── Merge Logic ──────────────────────────────────────────────────────────────

/**
 * Merges local tasks with cloud tasks.
 *
 * Rules:
 * - Cloud wins on conflict (same id, cloud has a newer or equal updatedAt)
 * - Local-only tasks (no matching cloud id) are included as-is so they can
 *   be pushed to the cloud afterwards.
 */
export function mergeLocalWithCloud(localTasks: Task[], cloudTasks: Task[]): Task[] {
  const cloudMap = new Map<string, Task>(cloudTasks.map((t) => [t.id, t]));
  const merged = new Map<string, Task>();

  // Start with all cloud tasks (cloud wins)
  for (const task of cloudTasks) {
    merged.set(task.id, task);
  }

  // Add local tasks that are NOT in the cloud (new local tasks)
  for (const task of localTasks) {
    if (!cloudMap.has(task.id)) {
      merged.set(task.id, task);
    }
    // If the same id exists in cloud but local is newer — cloud still wins per spec
  }

  // Sort by createdAt descending (newest first)
  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * @deprecated Use mergeLocalWithCloud instead.
 * Kept for backward compat with useSync.ts
 */
export function mergeTasks(local: Task[], remote: Task[]): Task[] {
  return mergeLocalWithCloud(local, remote);
}

// ─── Serialization helpers (kept for compat) ─────────────────────────────────

export function serializeTasks(tasks: Task[]): string {
  return JSON.stringify(tasks);
}

export function deserializeTasks(raw: string): Task[] {
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}
