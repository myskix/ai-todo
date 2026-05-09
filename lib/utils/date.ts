/**
 * Format a date string or Date to a readable display string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date to relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 60) return "just now";
  if (Math.abs(diffMin) < 60)
    return diffMin > 0 ? `in ${diffMin}m` : `${Math.abs(diffMin)}m ago`;
  if (Math.abs(diffHr) < 24)
    return diffHr > 0 ? `in ${diffHr}h` : `${Math.abs(diffHr)}h ago`;
  return diffDay > 0 ? `in ${diffDay}d` : `${Math.abs(diffDay)}d ago`;
}

/**
 * Check if a deadline is overdue
 */
export function isOverdue(deadline: string | Date): boolean {
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  return d < new Date();
}

/**
 * Get start and end of current week
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/**
 * Convert ISO string to local date input value (YYYY-MM-DD)
 */
export function toDateInputValue(date?: string): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}
