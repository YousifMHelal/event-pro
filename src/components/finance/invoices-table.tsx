"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Receipt } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/finance/invoice-status-badge";
import { RecordPaymentDialog } from "@/components/finance/record-payment-dialog";
import { formatSar } from "@/lib/utils";
import type { InvoiceItem } from "@/lib/finance-types";

interface InvoicesTableProps {
  invoices: InvoiceItem[];
}

function formatDate(date: Date | null, locale: string) {
  if (!date) return null;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const t = useTranslations("finance");
  const locale = useLocale();
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceItem | null>(null);

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <Receipt className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-foreground-muted">{t("invoices.noInvoices")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("invoices.columnNumber")}</TableHead>
              <TableHead>{t("invoices.columnClient")}</TableHead>
              <TableHead>{t("invoices.columnEvent")}</TableHead>
              <TableHead>{t("invoices.columnIssueDate")}</TableHead>
              <TableHead>{t("invoices.columnDueDate")}</TableHead>
              <TableHead className="text-end">{t("invoices.columnTotal")}</TableHead>
              <TableHead className="text-end">{t("invoices.columnPaid")}</TableHead>
              <TableHead className="text-end">{t("invoices.columnBalance")}</TableHead>
              <TableHead>{t("invoices.columnStatus")}</TableHead>
              <TableHead className="text-end">{t("invoices.columnActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const clientName = locale === "ar" ? invoice.clientNameAr : invoice.clientNameEn;
              const eventName =
                locale === "ar" ? invoice.eventNameAr : invoice.eventNameEn;
              const canRecordPayment =
                invoice.balance > 0 &&
                invoice.status !== "cancelled" &&
                invoice.status !== "draft";

              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{clientName}</TableCell>
                  <TableCell className="text-foreground-muted">
                    {eventName ?? t("invoices.noEvent")}
                  </TableCell>
                  <TableCell className="text-foreground-muted">
                    {formatDate(invoice.issueDate, locale)}
                  </TableCell>
                  <TableCell className="text-foreground-muted">
                    {formatDate(invoice.dueDate, locale) ?? t("invoices.noDueDate")}
                  </TableCell>
                  <TableCell className="text-end tabular-nums">
                    {formatSar(invoice.totalAmount, locale)}
                  </TableCell>
                  <TableCell className="text-end tabular-nums text-success">
                    {formatSar(invoice.paidAmount, locale)}
                  </TableCell>
                  <TableCell className="text-end font-medium tabular-nums">
                    {formatSar(invoice.balance, locale)}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} label={t(`status.${invoice.status}`)} />
                  </TableCell>
                  <TableCell className="text-end">
                    {canRecordPayment && (
                      <Button size="sm" variant="outline" onClick={() => setPaymentInvoice(invoice)}>
                        {t("invoices.recordPayment")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {paymentInvoice && (
        <RecordPaymentDialog
          invoice={paymentInvoice}
          open={!!paymentInvoice}
          onOpenChange={(open) => {
            if (!open) setPaymentInvoice(null);
          }}
        />
      )}
    </>
  );
}
