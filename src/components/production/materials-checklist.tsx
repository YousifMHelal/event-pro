"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { toggleMaterial } from "@/app/[locale]/(app)/production/actions";
import type { MaterialItem } from "@/lib/production-types";

interface MaterialsChecklistProps {
  materials: MaterialItem[];
}

function formatSar(halalas: number, locale: string) {
  const sar = halalas / 100;
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(sar);
}

export function MaterialsChecklist({ materials }: MaterialsChecklistProps) {
  const t = useTranslations("production");
  const locale = useLocale();

  // Optimistic checked state keyed by material id so the progress bar and
  // row visuals update immediately without waiting for a server round-trip.
  const [optimisticChecked, setOptimisticChecked] = useState<Record<string, boolean>>(
    () => Object.fromEntries(materials.map((m) => [m.id, m.isChecked])),
  );

  if (materials.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-foreground-muted">{t("noMaterials")}</p>
    );
  }

  const checkedCount = Object.values(optimisticChecked).filter(Boolean).length;
  const pct = Math.round((checkedCount / materials.length) * 100);

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("materialsProgress")}
          className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200"
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-10 shrink-0 text-end text-xs font-medium tabular-nums text-foreground-muted">
          {pct}%
        </span>
      </div>

      {/* Checklist rows */}
      <ul className="flex flex-col gap-1" aria-label={t("materialsList")}>
        {materials.map((m) => (
          <MaterialRow
            key={m.id}
            material={m}
            isChecked={optimisticChecked[m.id] ?? m.isChecked}
            onToggle={(next) => setOptimisticChecked((prev) => ({ ...prev, [m.id]: next }))}
            locale={locale}
            formatSar={formatSar}
          />
        ))}
      </ul>
    </div>
  );
}

function MaterialRow({
  material,
  isChecked,
  onToggle,
  locale,
  formatSar,
}: {
  material: MaterialItem;
  isChecked: boolean;
  onToggle: (next: boolean) => void;
  locale: string;
  formatSar: (h: number, l: string) => string;
}) {
  const t = useTranslations("production");
  const [pending, startTransition] = useTransition();

  const name = locale === "ar" ? material.nameAr : material.nameEn;
  const unit = locale === "ar" ? material.unitAr : material.unitEn;
  const supplier =
    locale === "ar" ? material.supplierAr : material.supplierEn;
  const totalCost = material.quantity * material.unitCost;

  function handleToggle() {
    const next = !isChecked;
    onToggle(next); // optimistic — update parent state immediately
    startTransition(async () => {
      const result = await toggleMaterial({ materialId: material.id, isChecked: next });
      if (result.error) onToggle(!next); // roll back on failure
    });
  }

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-md border px-3 py-2.5 transition-colors duration-150",
        isChecked
          ? "border-success-border bg-success-surface"
          : "border-border bg-surface",
        pending && "opacity-60",
      )}
    >
      {/* Checkbox */}
      <div className="mt-0.5 shrink-0">
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          aria-label={t("toggleMaterial", { name })}
          disabled={pending}
          onClick={handleToggle}
          className={cn(
            "flex size-5 cursor-pointer items-center justify-center rounded border-2 transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            isChecked
              ? "border-success bg-success"
              : "border-neutral-300 bg-surface hover:border-accent",
          )}
        >
          {isChecked && (
            <svg
              viewBox="0 0 12 10"
              className="size-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1.5 5l3 3 6-6" />
            </svg>
          )}
        </button>
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "text-sm font-medium",
            isChecked ? "text-success line-through" : "text-foreground",
          )}
        >
          {name}
        </span>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-foreground-muted">
          <span>
            {material.quantity} {unit}
          </span>
          <span>·</span>
          <span>{formatSar(material.unitCost, locale)} / {unit}</span>
          {supplier && (
            <>
              <span>·</span>
              <span>{supplier}</span>
            </>
          )}
        </div>
      </div>

      {/* Total cost */}
      <span className="shrink-0 text-xs font-medium tabular-nums text-foreground-muted">
        {formatSar(totalCost, locale)}
      </span>
    </li>
  );
}
