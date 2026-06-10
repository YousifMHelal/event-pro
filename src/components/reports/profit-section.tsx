"use client";

import { useTranslations, useLocale } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { ProfitChart } from "@/components/reports/profit-chart";
import { formatSar } from "@/lib/utils";
import type { EventProfitRow } from "@/lib/reports-types";

interface ProfitSectionProps {
  rows: EventProfitRow[];
}

export function ProfitSection({ rows }: ProfitSectionProps) {
  const t = useTranslations("reports.profit");
  const locale = useLocale();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <TrendingUp className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-foreground-muted">{t("noData")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("chartTitle")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ProfitChart rows={rows} />
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnEvent")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead className="text-end">{t("columnTicketRevenue")}</TableHead>
              <TableHead className="text-end">{t("columnBoothRevenue")}</TableHead>
              <TableHead className="text-end">{t("columnRevenue")}</TableHead>
              <TableHead className="text-end">{t("columnCost")}</TableHead>
              <TableHead className="text-end">{t("columnProfit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
              return (
                <TableRow key={row.eventId}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    <EventStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatSar(row.ticketRevenueHalalas, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatSar(row.boothRevenueHalalas, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatSar(row.totalRevenueHalalas, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-warn">
                    {formatSar(row.productionCostHalalas, locale)}
                  </TableCell>
                  <TableCell
                    className={`text-end font-semibold tabular-nums ${
                      row.profitHalalas >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatSar(row.profitHalalas, locale)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
