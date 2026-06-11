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
import { EmptyState } from "@/components/ui/empty-state";
import { formatSar } from "@/lib/utils";
import type { EventProfitRow } from "@/lib/reports-types";

interface ProfitSectionProps {
  rows: EventProfitRow[];
}

export function ProfitSection({ rows }: ProfitSectionProps) {
  const t = useTranslations("reports.profit");
  const locale = useLocale();

  if (rows.length === 0) {
    return <EmptyState icon={TrendingUp} title={t("noData")} />;
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

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => {
          const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
          return (
            <div
              key={row.eventId}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">{name}</p>
                <EventStatusBadge status={row.status} />
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-foreground-muted">{t("columnTicketRevenue")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatSar(row.ticketRevenueHalalas, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnBoothRevenue")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatSar(row.boothRevenueHalalas, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnRevenue")}</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatSar(row.totalRevenueHalalas, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnCost")}</dt>
                  <dd className="tabular-nums text-warn">
                    {formatSar(row.productionCostHalalas, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnProfit")}</dt>
                  <dd
                    className={`font-semibold tabular-nums ${
                      row.profitHalalas >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatSar(row.profitHalalas, locale)}
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
