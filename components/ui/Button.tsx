import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20",
  ghost: "bg-transparent text-muted hover:text-foreground hover:bg-white/5",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {isLoading && <Spinner className="w-4 h-4 border-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
