"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import { useTaskStore } from "@/store/taskStore";
import { Task } from "@/types";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { tasks, toggleComplete } = useTaskStore();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const today = startOfDay(new Date());

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;

      // Find tasks for this day
      const dayTasks = tasks.filter((t) => {
        if (!t.deadline) return false;
        return isSameDay(parseISO(t.deadline), cloneDay);
      });

      const hasTasks = dayTasks.length > 0;
      const hasOverdue = dayTasks.some(
        (t) => !t.completed && isBefore(startOfDay(parseISO(t.deadline!)), today)
      );

      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isToday = isSameDay(day, today);

      days.push(
        <div
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
          className={`relative min-h-[80px] p-2 border border-border/50 cursor-pointer transition-colors
            ${!isCurrentMonth ? "text-muted-foreground bg-muted/10" : "bg-card hover:bg-accent/5"}
            ${isSelected ? "ring-2 ring-accent ring-inset" : ""}
          `}
        >
          <div className="flex justify-between items-start">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                ${isToday ? "bg-accent text-white shadow-sm shadow-accent/50" : ""}
                ${!isToday && isCurrentMonth ? "text-foreground" : ""}
                ${!isCurrentMonth ? "text-muted" : ""}
              `}
            >
              {formattedDate}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {dayTasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className={`w-2 h-2 rounded-full shadow-sm ${
                  t.completed
                    ? "bg-green-500/50"
                    : isBefore(startOfDay(parseISO(t.deadline!)), today)
                    ? "bg-red-500"
                    : "bg-accent"
                }`}
                title={t.title}
              />
            ))}
            {dayTasks.length > 3 && (
              <span className="text-[10px] text-muted font-medium">+{dayTasks.length - 3}</span>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  // Selected date tasks
  const selectedDateTasks = selectedDate
    ? tasks.filter((t) => t.deadline && isSameDay(parseISO(t.deadline), selectedDate))
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Calendar Main Area */}
      <div className="flex-1 w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-muted/20 rounded-lg transition-colors text-muted hover:text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium bg-muted/10 hover:bg-muted/20 rounded-lg transition-colors text-foreground"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-muted/20 rounded-lg transition-colors text-muted hover:text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div key={dayName} className="py-3 text-center text-xs font-semibold text-muted uppercase tracking-wider">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-col bg-border gap-px">
          {rows}
        </div>
      </div>

      {/* Side Panel for Selected Date Tasks */}
      {selectedDate && (
        <div className="w-full lg:w-80 bg-card border border-border rounded-xl p-4 shadow-sm shrink-0 sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{format(selectedDate, "MMM d, yyyy")}</h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-1 rounded-md text-muted hover:text-foreground hover:bg-muted/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedDateTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <p className="text-sm">No tasks for this day.</p>
              </div>
            ) : (
              selectedDateTasks.map((task) => (
                <div key={task.id} className="flex gap-3 items-start p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/10 transition-colors">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-muted hover:border-accent"
                    }`}
                  >
                    {task.completed && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? "text-muted line-through" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    {task.priority && (
                      <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        task.priority === "high" ? "bg-red-500/10 text-red-500" :
                        task.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
