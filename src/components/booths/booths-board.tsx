"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoothFloorGrid } from "@/components/booths/booth-floor-grid";
import { BoothDetailPanel } from "@/components/booths/booth-detail-panel";
import type { BoothGridItem, BoothEventOption, BoothClientOption } from "@/lib/booths-types";

interface BoothsBoardProps {
  events: BoothEventOption[];
  selectedEventId: string;
  booths: BoothGridItem[];
  clients: BoothClientOption[];
}

export function BoothsBoard({ events, selectedEventId, booths, clients }: BoothsBoardProps) {
  const t = useTranslations("booths");
  const locale = useLocale();
  const router = useRouter();

  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);

  // Reset selection when switching events.
  useEffect(() => {
    setSelectedBoothId(null);
  }, [selectedEventId]);

  const selectedBooth = booths.find((b) => b.id === selectedBoothId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <Select
          value={selectedEventId}
          onValueChange={(eventId) => router.push(`/booths?eventId=${eventId}`)}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <BoothFloorGrid
          booths={booths}
          selectedBoothId={selectedBoothId}
          onSelect={setSelectedBoothId}
        />
        <BoothDetailPanel booth={selectedBooth} clients={clients} />
      </div>
    </div>
  );
}
