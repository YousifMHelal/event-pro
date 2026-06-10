import { TrendingUp, Hammer, PiggyBank, AlertTriangle } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { formatSar } from "@/lib/utils";
import type { ReportsKpis } from "@/lib/reports-types";

interface ReportsKpisSectionProps {
  kpis: ReportsKpis;
}

export async function ReportsKpisSection({ kpis }: ReportsKpisSectionProps) {
  const t = await getTranslations("reports");
  const locale = await getLocale();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={TrendingUp}
        label={t("kpi.totalRevenue")}
        value={formatSar(kpis.totalRevenueHalalas, locale)}
        description={t("kpi.totalRevenueDesc")}
        variant="success"
      />
      <KpiCard
        icon={Hammer}
        label={t("kpi.productionCost")}
        value={formatSar(kpis.totalProductionCostHalalas, locale)}
        description={t("kpi.productionCostDesc")}
        variant="warn"
      />
      <KpiCard
        icon={PiggyBank}
        label={t("kpi.netProfit")}
        value={formatSar(kpis.totalProfitHalalas, locale)}
        description={t("kpi.netProfitDesc")}
        variant={kpis.totalProfitHalalas >= 0 ? "info" : "danger"}
      />
      <KpiCard
        icon={AlertTriangle}
        label={t("kpi.overdueAmount")}
        value={formatSar(kpis.overdueAmountHalalas, locale)}
        description={t("kpi.overdueAmountDesc", { count: kpis.overdueCount })}
        variant={kpis.overdueAmountHalalas > 0 ? "danger" : "default"}
      />
    </div>
  );
}
