import { getTranslations } from "next-intl/server";
import {
  getReportsKpis,
  getEventProfitReport,
  getTicketSalesReport,
  getBoothRevenueReport,
  getProductionCostReport,
  getOverduePaymentsReport,
  getSalesPerformanceReport,
} from "@/lib/reports";
import { ReportsKpisSection } from "@/components/reports/reports-kpis";
import { ReportsBoard } from "@/components/reports/reports-board";

export default async function ReportsPage() {
  const t = await getTranslations("reports");

  const [kpis, profitRows, ticketRows, boothRows, productionRows, overdueRows, salesRows] =
    await Promise.all([
      getReportsKpis(),
      getEventProfitReport(),
      getTicketSalesReport(),
      getBoothRevenueReport(),
      getProductionCostReport(),
      getOverduePaymentsReport(),
      getSalesPerformanceReport(),
    ]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-base text-foreground-muted">{t("subtitle")}</p>
      </div>

      <ReportsKpisSection kpis={kpis} />

      <ReportsBoard
        profitRows={profitRows}
        ticketRows={ticketRows}
        boothRows={boothRows}
        productionRows={productionRows}
        overdueRows={overdueRows}
        salesRows={salesRows}
      />
    </div>
  );
}
