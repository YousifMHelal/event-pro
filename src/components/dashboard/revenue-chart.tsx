"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyRevenue } from "@/lib/dashboard";

interface RevenueChartProps {
  data: MonthlyRevenue[];
  monthLabels: Record<string, string>; // "1" -> "Jan" | "يناير"
  locale: string;
  sarLabel: string;
  noDataLabel: string;
}

function formatSarCompact(halalas: number, locale: string): string {
  const sar = halalas / 100;
  if (sar >= 1_000_000)
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      maximumFractionDigits: 1,
    }).format(sar / 1_000_000) + (locale === "ar" ? " م" : " M");
  if (sar >= 1_000)
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
      maximumFractionDigits: 0,
    }).format(sar / 1_000) + (locale === "ar" ? " ألف" : " K");
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    maximumFractionDigits: 0,
  }).format(sar);
}

function formatSarFull(halalas: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(halalas / 100);
}

export function RevenueChart({
  data,
  monthLabels,
  locale,
  sarLabel,
  noDataLabel,
}: RevenueChartProps) {
  const chartData = data.map((d) => {
    const monthNum = String(parseInt(d.month.split("-")[1], 10));
    return {
      month: monthLabels[monthNum] ?? monthNum,
      halalas: d.halalas,
      sar: d.halalas / 100,
    };
  });

  const hasData = chartData.some((d) => d.halalas > 0);

  if (!hasData) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
        {noDataLabel}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#64748b" }}
          reversed={locale === "ar"}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickFormatter={(v) => formatSarCompact(v * 100, locale)}
          label={
            locale !== "ar"
              ? { value: sarLabel, angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8", offset: 8 }
              : undefined
          }
          orientation={locale === "ar" ? "right" : "left"}
          width={locale === "ar" ? 56 : 56}
        />
        <Tooltip
          cursor={{ fill: "#f1f5f9" }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            // payload[0].payload has the full row including halalas
            const row = payload[0].payload as { halalas: number; month: string };
            return (
              <div className="rounded-md border border-border bg-surface px-3 py-2 shadow-popover">
                <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
                <p className="text-sm font-semibold text-primary">
                  {formatSarFull(row.halalas, locale)}
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="sar" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
