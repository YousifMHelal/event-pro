"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations, useLocale } from "next-intl";
import { Calendar, GripVertical, User } from "lucide-react";
import { formatSar } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PipelineOpportunity } from "@/lib/crm-types";

interface OpportunityCardProps {
  opportunity: PipelineOpportunity;
  onClick: () => void;
}

export function OpportunityCard({
  opportunity,
  onClick,
}: OpportunityCardProps) {
  const t = useTranslations("crm.card");
  const locale = useLocale();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    data: { type: "opportunity", opportunity },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const title = locale === "ar" ? opportunity.titleAr : opportunity.titleEn;
  const clientName =
    locale === "ar" ? opportunity.client.nameAr : opportunity.client.nameEn;
  const ownerName = opportunity.owner
    ? locale === "ar"
      ? opportunity.owner.nameAr
      : opportunity.owner.nameEn
    : t("noOwner");

  const closeDate = opportunity.expectedCloseDate
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-SA", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(opportunity.expectedCloseDate)
    : t("noCloseDate");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-border bg-surface shadow-card group flex flex-col gap-3 rounded-lg border p-4 transition-shadow",
        "hover:shadow-popover",
        isDragging && "ring-ring ring-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={onClick}
          className="text-foreground focus-visible:ring-ring hover:text-primary rounded-sm text-start text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {title}
        </button>
        <button
          type="button"
          className="text-foreground-muted focus-visible:ring-ring -m-1 cursor-grab touch-none rounded-sm p-1 transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
          aria-label={title}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p className="text-foreground-muted text-sm">{clientName}</p>

      <p className="text-foreground text-lg font-semibold tabular-nums">
        {formatSar(opportunity.estimatedValue, locale)}
      </p>

      <div className="text-foreground-muted flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <User className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{ownerName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {t("expectedClose")}: {closeDate}
          </span>
        </div>
      </div>
    </div>
  );
}
