import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { type Task } from "@/types";

export function useAI() {
  const { updateTask } = useTasks();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calls /api/ai/generate to get suggested tasks
  const generateTasks = async (description: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to generate tasks");
      const data = await res.json();
      return data.tasks || [];
    } catch (error) {
      console.error("useAI generateTasks error:", error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  // Calls /api/ai/priority and updates the task
  const assignPriority = async (task: Task) => {
    try {
      const res = await fetch("/api/ai/priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          deadline: task.deadline,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.priority) {
        await updateTask(task.id, { priority: data.priority });
      }
    } catch (error) {
      console.error("useAI assignPriority error:", error);
      // fail silently
    }
  };

  // Calls /api/ai/suggest-time and updates the task
  const suggestTime = async (task: Task) => {
    try {
      const res = await fetch("/api/ai/suggest-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          priority: task.priority,
          deadline: task.deadline,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.suggestion) {
        await updateTask(task.id, { timeSuggestion: data.suggestion });
      }
    } catch (error) {
      console.error("useAI suggestTime error:", error);
      // fail silently
    }
  };

  return {
    generateTasks,
    assignPriority,
    suggestTime,
    isGenerating,
    isProcessing,
  };
}
