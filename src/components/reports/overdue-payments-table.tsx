"use client";

import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2 } from "lucide-react";
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
import type { OverduePaymentRow } from "@/lib/reports-types";

interface OverduePaymentsTableProps {
  rows: OverduePaymentRow[];
}

export function OverduePaymentsTable({ rows }: OverduePaymentsTableProps) {
  const t = useTranslations("reports.overdue");
  const locale = useLocale();

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title={t("noData")}
        iconClassName="bg-success-surface text-success"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columnClient")}</TableHead>
            <TableHead className="text-end">{t("columnInvoices")}</TableHead>
            <TableHead className="text-end">{t("columnAmount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const name = locale === "ar" ? row.clientNameAr : row.clientNameEn;
            return (
              <TableRow key={row.clientId}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-end tabular-nums text-foreground-muted">
                  {formatNumber(row.invoiceCount, locale)}
                </TableCell>
                <TableCell className="text-end font-semibold tabular-nums text-danger">
                  {formatSar(row.amountHalalas, locale)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
