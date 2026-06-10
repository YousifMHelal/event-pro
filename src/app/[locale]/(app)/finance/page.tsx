import { getTranslations } from "next-intl/server";
import { getInvoices, getFinanceKpis, getAgingReport, getOverdueInvoices } from "@/lib/finance";
import { FinanceKpisSection } from "@/components/finance/finance-kpis";
import { FinanceBoard } from "@/components/finance/finance-board";

export default async function FinancePage() {
  const t = await getTranslations("finance");

  const [invoices, kpis, agingRows, overdueInvoices] = await Promise.all([
    getInvoices(),
    getFinanceKpis(),
    getAgingReport(),
    getOverdueInvoices(),
  ]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-base text-foreground-muted">{t("subtitle")}</p>
      </div>

      <FinanceKpisSection kpis={kpis} />

      <FinanceBoard invoices={invoices} agingRows={agingRows} overdueInvoices={overdueInvoices} />
    </div>
  );
}
