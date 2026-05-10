"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { TaskList } from "@/components/task/TaskList";
import { TaskFilter } from "@/components/task/TaskFilter";
import { TaskForm } from "@/components/task/TaskForm";
import { Modal } from "@/components/ui/Modal";
import { AIPromptBox } from "@/components/ai/AIPromptBox";
import { type Task } from "@/types";

export default function DashboardPage() {
  const {
    filteredTasks,
    filters,
    isLoading,
    setFilters,
    clearFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    fetchTasks,
  } = useTasks();

  const { isAuthenticated } = useAuth();

  // Sync tasks when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const handleOpenModal = (task?: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTaskToEdit(undefined);
    setIsModalOpen(false);
  };

  const handleSubmitTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">) => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, data);
    } else {
      await addTask({
        ...data,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    handleCloseModal();
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Manage your tasks and schedule</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-2xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-foreground">{filteredTasks.length + (isLoading ? 0 : 0)}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Completed</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-emerald-500">{filteredTasks.filter(t => t.completed).length}</p>
            <p className="text-xs text-muted">Done</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Pending</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-accent">{filteredTasks.filter(t => !t.completed).length}</p>
            <p className="text-xs text-muted">To do</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">High Priority</p>
          <p className="text-2xl font-bold text-red-500">{filteredTasks.filter(t => !t.completed && t.priority === "high").length}</p>
        </div>
      </div>

      {/* AI Prompt Box Placeholder */}
      <AIPromptBox />

      {/* Filters */}
      <TaskFilter
        filters={filters}
        onFilterChange={setFilters}
        onClear={clearFilters}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onToggle={toggleComplete}
        onEdit={handleOpenModal}
        onDelete={deleteTask}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 md:bottom-8 right-6 md:right-8 w-14 h-14 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background z-30"
        aria-label="Add Task"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={taskToEdit ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initialData={taskToEdit}
          onSubmit={handleSubmitTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
