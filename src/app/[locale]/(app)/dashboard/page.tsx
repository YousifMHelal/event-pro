import { getLocale, getTranslations } from "next-intl/server";
import {
  CalendarDays,
  Ticket,
  Store,
  AlertCircle,
  ClipboardList,
  Banknote,
} from "lucide-react";
import {
  getDashboardKpis,
  getMonthlyRevenue,
  getBoothStatusCounts,
} from "@/lib/dashboard";
import { formatSar, formatNumber } from "@/lib/utils";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { BoothStatusDonut } from "@/components/dashboard/booth-status-donut";

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = await getTranslations("dashboard");

  const [kpis, monthlyRevenue, boothCounts] = await Promise.all([
    getDashboardKpis(),
    getMonthlyRevenue(),
    getBoothStatusCounts(),
  ]);

  const monthLabels: Record<string, string> = {
    "1": t("months.1"),
    "2": t("months.2"),
    "3": t("months.3"),
    "4": t("months.4"),
    "5": t("months.5"),
    "6": t("months.6"),
    "7": t("months.7"),
    "8": t("months.8"),
    "9": t("months.9"),
    "10": t("months.10"),
    "11": t("months.11"),
    "12": t("months.12"),
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-3xl font-semibold">{t("title")}</h1>
        <p className="text-foreground-muted mt-1 text-base">{t("subtitle")}</p>
      </div>

      {/* KPI grid */}
      <section aria-label={t("title")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            icon={CalendarDays}
            label={t("kpi.totalEvents")}
            value={formatNumber(kpis.totalEvents, locale)}
            description={t("kpi.totalEventsDesc")}
            variant="info"
          />
          <KpiCard
            icon={Ticket}
            label={t("kpi.ticketSales")}
            value={formatSar(kpis.ticketSalesHalalas, locale)}
            description={t("kpi.ticketSalesDesc")}
            variant="success"
          />
          <KpiCard
            icon={Store}
            label={t("kpi.boothRevenue")}
            value={formatSar(kpis.boothRevenueHalalas, locale)}
            description={t("kpi.boothRevenueDesc")}
            variant="success"
          />
          <KpiCard
            icon={AlertCircle}
            label={t("kpi.outstandingDebt")}
            value={formatSar(kpis.outstandingDebtHalalas, locale)}
            description={t("kpi.outstandingDebtDesc")}
            variant={kpis.outstandingDebtHalalas > 0 ? "danger" : "default"}
          />
          <KpiCard
            icon={ClipboardList}
            label={t("kpi.openOrders")}
            value={formatNumber(kpis.openProductionOrders, locale)}
            description={t("kpi.openOrdersDesc")}
            variant={kpis.openProductionOrders > 0 ? "warn" : "default"}
          />
          <KpiCard
            icon={Banknote}
            label={t("kpi.monthlyCollections")}
            value={formatSar(kpis.monthlyCollectionsHalalas, locale)}
            description={t("kpi.monthlyCollectionsDesc")}
            variant="info"
          />
        </div>
      </section>

      {/* Charts row — donut left, revenue right (matches design) */}
      <section
        className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_496px]"
        aria-label={t("charts.revenueTitle")}
      >
        {/* Monthly Revenue bar chart */}
        <div className="border-border bg-surface shadow-card flex flex-col gap-4 rounded-lg border p-5">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              {t("charts.revenueTitle")}
            </h2>
            <p className="text-foreground-muted text-sm">
              {t("charts.revenueSubtitle")}
            </p>
          </div>
          <div className="h-72 w-full" aria-label={t("charts.revenueTitle")}>
            <RevenueChart
              data={monthlyRevenue}
              monthLabels={monthLabels}
              locale={locale}
              sarLabel={t("charts.sarAxis")}
              noDataLabel={t("charts.noData")}
            />
          </div>
        </div>

        {/* Booth status donut */}
        <div className="border-border bg-surface shadow-card flex flex-col gap-4 rounded-lg border p-5">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              {t("charts.boothTitle")}
            </h2>
            <p className="text-foreground-muted text-sm">
              {t("charts.boothSubtitle")}
            </p>
          </div>
          <div className="h-72 w-full" aria-label={t("charts.boothTitle")}>
            <BoothStatusDonut
              data={boothCounts}
              labels={{
                available: t("charts.boothAvailable"),
                reserved: t("charts.boothReserved"),
                unavailable: t("charts.boothUnavailable"),
              }}
              noDataLabel={t("charts.noData")}
              locale={locale}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
