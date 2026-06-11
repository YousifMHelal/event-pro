import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface shadow-card flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-16 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "bg-surface-muted text-primary flex size-12 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        {description && <p className="text-foreground-muted text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
