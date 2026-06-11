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
import { EmptyState } from "@/components/ui/empty-state";
import { formatSar, formatNumber } from "@/lib/utils";
import type { BoothRevenueRow } from "@/lib/reports-types";

interface BoothRevenueTableProps {
  rows: BoothRevenueRow[];
}

export function BoothRevenueTable({ rows }: BoothRevenueTableProps) {
  const t = useTranslations("reports.booths");
  const locale = useLocale();

  if (rows.length === 0) {
    return <EmptyState icon={Store} title={t("noData")} />;
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => {
          const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
          const occupancy =
            row.boothsTotal > 0 ? Math.round((row.boothsBooked / row.boothsTotal) * 100) : 0;
          return (
            <div
              key={row.eventId}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">{name}</p>
                <p className="font-semibold tabular-nums text-success">
                  {formatSar(row.revenueHalalas, locale)}
                </p>
              </div>

              <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-foreground-muted">{t("columnBooked")}</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatNumber(row.boothsBooked, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnTotal")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(row.boothsTotal, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnOccupancy")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(occupancy, locale)}%
                  </dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-surface shadow-card lg:block">
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
    </>
  );
}
