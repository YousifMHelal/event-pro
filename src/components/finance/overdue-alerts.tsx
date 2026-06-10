"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, Mail } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSar } from "@/lib/utils";
import { sendReminder } from "@/app/[locale]/(app)/finance/actions";
import type { OverdueInvoiceItem } from "@/lib/finance-types";

interface OverdueAlertsProps {
  invoices: OverdueInvoiceItem[];
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function OverdueAlerts({ invoices }: OverdueAlertsProps) {
  const t = useTranslations("finance");
  const locale = useLocale();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [errorId, setErrorId] = useState<string | null>(null);

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center shadow-card">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-surface text-success">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-foreground-muted">{t("overdue.none")}</p>
      </div>
    );
  }

  async function handleSendReminder(invoiceId: string) {
    setErrorId(null);
    setSendingId(invoiceId);
    const result = await sendReminder({ invoiceId });
    setSendingId(null);

    if (result.success) {
      setSentIds((prev) => new Set(prev).add(invoiceId));
    } else {
      setErrorId(invoiceId);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("invoices.columnNumber")}</TableHead>
            <TableHead>{t("invoices.columnClient")}</TableHead>
            <TableHead>{t("invoices.columnDueDate")}</TableHead>
            <TableHead>{t("overdue.columnDaysOverdue")}</TableHead>
            <TableHead className="text-end">{t("overdue.balance")}</TableHead>
            <TableHead className="text-end">{t("invoices.columnActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const clientName = locale === "ar" ? invoice.clientNameAr : invoice.clientNameEn;
            const sent = sentIds.has(invoice.id);

            return (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{clientName}</TableCell>
                <TableCell className="text-foreground-muted">
                  {formatDate(invoice.dueDate, locale)}
                </TableCell>
                <TableCell>
                  <Badge variant="danger">
                    {t("overdue.daysOverdue", { days: invoice.daysOverdue })}
                  </Badge>
                </TableCell>
                <TableCell className="text-end font-medium tabular-nums">
                  {formatSar(invoice.balance, locale)}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={sent}
                      loading={sendingId === invoice.id}
                      onClick={() => handleSendReminder(invoice.id)}
                    >
                      {sent ? (
                        <>
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          {t("overdue.reminderSent")}
                        </>
                      ) : sendingId === invoice.id ? (
                        t("overdue.sending")
                      ) : (
                        <>
                          <Mail className="size-4" aria-hidden="true" />
                          {t("overdue.sendReminder")}
                        </>
                      )}
                    </Button>
                    {errorId === invoice.id && (
                      <p role="alert" className="text-xs text-danger">
                        {t("overdue.errorGeneric")}
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
