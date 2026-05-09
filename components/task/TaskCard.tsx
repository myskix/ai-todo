import { motion } from "framer-motion";
import { type Task } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { AISuggestionChip } from "@/components/ai/AISuggestionChip";
import { formatDate } from "@/lib/utils/date";

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? "bg-card/50 border-border/50 opacity-60"
          : "bg-card border-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle?.(task.id)}
        className="mt-1 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-accent border-accent text-white"
              : "border-muted hover:border-accent"
          }`}
        >
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3
            className={`text-base font-medium truncate ${
              task.completed ? "text-muted line-through" : "text-foreground"
            }`}
          >
            {task.title}
          </h3>
          <Badge variant="priority" type={task.priority}>
            {task.priority}
          </Badge>
          <Badge variant="category" type={task.category}>
            {task.category}
          </Badge>
        </div>

        {task.description && (
          <p className="text-sm text-muted mt-1 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          {task.deadline && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(task.deadline)}
            </span>
          )}

          {task.timeSuggestion && (
            <AISuggestionChip suggestion={task.timeSuggestion} />
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute top-3 right-3 sm:static sm:opacity-100">
        <button
          onClick={() => onEdit?.(task)}
          className="p-1.5 text-muted hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Edit task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete?.(task.id)}
          className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
          aria-label="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
