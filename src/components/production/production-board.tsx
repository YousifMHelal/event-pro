"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductionOrderCard } from "@/components/production/production-order-card";
import type { ProductionOrderItem, ProductionEventOption } from "@/lib/production-types";

interface ProductionBoardProps {
  events: ProductionEventOption[];
  selectedEventId: string;
  orders: ProductionOrderItem[];
}

export function ProductionBoard({ events, selectedEventId, orders }: ProductionBoardProps) {
  const t = useTranslations("production");
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {/* Event selector */}
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <Select
          value={selectedEventId}
          onValueChange={(id) => router.push(`/production?eventId=${id}`)}
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

      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title={t("noOrders")} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
          {orders.map((order) => (
            <ProductionOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
