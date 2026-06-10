"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { BoothGridItem } from "@/lib/booths-types";
import { BOOTH_TILE_CLASSES, BOOTH_DOT_CLASSES } from "@/components/booths/booth-status-styles";
import { BOOTH_STATUSES } from "@/lib/booths-types";

interface BoothFloorGridProps {
  booths: BoothGridItem[];
  selectedBoothId: string | null;
  onSelect: (boothId: string) => void;
}

export function BoothFloorGrid({ booths, selectedBoothId, onSelect }: BoothFloorGridProps) {
  const t = useTranslations("booths");
  const locale = useLocale();

  if (booths.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-foreground-muted">
        {t("empty")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Floor-plan grid: dir is set explicitly so the visual layout follows
          reading direction (columns reverse in RTL) regardless of DOM order. */}
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        role="grid"
        aria-label={t("title")}
      >
        {booths.map((booth) => {
          const code = locale === "ar" ? booth.codeAr : booth.codeEn;
          const isSelected = booth.id === selectedBoothId;

          return (
            <button
              key={booth.id}
              type="button"
              role="gridcell"
              onClick={() => onSelect(booth.id)}
              aria-pressed={isSelected}
              aria-label={t("grid.selectBooth", { code })}
              className={cn(
                "flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 text-center transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                BOOTH_TILE_CLASSES[booth.status],
                isSelected && "ring-2 ring-ring ring-offset-2",
              )}
            >
              <span className="text-base font-semibold tabular-nums">{code}</span>
              <span className="text-xs text-foreground-muted">
                {booth.areaSqm ? t("grid.areaSqm", { area: booth.areaSqm }) : t("grid.noArea")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
        <span className="text-xs font-medium text-foreground-muted">{t("legend")}</span>
        {BOOTH_STATUSES.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("size-2.5 shrink-0 rounded-full", BOOTH_DOT_CLASSES[status])}
            />
            <span className="text-xs text-foreground-muted">{t(`status.${status}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
