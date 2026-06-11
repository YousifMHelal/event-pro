"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 md:p-8">
      <ErrorState error={error} reset={reset} />
    </div>
  );
}
