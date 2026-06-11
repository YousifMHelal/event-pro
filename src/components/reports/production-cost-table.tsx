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
import { EmptyState } from "@/components/ui/empty-state";
import { formatSar, formatNumber } from "@/lib/utils";
import type { ProductionCostRow } from "@/lib/reports-types";

interface ProductionCostTableProps {
  rows: ProductionCostRow[];
}

export function ProductionCostTable({ rows }: ProductionCostTableProps) {
  const t = useTranslations("reports.production");
  const locale = useLocale();

  if (rows.length === 0) {
    return <EmptyState icon={Hammer} title={t("noData")} />;
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
