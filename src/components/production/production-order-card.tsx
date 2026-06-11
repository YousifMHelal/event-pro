"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronDown,
  ChevronUp,
  CalendarClock,
  Layers,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/production/production-status-badge";
import { WorkflowStepper } from "@/components/production/workflow-stepper";
import { MaterialsChecklist } from "@/components/production/materials-checklist";
import type { ProductionOrderItem } from "@/lib/production-types";

interface ProductionOrderCardProps {
  order: ProductionOrderItem;
}

function formatDate(date: Date | null, locale: string) {
  if (!date) return null;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function ProductionOrderCard({ order }: ProductionOrderCardProps) {
  const t = useTranslations("production");
  const locale = useLocale();
  const [section, setSection] = useState<"steps" | "materials" | null>("steps");

  const name = locale === "ar" ? order.titleAr : order.titleEn;
  const description = locale === "ar" ? order.descriptionAr : order.descriptionEn;

  const completedSteps = order.steps.filter((s) => s.status === "completed").length;
  const totalSteps = order.steps.length;
  const stepPct = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const checkedMaterials = order.materials.filter((m) => m.isChecked).length;
  const totalMaterials = order.materials.length;

  const dueDate = formatDate(order.dueDate, locale);

  const orderStatusLabel = t(`orderStatus.${order.status}`);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-5 pb-4 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{name}</h3>
            <OrderStatusBadge status={order.status} label={orderStatusLabel} />
          </div>
          {description && (
            <p className="mt-1 text-sm text-foreground-muted line-clamp-2">{description}</p>
          )}
          {dueDate && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-foreground-muted">
              <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{t("dueDate", { date: dueDate })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Overall progress bars */}
      <div className="grid grid-cols-1 gap-4 border-t border-border px-4 py-3 sm:grid-cols-2 sm:px-5">
        <ProgressMini
          label={t("stepsProgress", { done: completedSteps, total: totalSteps })}
          pct={stepPct}
          color="bg-primary"
        />
        {totalMaterials > 0 && (
          <ProgressMini
            label={t("materialsProgress2", {
              done: checkedMaterials,
              total: totalMaterials,
            })}
            pct={totalMaterials ? Math.round((checkedMaterials / totalMaterials) * 100) : 0}
            color="bg-accent"
          />
        )}
      </div>

      {/* Section tabs */}
      <div className="flex border-t border-border">
        <SectionTab
          active={section === "steps"}
          onClick={() => setSection(section === "steps" ? null : "steps")}
          icon={<Layers className="size-4" aria-hidden="true" />}
          label={t("workflowTab")}
          count={`${completedSteps}/${totalSteps}`}
          expanded={section === "steps"}
        />
        {totalMaterials > 0 && (
          <SectionTab
            active={section === "materials"}
            onClick={() => setSection(section === "materials" ? null : "materials")}
            icon={<Package className="size-4" aria-hidden="true" />}
            label={t("materialsTab")}
            count={`${checkedMaterials}/${totalMaterials}`}
            expanded={section === "materials"}
          />
        )}
      </div>

      {/* Expandable body */}
      {section === "steps" && (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <WorkflowStepper steps={order.steps} orderId={order.id} />
        </div>
      )}
      {section === "materials" && (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <MaterialsChecklist materials={order.materials} />
        </div>
      )}
    </article>
  );
}

function ProgressMini({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-foreground-muted">{label}</span>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-300 ease-out", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function SectionTab({
  active,
  onClick,
  icon,
  label,
  count,
  expanded,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: string;
  expanded: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        "flex flex-1 cursor-pointer items-center justify-between gap-2 px-3 py-3 text-sm transition-colors duration-150 sm:px-5",
        "focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-surface-muted font-medium text-primary"
          : "text-foreground-muted hover:bg-neutral-50",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
        <span className="shrink-0 rounded-full bg-neutral-200 px-1.5 py-0.5 text-xs font-medium tabular-nums text-foreground-muted">
          {count}
        </span>
      </span>
      {expanded ? (
        <ChevronUp className="size-4 shrink-0" aria-hidden="true" />
      ) : (
        <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}
