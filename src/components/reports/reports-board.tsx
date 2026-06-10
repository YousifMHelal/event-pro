"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfitSection } from "@/components/reports/profit-section";
import { TicketSalesTable } from "@/components/reports/ticket-sales-table";
import { BoothRevenueTable } from "@/components/reports/booth-revenue-table";
import { ProductionCostTable } from "@/components/reports/production-cost-table";
import { OverduePaymentsTable } from "@/components/reports/overdue-payments-table";
import { SalesPerformanceTable } from "@/components/reports/sales-performance-table";
import type {
  EventProfitRow,
  TicketSalesRow,
  BoothRevenueRow,
  ProductionCostRow,
  OverduePaymentRow,
  SalesPerformanceRow,
} from "@/lib/reports-types";

interface ReportsBoardProps {
  profitRows: EventProfitRow[];
  ticketRows: TicketSalesRow[];
  boothRows: BoothRevenueRow[];
  productionRows: ProductionCostRow[];
  overdueRows: OverduePaymentRow[];
  salesRows: SalesPerformanceRow[];
}

export function ReportsBoard({
  profitRows,
  ticketRows,
  boothRows,
  productionRows,
  overdueRows,
  salesRows,
}: ReportsBoardProps) {
  const t = useTranslations("reports.tabs");

  return (
    <Tabs defaultValue="profit">
      <TabsList>
        <TabsTrigger value="profit">{t("profit")}</TabsTrigger>
        <TabsTrigger value="tickets">{t("tickets")}</TabsTrigger>
        <TabsTrigger value="booths">{t("booths")}</TabsTrigger>
        <TabsTrigger value="production">{t("production")}</TabsTrigger>
        <TabsTrigger value="overdue">
          {t("overdue")}
          {overdueRows.length > 0 && (
            <span className="ms-1.5 inline-flex size-5 items-center justify-center rounded-full bg-danger-surface text-xs font-semibold text-danger">
              {overdueRows.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="sales">{t("sales")}</TabsTrigger>
      </TabsList>

      <TabsContent value="profit">
        <ProfitSection rows={profitRows} />
      </TabsContent>

      <TabsContent value="tickets">
        <TicketSalesTable rows={ticketRows} />
      </TabsContent>

      <TabsContent value="booths">
        <BoothRevenueTable rows={boothRows} />
      </TabsContent>

      <TabsContent value="production">
        <ProductionCostTable rows={productionRows} />
      </TabsContent>

      <TabsContent value="overdue">
        <OverduePaymentsTable rows={overdueRows} />
      </TabsContent>

      <TabsContent value="sales">
        <SalesPerformanceTable rows={salesRows} />
      </TabsContent>
    </Tabs>
  );
}
