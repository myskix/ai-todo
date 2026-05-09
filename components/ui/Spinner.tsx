interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-[2px]",
  md: "w-6 h-6 border-[2px]",
  lg: "w-8 h-8 border-[3px]",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      className={[
        "inline-block border-current border-t-transparent rounded-full animate-spin text-accent",
        sizeClasses[size],
        className,
      ].join(" ")}
      role="status"
      aria-label="Loading"
    />
  );
}
