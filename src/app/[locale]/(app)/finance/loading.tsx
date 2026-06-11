import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, KpiGridSkeleton, TableSkeleton } from "@/components/ui/page-skeleton";

export default function FinanceLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton />
      <KpiGridSkeleton count={4} />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-md" />
        ))}
      </div>
      <TableSkeleton rows={6} cols={9} />
    </div>
  );
}
