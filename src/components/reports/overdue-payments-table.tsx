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
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-surface text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
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
