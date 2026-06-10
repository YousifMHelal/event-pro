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
import { formatSar, formatNumber } from "@/lib/utils";
import type { SalesPerformanceRow } from "@/lib/reports-types";

interface SalesPerformanceTableProps {
  rows: SalesPerformanceRow[];
}

export function SalesPerformanceTable({ rows }: SalesPerformanceTableProps) {
  const t = useTranslations("reports.sales");
  const locale = useLocale();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <Users className="size-6" aria-hidden="true" />
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
  );
}
