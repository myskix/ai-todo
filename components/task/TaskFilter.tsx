import type { Priority, Category } from "@/types";

interface TaskFilterProps {
  filters: {
    completed?: boolean;
    category?: Category;
    priority?: Priority;
  };
  onFilterChange: (filters: { completed?: boolean; category?: Category; priority?: Priority }) => void;
  onClear: () => void;
}

const PRIORITIES: Priority[] = ["high", "medium", "low"];
const CATEGORIES: Category[] = ["work", "personal", "health", "learning", "other"];

export function TaskFilter({ filters, onFilterChange, onClear }: TaskFilterProps) {
  const isFiltered = filters.completed !== undefined || filters.category || filters.priority;

  return (
    <div className="space-y-4 mb-6">
      {/* Tabs for Active/Completed */}
      <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
        {[
          { label: "All", value: undefined },
          { label: "Active", value: false },
          { label: "Completed", value: true },
        ].map((tab) => {
          const isActive = filters.completed === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => onFilterChange({ ...filters, completed: tab.value })}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-accent/20 text-accent"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pills for Category and Priority */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  category: isActive ? undefined : cat,
                })
              }
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted border-border hover:border-muted"
              }`}
            >
              {cat}
            </button>
          );
        })}

        <div className="w-px h-4 bg-border mx-1" />

        {PRIORITIES.map((pri) => {
          const isActive = filters.priority === pri;
          return (
            <button
              key={pri}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  priority: isActive ? undefined : pri,
                })
              }
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted border-border hover:border-muted"
              }`}
            >
              {pri}
            </button>
          );
        })}

        {isFiltered && (
          <button
            onClick={onClear}
            className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
