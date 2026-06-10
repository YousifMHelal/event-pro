"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDialog } from "@/components/events/event-dialog";
import { DeleteEventDialog } from "@/components/events/delete-event-dialog";
import type { EventFormValues } from "@/lib/events-types";
import type { ClientOption } from "@/lib/crm-types";

interface EventRowActionsProps {
  event: EventFormValues;
  eventName: string;
  clients: ClientOption[];
  /** Pass the current locale to redirect to /events after delete (profile page). */
  redirectLocale?: string;
}

export function EventRowActions({ event, eventName, clients, redirectLocale }: EventRowActionsProps) {
  const t = useTranslations("common");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t("edit")}
        onClick={() => setEditOpen(true)}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t("delete")}
        className="text-danger hover:bg-danger-surface"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>

      <EventDialog open={editOpen} onOpenChange={setEditOpen} clients={clients} event={event} />
      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        eventId={event.id}
        eventName={eventName}
        redirectLocale={redirectLocale}
      />
    </div>
  );
}
