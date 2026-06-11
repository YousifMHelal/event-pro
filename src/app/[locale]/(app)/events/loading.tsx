import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/page-skeleton";

export default function EventsLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <PageHeaderSkeleton withAction />
      <TableSkeleton rows={6} cols={8} />
    </div>
  );
}
