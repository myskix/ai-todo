import { useState, useEffect } from "react";
import type { Task, Priority, Category } from "@/types";
import { Button } from "@/components/ui/Button";

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const CATEGORIES: Category[] = ["work", "personal", "health", "learning", "other"];

export function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "medium");
  const [category, setCategory] = useState<Category>(initialData?.category || "other");
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? initialData.deadline.split("T")[0] : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-muted mb-1.5">
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 transition-colors"
          placeholder="What needs to be done?"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-muted mb-1.5">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/60 transition-colors resize-none"
          placeholder="Add more details..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-muted mb-1.5">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent/60 transition-colors appearance-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-muted mb-1.5">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent/60 transition-colors appearance-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-muted mb-1.5">
          Deadline (optional)
        </label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-accent/60 transition-colors [color-scheme:dark]"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Save Changes" : "Add Task"}
        </Button>
      </div>
    </form>
  );
}
