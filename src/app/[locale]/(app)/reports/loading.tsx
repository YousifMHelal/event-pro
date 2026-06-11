import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, KpiGridSkeleton, TableSkeleton } from "@/components/ui/page-skeleton";

export default function ReportsLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton />
      <KpiGridSkeleton count={3} />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <TableSkeleton rows={6} cols={6} />
    </div>
  );
}
