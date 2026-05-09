import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, Priority, Category } from "@/types";

interface TaskFilters {
  priority?: Priority;
  category?: Category;
  completed?: boolean;
  search?: string;
}

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      filters: {},
      isLoading: false,
      error: null,

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      clearFilters: () => set({ filters: {} }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return tasks.filter((task) => {
          if (filters.priority && task.priority !== filters.priority) return false;
          if (filters.category && task.category !== filters.category) return false;
          if (filters.completed !== undefined && task.completed !== filters.completed)
            return false;
          if (
            filters.search &&
            !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !task.description?.toLowerCase().includes(filters.search.toLowerCase())
          )
            return false;
          return true;
        });
      },
    }),
    {
      name: "ai-todo:tasks",
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
