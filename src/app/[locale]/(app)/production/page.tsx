import { getTranslations } from "next-intl/server";
import { Clapperboard } from "lucide-react";
import {
  getProductionEventOptions,
  getProductionOrdersForEvent,
} from "@/lib/production";
import { ProductionBoard } from "@/components/production/production-board";

interface ProductionPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function ProductionPage({ searchParams }: ProductionPageProps) {
  const t = await getTranslations("production");
  const { eventId } = await searchParams;

  const events = await getProductionEventOptions();

  const selectedEventId =
    eventId && events.some((e) => e.id === eventId)
      ? eventId
      : (events[0]?.id ?? "");

  const orders = selectedEventId ? await getProductionOrdersForEvent(selectedEventId) : [];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-base text-foreground-muted">{t("subtitle")}</p>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
            <Clapperboard className="size-6" aria-hidden="true" />
          </span>
          <p className="text-sm text-foreground-muted">{t("noEvents")}</p>
        </div>
      ) : (
        <ProductionBoard
          events={events}
          selectedEventId={selectedEventId}
          orders={orders}
        />
      )}
    </div>
  );
}
