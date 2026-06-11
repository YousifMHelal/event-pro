"use client";

import { useTranslations, useLocale } from "next-intl";
import { Ticket } from "lucide-react";
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
import type { TicketSalesRow } from "@/lib/reports-types";

interface TicketSalesTableProps {
  rows: TicketSalesRow[];
}

export function TicketSalesTable({ rows }: TicketSalesTableProps) {
  const t = useTranslations("reports.tickets");
  const locale = useLocale();

  if (rows.length === 0) {
    return <EmptyState icon={Ticket} title={t("noData")} />;
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => {
          const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
          const sellThrough =
            row.ticketsTotal > 0 ? Math.round((row.ticketsSold / row.ticketsTotal) * 100) : 0;
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
                  <dt className="text-foreground-muted">{t("columnSold")}</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatNumber(row.ticketsSold, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnCapacity")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(row.ticketsTotal, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnSellThrough")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(sellThrough, locale)}%
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
              <TableHead className="text-end">{t("columnSold")}</TableHead>
              <TableHead className="text-end">{t("columnCapacity")}</TableHead>
              <TableHead className="text-end">{t("columnSellThrough")}</TableHead>
              <TableHead className="text-end">{t("columnRevenue")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
              const sellThrough =
                row.ticketsTotal > 0 ? Math.round((row.ticketsSold / row.ticketsTotal) * 100) : 0;
              return (
                <TableRow key={row.eventId}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatNumber(row.ticketsSold, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatNumber(row.ticketsTotal, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatNumber(sellThrough, locale)}%
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
