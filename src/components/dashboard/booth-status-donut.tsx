"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { BoothStatusCount } from "@/lib/dashboard";

interface BoothStatusDonutProps {
  data: BoothStatusCount[];
  labels: {
    available: string;
    reserved: string;
    contracted: string;
    production: string;
    delivered: string;
  };
  noDataLabel: string;
  locale: string;
}

const STATUS_COLORS: Record<string, string> = {
  available:  "#94a3b8",
  reserved:   "#2563eb",
  contracted: "#d97706",
  production: "#7c3aed",
  delivered:  "#059669",
};

export function BoothStatusDonut({ data, labels, noDataLabel, locale }: BoothStatusDonutProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
        {noDataLabel}
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: labels[d.status],
    value: d.count,
    status: d.status,
    pct: Math.round((d.count / total) * 100),
  }));

  return (
    <div className="flex h-full flex-row items-center gap-4">
      {/* Donut chart */}
      <div className="relative min-w-0 flex-1">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="104%"
              paddingAngle={3}
              dataKey="value"
              startAngle={locale === "ar" ? -90 : 90}
              endAngle={locale === "ar" ? 270 : -270}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as (typeof chartData)[number];
                return (
                  <div className="rounded-md border border-border bg-surface px-3 py-2 shadow-popover">
                    <p className="text-xs font-medium text-foreground">{d.name}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {d.value}{" "}
                      <span className="text-xs font-normal text-foreground-muted">
                        ({d.pct}%)
                      </span>
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums text-foreground">{total}</span>
          <span className="text-xs text-foreground-muted">{locale === "ar" ? "إجمالي الأجنحة" : "Total booths"}</span>
        </div>
      </div>

      {/* Vertical legend */}
      <div className="flex flex-col gap-3">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center gap-2.5">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[item.status] }}
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tabular-nums leading-none text-foreground">
                {item.value}
              </span>
              <span className="mt-0.5 text-xs text-foreground-muted">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
