import { type ReactNode } from "react";

type Priority = "high" | "medium" | "low";
type Category = "work" | "personal" | "health" | "learning" | "other";

interface BadgeProps {
  children: ReactNode;
  variant?: "priority" | "category";
  type?: Priority | Category | string;
  className?: string;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const categoryColors: Record<string, string> = {
  work: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  personal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  health: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  learning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function Badge({ children, variant = "category", type = "other", className = "" }: BadgeProps) {
  let colors = "bg-white/5 text-muted border-white/10"; // default fallback

  if (variant === "priority") {
    colors = priorityColors[type as string] || colors;
  } else if (variant === "category") {
    colors = categoryColors[type as string] || colors;
  }

  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border",
        colors,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
