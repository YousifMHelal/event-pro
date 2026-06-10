"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDialog } from "@/components/events/event-dialog";
import type { ClientOption } from "@/lib/crm-types";

export function NewEventButton({ clients }: { clients: ClientOption[] }) {
  const t = useTranslations("events");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" />
        {t("newEvent")}
      </Button>
      <EventDialog open={open} onOpenChange={setOpen} clients={clients} />
    </>
  );
}
