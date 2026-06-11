import { Skeleton } from "@/components/ui/skeleton";

export default function PortalLoading() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-card">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
  );
}
