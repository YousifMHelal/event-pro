import { cn } from "@/lib/utils";

interface RevenueProgressProps {
  collected: string;
  expected: string;
  pct: number;
  className?: string;
}

export function RevenueProgress({ collected, expected, pct, className }: RevenueProgressProps) {
  const clamped = Math.min(100, Math.max(0, pct));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-baseline justify-end gap-2">
        <p className="text-foreground text-sm font-semibold tabular-nums">
          {collected} <span className="text-foreground-muted font-normal">/ {expected}</span>
        </p>
      </div>
      <div
        className="bg-surface-muted h-2 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-success h-full rounded-full transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
