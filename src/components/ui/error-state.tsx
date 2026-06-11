"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function ErrorState({ error, reset, title, description }: ErrorStateProps) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger-border bg-danger-surface px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface text-danger">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-foreground text-sm font-medium">{title ?? t("errorTitle")}</p>
        <p className="text-foreground-muted text-sm">{description ?? t("errorDescription")}</p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        <RotateCcw aria-hidden="true" />
        {t("retry")}
      </Button>
    </div>
  );
}
