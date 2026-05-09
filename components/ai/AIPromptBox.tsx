"use client";

import { useState } from "react";
import { useAI } from "@/hooks/useAI";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { format, parseISO } from "date-fns";
import type { Task, Priority, Category } from "@/types";

interface SuggestedTask {
  title: string;
  description?: string;
  suggestedCategory: string;
  suggestedPriority: string;
  suggestedDeadline?: string;
  selected: boolean;
}

export function AIPromptBox() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const { generateTasks, isGenerating } = useAI();
  const { addTask } = useTasks();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const results = await generateTasks(prompt);
    if (results && results.length > 0) {
      setSuggestions(
        results.map((r: { title: string; description?: string; suggestedCategory?: string; suggestedPriority?: string; suggestedDeadline?: string }) => ({
          title: r.title,
          description: r.description,
          suggestedCategory: r.suggestedCategory || "other",
          suggestedPriority: r.suggestedPriority || "medium",
          suggestedDeadline: r.suggestedDeadline,
          selected: true,
        }))
      );
    }
  };

  const toggleSelection = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleAddSelected = async () => {
    const selectedTasks = suggestions.filter((s) => s.selected);

    for (const st of selectedTasks) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: st.title,
        description: st.description,
        category: st.suggestedCategory as Category,
        priority: st.suggestedPriority as Priority,
        deadline: st.suggestedDeadline,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addTask(newTask);
    }

    setSuggestions([]);
    setPrompt("");
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl overflow-hidden mb-6 shadow-lg shadow-black/20 transition-all">
      <form onSubmit={handleGenerate} className="flex items-center p-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you need to do... AI will create tasks for you"
          className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted focus:outline-none"
          disabled={isGenerating || suggestions.length > 0}
        />
        {suggestions.length === 0 && (
          <Button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            isLoading={isGenerating}
            className="rounded-xl px-4"
          >
            {!isGenerating && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
            )}
            <span className="hidden sm:inline ml-1">Generate</span>
          </Button>
        )}
      </form>

      {/* Suggested Tasks Preview */}
      {suggestions.length > 0 && (
        <div className="border-t border-border bg-background/50 p-4 animate-in fade-in slide-in-from-top-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between">
            <span>AI Suggested Tasks</span>
            <span className="text-muted font-normal text-xs">{suggestions.filter(s => s.selected).length} selected</span>
          </h4>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {suggestions.map((task, idx) => (
              <div
                key={idx}
                onClick={() => toggleSelection(idx)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  task.selected
                    ? "bg-accent/10 border-accent/40"
                    : "bg-card border-border opacity-60"
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    task.selected ? "bg-accent border-accent text-white" : "border-muted"
                  }`}
                >
                  {task.selected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-muted truncate mt-0.5">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="category" type={task.suggestedCategory}>
                      {task.suggestedCategory}
                    </Badge>
                    <Badge variant="priority" type={task.suggestedPriority}>
                      {task.suggestedPriority}
                    </Badge>
                    {task.suggestedDeadline && (
                      <span className="text-[10px] text-accent font-medium flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {format(parseISO(task.suggestedDeadline), "d MMM, HH:mm")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
            <Button variant="ghost" size="sm" onClick={() => { setSuggestions([]); setPrompt(""); }}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddSelected}
              disabled={suggestions.filter((s) => s.selected).length === 0}
            >
              Add Selected Tasks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
