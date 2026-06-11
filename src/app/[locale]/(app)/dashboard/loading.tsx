import { PageHeaderSkeleton, KpiGridSkeleton, CardSkeleton } from "@/components/ui/page-skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton />
      <KpiGridSkeleton count={6} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_496px]">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
