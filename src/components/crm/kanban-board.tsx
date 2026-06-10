"use client";

import * as React from "react";
import { useState, useTransition, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useTranslations, useLocale } from "next-intl";
import { KanbanColumn } from "@/components/crm/kanban-column";
import { OpportunityCard } from "@/components/crm/opportunity-card";
import { OpportunityDialog } from "@/components/crm/opportunity-dialog";
import { moveOpportunityStage } from "@/app/[locale]/(app)/clients/actions";
import {
  PIPELINE_STAGES,
  type PipelineOpportunity,
  type ClientOption,
  type OwnerOption,
} from "@/lib/crm-types";
import type { OpportunityStage } from "@/generated/prisma/enums";

interface KanbanBoardProps {
  opportunities: PipelineOpportunity[];
  clients: ClientOption[];
  owners: OwnerOption[];
}

// Mirror left/right arrow keys for RTL so keyboard reordering follows
// the visual reading direction instead of raw coordinate deltas.
function createRtlAwareCoordinateGetter(
  isRtl: boolean,
): KeyboardCoordinateGetter {
  return (event, args) => {
    if (!isRtl) {
      return sortableKeyboardCoordinates(event, args);
    }

    let mirroredEvent = event;
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      mirroredEvent = new KeyboardEvent("keydown", {
        code: event.code === "ArrowLeft" ? "ArrowRight" : "ArrowLeft",
        key: event.code === "ArrowLeft" ? "ArrowRight" : "ArrowLeft",
      });
    }

    return sortableKeyboardCoordinates(mirroredEvent, args);
  };
}

export function KanbanBoard({
  opportunities: initialOpportunities,
  clients,
  owners,
}: KanbanBoardProps) {
  const t = useTranslations("crm.board");
  const tStages = useTranslations("crm.stages");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [activeOpportunity, setActiveOpportunity] =
    useState<PipelineOpportunity | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<
    PipelineOpportunity | undefined
  >(undefined);
  const [createStage, setCreateStage] = useState<OpportunityStage>("lead");

  // Re-sync local state when fresh data arrives from the server
  // (e.g. after revalidation following a stage move).
  const [prevInitial, setPrevInitial] = useState(initialOpportunities);
  if (initialOpportunities !== prevInitial) {
    setPrevInitial(initialOpportunities);
    setOpportunities(initialOpportunities);
  }

  const coordinateGetter = useMemo(
    () => createRtlAwareCoordinateGetter(isRtl),
    [isRtl],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  const columns = useMemo(() => {
    const grouped: Record<OpportunityStage, PipelineOpportunity[]> = {
      lead: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    };
    for (const o of opportunities) {
      grouped[o.stage].push(o);
    }
    return grouped;
  }, [opportunities]);

  function handleDragStart(event: DragStartEvent) {
    const opp = opportunities.find((o) => o.id === event.active.id);
    setActiveOpportunity(opp ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveOpportunity(null);
    if (!over) return;

    const activeOpp = opportunities.find((o) => o.id === active.id);
    if (!activeOpp) return;

    // Dropping on another card means landing in that card's column;
    // dropping directly on a column targets that column.
    const overData = over.data.current;
    const targetStage: OpportunityStage =
      overData?.type === "column"
        ? (overData.stage as OpportunityStage)
        : (overData?.opportunity as PipelineOpportunity)?.stage;

    if (!targetStage || targetStage === activeOpp.stage) return;

    const previousStage = activeOpp.stage;

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === activeOpp.id ? { ...o, stage: targetStage } : o,
      ),
    );

    const title = isRtl ? activeOpp.titleAr : activeOpp.titleEn;
    setAnnouncement(
      t("moveAnnouncement", { title, stage: tStages(targetStage) }),
    );

    startTransition(async () => {
      const result = await moveOpportunityStage({
        opportunityId: activeOpp.id,
        stage: targetStage,
      });
      if (result.error) {
        // Revert on failure
        setOpportunities((prev) =>
          prev.map((o) =>
            o.id === activeOpp.id ? { ...o, stage: previousStage } : o,
          ),
        );
        setAnnouncement(t("moveError"));
      }
    });
  }

  function handleCardClick(opportunity: PipelineOpportunity) {
    setEditingOpportunity(opportunity);
    setDialogOpen(true);
  }

  function handleAddClick(stage: OpportunityStage) {
    setEditingOpportunity(undefined);
    setCreateStage(stage);
    setDialogOpen(true);
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <DndContext
        id="opportunity-pipeline"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              label={tStages(stage)}
              opportunities={columns[stage]}
              onCardClick={handleCardClick}
              onAddClick={handleAddClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOpportunity ? (
            <OpportunityCard
              opportunity={activeOpportunity}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Live region for screen-reader announcements of stage moves */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clients={clients}
        owners={owners}
        opportunity={editingOpportunity}
        defaultStage={createStage}
      />
    </div>
  );
}
