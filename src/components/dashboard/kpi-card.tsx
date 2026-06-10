import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warn" | "danger" | "info";
  className?: string;
}

const variantStyles: Record<
  NonNullable<KpiCardProps["variant"]>,
  { icon: string; iconBg: string }
> = {
  default: { icon: "text-primary",  iconBg: "bg-info-surface" },
  success: { icon: "text-success",  iconBg: "bg-success-surface" },
  warn:    { icon: "text-warn",     iconBg: "bg-warn-surface" },
  danger:  { icon: "text-danger",   iconBg: "bg-danger-surface" },
  info:    { icon: "text-info",     iconBg: "bg-info-surface" },
};

export function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  variant = "default",
  className,
}: KpiCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "border-border bg-surface shadow-card flex justify-between rounded-lg border p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-5">
        {/* Label + Value stacked */}
        <div className="flex flex-col gap-1">
          <p className="text-foreground-muted text-sm font-medium">{label}</p>
          <p className="text-foreground text-2xl leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        </div>

        {/* Description */}
        <p className="text-foreground-muted text-sm">{description}</p>
      </div>

      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md",
          styles.iconBg,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-4.5 w-4.5", styles.icon)} strokeWidth={1.75} />
      </div>
    </div>
  );
}
