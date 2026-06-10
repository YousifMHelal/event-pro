"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Circle, Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { advanceProductionStep } from "@/app/[locale]/(app)/production/actions";
import type { ProductionStepItem, ProductionStepStatus } from "@/lib/production-types";

interface WorkflowStepperProps {
  steps: ProductionStepItem[];
  orderId: string;
}

const STEP_TRANSITIONS: Record<ProductionStepStatus, ProductionStepStatus | null> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: null,
  blocked: "in_progress",
};

export function WorkflowStepper({ steps }: WorkflowStepperProps) {
  const t = useTranslations("production");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  // Optimistic status map so the UI updates immediately on click.
  const [optimisticStatuses, setOptimisticStatuses] = useState<
    Record<string, ProductionStepItem["status"]>
  >(() => Object.fromEntries(steps.map((s) => [s.id, s.status])));

  return (
    <ol className="flex flex-col gap-2" aria-label={t("workflow")}>
      {steps.map((step, idx) => (
        <StepRow
          key={step.id}
          step={step}
          optimisticStatus={optimisticStatuses[step.id] ?? step.status}
          onAdvance={(next, prev) =>
            setOptimisticStatuses((m) => {
              const updated = { ...m, [step.id]: next };
              // If this step just completed, also set the next pending step to in_progress
              // visually (server will do the real sync, but this keeps the UX coherent).
              return updated;
            })
          }
          onRollback={(prev) =>
            setOptimisticStatuses((m) => ({ ...m, [step.id]: prev }))
          }
          index={idx}
          t={t}
          Arrow={Arrow}
        />
      ))}
    </ol>
  );
}

function StepRow({
  step,
  optimisticStatus,
  onAdvance,
  onRollback,
  index,
  t,
  Arrow,
}: {
  step: ProductionStepItem;
  optimisticStatus: ProductionStepItem["status"];
  onAdvance: (next: ProductionStepItem["status"], prev: ProductionStepItem["status"]) => void;
  onRollback: (prev: ProductionStepItem["status"]) => void;
  index: number;
  t: ReturnType<typeof useTranslations<"production">>;
  Arrow: typeof ArrowRight;
}) {
  const [pending, startTransition] = useTransition();
  const locale = useLocale();

  const name = locale === "ar" ? step.nameAr : step.nameEn;
  const nextStatus = STEP_TRANSITIONS[optimisticStatus];
  const canAdvance = nextStatus !== null && optimisticStatus !== "completed";

  function handleAdvance() {
    if (!nextStatus) return;
    const prev = optimisticStatus;
    onAdvance(nextStatus, prev);
    startTransition(async () => {
      const result = await advanceProductionStep({ stepId: step.id, toStatus: nextStatus });
      if (result.error) onRollback(prev);
    });
  }

  return (
    <li
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-3 transition-colors duration-150",
        optimisticStatus === "completed" && "border-success-border bg-success-surface",
        optimisticStatus === "in_progress" && "border-info-border bg-info-surface",
        optimisticStatus === "blocked" && "border-danger-border bg-danger-surface",
        optimisticStatus === "pending" && "border-border bg-surface",
      )}
    >
      {/* Step icon */}
      <span className="mt-0.5 shrink-0">
        {optimisticStatus === "completed" && (
          <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
        )}
        {optimisticStatus === "in_progress" && (
          <Loader2 className="size-5 animate-spin text-info" aria-hidden="true" />
        )}
        {optimisticStatus === "blocked" && (
          <AlertCircle className="size-5 text-danger" aria-hidden="true" />
        )}
        {optimisticStatus === "pending" && (
          <Circle className="size-5 text-foreground-muted" aria-hidden="true" />
        )}
      </span>

      {/* Step info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground-muted tabular-nums">
            {index + 1}.
          </span>
          <span
            className={cn(
              "text-sm font-medium",
              optimisticStatus === "completed" && "text-success",
              optimisticStatus === "in_progress" && "text-info",
              optimisticStatus === "blocked" && "text-danger",
              optimisticStatus === "pending" && "text-foreground",
            )}
          >
            {name}
          </span>
        </div>
        {step.notes && (
          <p className="mt-0.5 text-xs text-foreground-muted line-clamp-1">{step.notes}</p>
        )}
      </div>

      {/* Advance button */}
      {canAdvance && (
        <Button
          variant="ghost"
          size="sm"
          loading={pending}
          onClick={handleAdvance}
          aria-label={t("advanceStep", { name })}
          className="shrink-0 text-xs"
        >
          {!pending && <Arrow className="size-3.5" aria-hidden="true" />}
          {optimisticStatus === "pending" && t("startStep")}
          {optimisticStatus === "in_progress" && t("completeStep")}
          {optimisticStatus === "blocked" && t("unblockStep")}
        </Button>
      )}
    </li>
  );
}
