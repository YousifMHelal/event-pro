import { getTranslations } from "next-intl/server";
import { Ticket } from "lucide-react";
import {
  getEventOptionsWithTicketTypes,
  getTicketTypesForEvent,
} from "@/lib/tickets";
import { TicketsBoard } from "@/components/tickets/tickets-board";
import { EmptyState } from "@/components/ui/empty-state";

interface TicketsPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const t = await getTranslations("tickets");
  const { eventId } = await searchParams;

  const events = await getEventOptionsWithTicketTypes();

  // Also fetch all events (not just ones with types) so user can add types to any event
  const { prisma } = await import("@/lib/prisma");
  const allEvents = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: { id: true, nameAr: true, nameEn: true },
  });

  const eventOptions = allEvents;

  const selectedEventId =
    eventId && allEvents.some((e) => e.id === eventId)
      ? eventId
      : (allEvents[0]?.id ?? "");

  const ticketTypes = selectedEventId ? await getTicketTypesForEvent(selectedEventId) : [];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-base text-foreground-muted">{t("subtitle")}</p>
        </div>
      </div>

      {allEvents.length === 0 ? (
        <EmptyState icon={Ticket} title={t("noEvents")} />
      ) : (
        <TicketsBoard
          events={eventOptions}
          selectedEventId={selectedEventId}
          ticketTypes={ticketTypes}
        />
      )}
    </div>
  );
}
