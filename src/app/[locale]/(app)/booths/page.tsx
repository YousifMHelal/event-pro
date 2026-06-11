import { getTranslations } from "next-intl/server";
import { Store } from "lucide-react";
import {
  getEventOptionsWithBooths,
  getBoothsForEvent,
  getClientOptionsForBooths,
} from "@/lib/booths";
import { BoothsBoard } from "@/components/booths/booths-board";
import { EmptyState } from "@/components/ui/empty-state";

interface BoothsPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function BoothsPage({ searchParams }: BoothsPageProps) {
  const t = await getTranslations("booths");
  const { eventId } = await searchParams;

  const [events, clients] = await Promise.all([
    getEventOptionsWithBooths(),
    getClientOptionsForBooths(),
  ]);

  const selectedEventId = eventId && events.some((e) => e.id === eventId)
    ? eventId
    : (events[0]?.id ?? "");

  const booths = selectedEventId ? await getBoothsForEvent(selectedEventId) : [];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-base text-foreground-muted">{t("subtitle")}</p>
      </div>

      {events.length === 0 ? (
        <EmptyState icon={Store} title={t("noEvents")} />
      ) : (
        <BoothsBoard
          events={events}
          selectedEventId={selectedEventId}
          booths={booths}
          clients={clients}
        />
      )}
    </div>
  );
}
