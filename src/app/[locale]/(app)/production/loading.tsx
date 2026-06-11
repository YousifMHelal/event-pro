import { PageHeaderSkeleton, SelectSkeleton, BoardCardsSkeleton } from "@/components/ui/page-skeleton";

export default function ProductionLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton />
      <SelectSkeleton />
      <BoardCardsSkeleton count={4} />
    </div>
  );
}
