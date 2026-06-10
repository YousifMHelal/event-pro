import { Target, Wallet, TrendingUp, Clock } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { formatSar, formatNumber } from "@/lib/utils";
import type { PipelineStats } from "@/lib/crm";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: typeof Target;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}

export async function PipelineStatsBar({ stats }: { stats: PipelineStats }) {
  const t = await getTranslations("crm.stats");
  const locale = await getLocale();

  const conversionRate = new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
    {
      maximumFractionDigits: 0,
    },
  ).format(stats.conversionRate);

  const avgCycle =
    stats.avgCycleDays === null
      ? t("avgCycleNoData")
      : t("avgCycleDays", { count: Math.round(stats.avgCycleDays) });

  const items: StatItem[] = [
    {
      icon: Target,
      label: t("totalOpportunities"),
      value: formatNumber(stats.totalOpportunities, locale),
      iconBg: "bg-info-surface",
      iconColor: "text-info",
    },
    {
      icon: Wallet,
      label: t("pipelineValue"),
      value: formatSar(stats.pipelineValueHalalas, locale),
      iconBg: "bg-success-surface",
      iconColor: "text-success",
    },
    {
      icon: TrendingUp,
      label: t("conversionRate"),
      value: `${conversionRate}%`,
      iconBg: "bg-info-surface",
      iconColor: "text-info",
    },
    {
      icon: Clock,
      label: t("avgCycle"),
      value: avgCycle,
      iconBg: "bg-warn-surface",
      iconColor: "text-warn",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-border bg-surface shadow-card flex items-center gap-4 rounded-lg border p-5"
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
              item.iconBg,
            )}
            aria-hidden="true"
          >
            <item.icon
              className={cn("h-5 w-5", item.iconColor)}
              strokeWidth={1.75}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-foreground-muted text-sm font-medium">
              {item.label}
            </p>
            <p className="text-foreground text-xl leading-none font-semibold tracking-tight tabular-nums">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
