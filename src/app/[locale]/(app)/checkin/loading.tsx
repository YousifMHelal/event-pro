import { Skeleton } from "@/components/ui/skeleton";

export default function CheckinLoading() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}
