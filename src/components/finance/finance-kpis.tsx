import { Wallet, AlertTriangle, Banknote, FileText } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { formatSar } from "@/lib/utils";
import type { FinanceKpis } from "@/lib/finance-types";

interface FinanceKpisSectionProps {
  kpis: FinanceKpis;
}

export async function FinanceKpisSection({ kpis }: FinanceKpisSectionProps) {
  const t = await getTranslations("finance");
  const locale = await getLocale();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        icon={Wallet}
        label={t("kpi.totalOutstanding")}
        value={formatSar(kpis.totalOutstandingHalalas, locale)}
        description={t("kpi.totalOutstandingDesc")}
        variant={kpis.totalOutstandingHalalas > 0 ? "warn" : "default"}
      />
      <KpiCard
        icon={AlertTriangle}
        label={t("kpi.overdueAmount")}
        value={formatSar(kpis.overdueAmountHalalas, locale)}
        description={t("kpi.overdueAmountDesc", { count: kpis.overdueCount })}
        variant={kpis.overdueAmountHalalas > 0 ? "danger" : "default"}
      />
      <KpiCard
        icon={Banknote}
        label={t("kpi.collectedThisMonth")}
        value={formatSar(kpis.collectedThisMonthHalalas, locale)}
        description={t("kpi.collectedThisMonthDesc")}
        variant="success"
      />
      <KpiCard
        icon={FileText}
        label={t("kpi.totalInvoiced")}
        value={formatSar(kpis.totalInvoicedHalalas, locale)}
        description={t("kpi.totalInvoicedDesc")}
        variant="info"
      />
    </div>
  );
}
