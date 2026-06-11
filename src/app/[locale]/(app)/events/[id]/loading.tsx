import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, TableSkeleton } from "@/components/ui/page-skeleton";

export default function EventDetailLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-20" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <div className="border-border bg-surface shadow-card grid grid-cols-1 gap-6 rounded-lg border p-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <CardSkeleton height="h-3" />

      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <TableSkeleton rows={4} cols={5} />
    </div>
  );
}
