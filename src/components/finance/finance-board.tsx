"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InvoicesTable } from "@/components/finance/invoices-table";
import { AgingReport } from "@/components/finance/aging-report";
import { OverdueAlerts } from "@/components/finance/overdue-alerts";
import type { InvoiceItem, AgingReportRow, OverdueInvoiceItem } from "@/lib/finance-types";

interface FinanceBoardProps {
  invoices: InvoiceItem[];
  agingRows: AgingReportRow[];
  overdueInvoices: OverdueInvoiceItem[];
}

export function FinanceBoard({ invoices, agingRows, overdueInvoices }: FinanceBoardProps) {
  const t = useTranslations("finance");

  return (
    <Tabs defaultValue="invoices">
      <TabsList>
        <TabsTrigger value="invoices">{t("tabs.invoices")}</TabsTrigger>
        <TabsTrigger value="aging">{t("tabs.aging")}</TabsTrigger>
        <TabsTrigger value="overdue">
          {t("tabs.overdue")}
          {overdueInvoices.length > 0 && (
            <span className="ms-1.5 inline-flex size-5 items-center justify-center rounded-full bg-danger-surface text-xs font-semibold text-danger">
              {overdueInvoices.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="invoices">
        <InvoicesTable invoices={invoices} />
      </TabsContent>

      <TabsContent value="aging">
        <AgingReport rows={agingRows} />
      </TabsContent>

      <TabsContent value="overdue">
        <OverdueAlerts invoices={overdueInvoices} />
      </TabsContent>
    </Tabs>
  );
}
