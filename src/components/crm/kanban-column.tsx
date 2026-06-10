"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { formatSar } from "@/lib/utils";
import { useLocale } from "next-intl";
import { OpportunityCard } from "@/components/crm/opportunity-card";
import type { PipelineOpportunity } from "@/lib/crm-types";
import type { OpportunityStage } from "@/generated/prisma/enums";

interface KanbanColumnProps {
  stage: OpportunityStage;
  label: string;
  opportunities: PipelineOpportunity[];
  onCardClick: (opportunity: PipelineOpportunity) => void;
  onAddClick: (stage: OpportunityStage) => void;
}

export function KanbanColumn({
  stage,
  label,
  opportunities,
  onCardClick,
  onAddClick,
}: KanbanColumnProps) {
  const t = useTranslations("crm.board");
  const locale = useLocale();

  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: "column", stage },
  });

  const totalValue = opportunities.reduce(
    (sum, o) => sum + o.estimatedValue,
    0,
  );

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 sm:w-80">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-foreground text-sm font-semibold">{label}</h2>
          <span className="bg-surface-muted text-foreground-muted rounded-full px-2 py-0.5 text-xs font-medium tabular-nums">
            {opportunities.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddClick(stage)}
          className="text-foreground-muted hover:text-foreground focus-visible:ring-ring flex size-7 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={t("addOpportunity")}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      {totalValue > 0 && (
        <p className="text-foreground-muted px-1 text-xs tabular-nums">
          {formatSar(totalValue, locale)}
        </p>
      )}

      <div
        ref={setNodeRef}
        className={cn(
          "border-border bg-surface-muted/60 flex min-h-32 flex-1 flex-col gap-3 rounded-lg border border-dashed p-2 transition-colors",
          isOver && "border-primary bg-info-surface",
        )}
      >
        <SortableContext
          items={opportunities.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onClick={() => onCardClick(opportunity)}
            />
          ))}
        </SortableContext>

        {opportunities.length === 0 && (
          <p className="text-foreground-muted flex flex-1 items-center justify-center p-4 text-center text-xs">
            {t("empty")}
          </p>
        )}
      </div>
    </div>
  );
}
