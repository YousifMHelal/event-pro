"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Plus, Ticket } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TicketTypeCard } from "@/components/tickets/ticket-type-card";
import { AddTicketTypeDialog } from "@/components/tickets/add-ticket-type-dialog";
import type { TicketTypeItem, TicketEventOption } from "@/lib/tickets-types";

interface TicketsBoardProps {
  events: TicketEventOption[];
  selectedEventId: string;
  ticketTypes: TicketTypeItem[];
}

export function TicketsBoard({ events, selectedEventId, ticketTypes }: TicketsBoardProps) {
  const t = useTranslations("tickets");
  const locale = useLocale();
  const router = useRouter();

  const [addTypeOpen, setAddTypeOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Event selector + Add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:max-w-xs w-full">
          <Select
            value={selectedEventId}
            onValueChange={(id) => router.push(`/tickets?eventId=${id}`)}
          >
            <SelectTrigger aria-label={t("selectEvent")}>
              <SelectValue placeholder={t("selectEvent")} />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {locale === "ar" ? e.nameAr : e.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEventId && (
          <Button onClick={() => setAddTypeOpen(true)}>
            <Plus aria-hidden="true" />
            {t("addTicketType")}
          </Button>
        )}
      </div>

      {/* Ticket types grid */}
      {ticketTypes.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={selectedEventId ? t("noTypes") : t("selectEventPrompt")}
          action={
            selectedEventId && (
              <Button variant="outline" size="sm" onClick={() => setAddTypeOpen(true)}>
                <Plus aria-hidden="true" />
                {t("addTicketType")}
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ticketTypes.map((tt) => (
            <TicketTypeCard key={tt.id} ticketType={tt} />
          ))}
        </div>
      )}

      {selectedEventId && (
        <AddTicketTypeDialog
          eventId={selectedEventId}
          open={addTypeOpen}
          onOpenChange={setAddTypeOpen}
        />
      )}
    </div>
  );
}
