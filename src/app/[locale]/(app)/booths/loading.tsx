import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, SelectSkeleton } from "@/components/ui/page-skeleton";

export default function BoothsLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton />
      <SelectSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </div>
  );
}
