"use client";

import { useTranslations, useLocale } from "next-intl";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatSar, formatNumber } from "@/lib/utils";
import type { AgingReportRow } from "@/lib/finance-types";

interface AgingReportProps {
  rows: AgingReportRow[];
}

const BUCKET_COLORS: Record<string, string> = {
  current: "#059669",
  "1-30": "#d97706",
  "31-60": "#ea580c",
  "60+": "#dc2626",
};

export function AgingReport({ rows }: AgingReportProps) {
  const t = useTranslations("finance");
  const locale = useLocale();

  const total = rows.reduce((sum, r) => sum + r.amountHalalas, 0);

  const chartData = rows.map((r) => ({
    bucket: t(`aging.bucket.${r.bucket}`),
    sar: r.amountHalalas / 100,
    halalas: r.amountHalalas,
    bucketKey: r.bucket,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <Card key={row.bucket}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: BUCKET_COLORS[row.bucket] }}
                />
                {t(`aging.bucket.${row.bucket}`)}
              </CardTitle>
              <CardDescription>{t("aging.invoiceCount", { count: row.count })}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {formatSar(row.amountHalalas, locale)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("aging.title")}</CardTitle>
          <CardDescription>{t("aging.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {total === 0 ? (
            <div className="flex h-70 items-center justify-center text-sm text-foreground-muted">
              {t("aging.noOutstanding")}
            </div>
          ) : (
            <div className="h-70" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: 12, fill: "var(--color-foreground-muted)" }}
                    axisLine={{ stroke: "var(--color-border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--color-foreground-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatNumber(v, locale)}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-surface-muted)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as { halalas: number; bucket: string };
                      return (
                        <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-popover">
                          <p className="font-medium text-foreground">{row.bucket}</p>
                          <p className="text-foreground-muted">{formatSar(row.halalas, locale)}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="sar" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    {chartData.map((entry) => (
                      <Cell key={entry.bucketKey} fill={BUCKET_COLORS[entry.bucketKey]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
