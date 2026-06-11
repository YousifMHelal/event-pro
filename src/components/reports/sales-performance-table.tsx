"use client";

import { useTranslations, useLocale } from "next-intl";
import { Users } from "lucide-react";
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
import type { SalesPerformanceRow } from "@/lib/reports-types";

interface SalesPerformanceTableProps {
  rows: SalesPerformanceRow[];
}

export function SalesPerformanceTable({ rows }: SalesPerformanceTableProps) {
  const t = useTranslations("reports.sales");
  const locale = useLocale();

  if (rows.length === 0) {
    return <EmptyState icon={Users} title={t("noData")} />;
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 lg:hidden">
        {rows.map((row) => {
          const name = locale === "ar" ? row.ownerNameAr : row.ownerNameEn;
          return (
            <div
              key={row.ownerId}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <p className="font-medium text-foreground">{name}</p>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-foreground-muted">{t("columnTotal")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(row.totalOpportunities, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnConversion")}</dt>
                  <dd className="tabular-nums text-foreground-muted">
                    {formatNumber(Math.round(row.conversionRate), locale)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnWon")}</dt>
                  <dd className="tabular-nums text-success">
                    {formatNumber(row.wonCount, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnLost")}</dt>
                  <dd className="tabular-nums text-danger">
                    {formatNumber(row.lostCount, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnWonValue")}</dt>
                  <dd className="font-semibold tabular-nums text-success">
                    {formatSar(row.wonValueHalalas, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("columnPipelineValue")}</dt>
                  <dd className="tabular-nums text-info">
                    {formatSar(row.pipelineValueHalalas, locale)}
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
              <TableHead>{t("columnOwner")}</TableHead>
              <TableHead className="text-end">{t("columnTotal")}</TableHead>
              <TableHead className="text-end">{t("columnWon")}</TableHead>
              <TableHead className="text-end">{t("columnLost")}</TableHead>
              <TableHead className="text-end">{t("columnConversion")}</TableHead>
              <TableHead className="text-end">{t("columnWonValue")}</TableHead>
              <TableHead className="text-end">{t("columnPipelineValue")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const name = locale === "ar" ? row.ownerNameAr : row.ownerNameEn;
              return (
                <TableRow key={row.ownerId}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatNumber(row.totalOpportunities, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-success">
                    {formatNumber(row.wonCount, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-danger">
                    {formatNumber(row.lostCount, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-foreground-muted">
                    {formatNumber(Math.round(row.conversionRate), locale)}%
                  </TableCell>
                  <TableCell className="text-end font-semibold tabular-nums text-success">
                    {formatSar(row.wonValueHalalas, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-info">
                    {formatSar(row.pipelineValueHalalas, locale)}
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
