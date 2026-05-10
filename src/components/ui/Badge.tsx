import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "accent" | "warning" | "danger" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-800 text-surface-300 border-surface-700",
  primary: "bg-primary-500/15 text-primary-400 border-primary-500/20",
  accent: "bg-accent-500/15 text-accent-400 border-accent-500/20",
  warning: "bg-warning-500/15 text-warning-500 border-warning-500/20",
  danger: "bg-danger-500/15 text-danger-500 border-danger-500/20",
  outline: "bg-transparent text-surface-400 border-surface-600",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        "transition-colors duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
