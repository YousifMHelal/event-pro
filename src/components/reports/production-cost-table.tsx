"use client";

import { useTranslations, useLocale } from "next-intl";
import { Hammer } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatSar, formatNumber } from "@/lib/utils";
import type { ProductionCostRow } from "@/lib/reports-types";

interface ProductionCostTableProps {
  rows: ProductionCostRow[];
}

export function ProductionCostTable({ rows }: ProductionCostTableProps) {
  const t = useTranslations("reports.production");
  const locale = useLocale();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <Hammer className="size-6" aria-hidden="true" />
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
            <TableHead className="text-end">{t("columnOrders")}</TableHead>
            <TableHead className="text-end">{t("columnMaterials")}</TableHead>
            <TableHead className="text-end">{t("columnCost")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const name = locale === "ar" ? row.eventNameAr : row.eventNameEn;
            return (
              <TableRow key={row.eventId}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-end tabular-nums">
                  {formatNumber(row.ordersCount, locale)}
                </TableCell>
                <TableCell className="text-end tabular-nums text-foreground-muted">
                  {formatNumber(row.materialsCount, locale)}
                </TableCell>
                <TableCell className="text-end font-semibold tabular-nums text-warn">
                  {formatSar(row.costHalalas, locale)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
