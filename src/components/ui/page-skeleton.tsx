import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton({ withAction }: { withAction?: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {withAction && <Skeleton className="h-10 w-32" />}
    </div>
  );
}

export function KpiGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-border bg-surface shadow-card flex justify-between rounded-lg border p-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-20" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className, height = "h-72" }: { className?: string; height?: string }) {
  return (
    <div className={cn("border-border bg-surface shadow-card flex flex-col gap-4 rounded-lg border p-5", className)}>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className={cn("w-full", height)} />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="border-border bg-surface shadow-card overflow-hidden rounded-lg border">
      <div className="border-border flex gap-4 border-b px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-border flex items-center gap-4 border-b px-4 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BoardCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-border bg-surface shadow-card flex flex-col gap-3 rounded-lg border p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function KanbanSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex w-72 shrink-0 flex-col gap-3 sm:w-80">
          <Skeleton className="h-5 w-24" />
          <div className="border-border bg-surface-muted/60 flex min-h-32 flex-col gap-3 rounded-lg border border-dashed p-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SelectSkeleton() {
  return <Skeleton className="h-10 w-full sm:max-w-xs" />;
}
