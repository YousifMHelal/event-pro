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
import { EmptyState } from "@/components/ui/empty-state";
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
      <EmptyState
        icon={Receipt}
        title={t("invoices.noInvoices")}
        description={t("invoices.noInvoicesDescription")}
      />
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 lg:hidden">
        {invoices.map((invoice) => {
          const clientName = locale === "ar" ? invoice.clientNameAr : invoice.clientNameEn;
          const eventName = locale === "ar" ? invoice.eventNameAr : invoice.eventNameEn;
          const canRecordPayment =
            invoice.balance > 0 && invoice.status !== "cancelled" && invoice.status !== "draft";

          return (
            <div
              key={invoice.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{invoice.number}</p>
                  <p className="text-sm text-foreground-muted">{clientName}</p>
                </div>
                <InvoiceStatusBadge status={invoice.status} label={t(`status.${invoice.status}`)} />
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnEvent")}</dt>
                  <dd className="text-foreground">{eventName ?? t("invoices.noEvent")}</dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnDueDate")}</dt>
                  <dd className="text-foreground">
                    {formatDate(invoice.dueDate, locale) ?? t("invoices.noDueDate")}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnIssueDate")}</dt>
                  <dd className="text-foreground">{formatDate(invoice.issueDate, locale)}</dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnPaid")}</dt>
                  <dd className="tabular-nums text-success">
                    {formatSar(invoice.paidAmount, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnTotal")}</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatSar(invoice.totalAmount, locale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground-muted">{t("invoices.columnBalance")}</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {formatSar(invoice.balance, locale)}
                  </dd>
                </div>
              </dl>

              {canRecordPayment && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setPaymentInvoice(invoice)}
                >
                  {t("invoices.recordPayment")}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-surface shadow-card lg:block">
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
