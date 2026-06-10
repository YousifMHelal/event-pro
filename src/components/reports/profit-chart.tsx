"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatSar, formatNumber } from "@/lib/utils";
import type { EventProfitRow } from "@/lib/reports-types";

interface ProfitChartProps {
  rows: EventProfitRow[];
}

export function ProfitChart({ rows }: ProfitChartProps) {
  const t = useTranslations("reports.profit");
  const locale = useLocale();

  const chartData = rows
    .slice()
    .reverse()
    .map((r) => ({
      name: locale === "ar" ? r.eventNameAr : r.eventNameEn,
      revenue: r.totalRevenueHalalas / 100,
      cost: r.productionCostHalalas / 100,
      profit: r.profitHalalas / 100,
      revenueHalalas: r.totalRevenueHalalas,
      costHalalas: r.productionCostHalalas,
      profitHalalas: r.profitHalalas,
    }));

  const hasData = chartData.some((d) => d.revenue > 0 || d.cost > 0);

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
        {t("noData")}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barCategoryGap="25%">
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--color-foreground-muted)" }}
          reversed={locale === "ar"}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
          tickFormatter={(v) => formatNumber(Math.round(v), locale)}
          orientation={locale === "ar" ? "right" : "left"}
          width={56}
        />
        <Tooltip
          cursor={{ fill: "var(--color-surface-muted)" }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const row = payload[0].payload as (typeof chartData)[number];
            return (
              <div className="rounded-md border border-border bg-surface px-3 py-2 shadow-popover">
                <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
                <p className="text-sm text-success">
                  {t("revenue")}: {formatSar(row.revenueHalalas, locale)}
                </p>
                <p className="text-sm text-warn">
                  {t("cost")}: {formatSar(row.costHalalas, locale)}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {t("profit")}: {formatSar(row.profitHalalas, locale)}
                </p>
              </div>
            );
          }}
        />
        <Legend
          formatter={(value) =>
            value === "revenue" ? t("revenue") : t("cost")
          }
          wrapperStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="revenue" name="revenue" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="cost" name="cost" fill="#d97706" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
