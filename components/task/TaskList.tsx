import type { Task } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-24 h-24 mb-6 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent/50">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-foreground mb-2">No tasks yet</p>
        <p className="text-sm text-muted max-w-sm">
          Let AI help you get started, or add a task manually using the button below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
