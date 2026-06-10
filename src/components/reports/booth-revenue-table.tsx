"use client";

import { useTranslations, useLocale } from "next-intl";
import { Store } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatSar, formatNumber } from "@/lib/utils";
import type { BoothRevenueRow } from "@/lib/reports-types";

interface BoothRevenueTableProps {
  rows: BoothRevenueRow[];
}

export function BoothRevenueTable({ rows }: BoothRevenueTableProps) {
  const t = useTranslations("reports.booths");
  const locale = useLocale();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <Store className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-foreground-muted">{t("noData")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columnEvent")}</TableHead>
            <TableHead className="text-end">{t("columnBooked")}</TableHead>
            <TableHead className="text-end">{t("columnTotal")}</TableHead>
            <TableHead className="text-end">{t("columnOccupancy")}</TableHead>
            <TableHead className="text-end">{t("columnRevenue")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
            const occupancy =
              row.boothsTotal > 0 ? Math.round((row.boothsBooked / row.boothsTotal) * 100) : 0;
            return (
              <TableRow key={row.eventId}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-end tabular-nums">
                  {formatNumber(row.boothsBooked, locale)}
                </TableCell>
                <TableCell className="text-end tabular-nums text-foreground-muted">
                  {formatNumber(row.boothsTotal, locale)}
                </TableCell>
                <TableCell className="text-end tabular-nums text-foreground-muted">
                  {formatNumber(occupancy, locale)}%
                </TableCell>
                <TableCell className="text-end font-semibold tabular-nums text-success">
                  {formatSar(row.revenueHalalas, locale)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
