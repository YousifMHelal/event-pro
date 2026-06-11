import { getTranslations } from "next-intl/server";
import { Clapperboard } from "lucide-react";
import {
  getProductionEventOptions,
  getProductionOrdersForEvent,
} from "@/lib/production";
import { ProductionBoard } from "@/components/production/production-board";
import { EmptyState } from "@/components/ui/empty-state";

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
        <EmptyState icon={Clapperboard} title={t("noEvents")} />
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
