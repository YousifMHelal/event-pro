import { prisma } from "@/lib/prisma";
import { BOOTH_STATUSES } from "@/lib/booths-types";
import type { BoothStatus } from "@/generated/prisma/enums";

export interface DashboardKpis {
  totalEvents: number;
  ticketSalesHalalas: number;
  boothRevenueHalalas: number;
  outstandingDebtHalalas: number;
  openProductionOrders: number;
  monthlyCollectionsHalalas: number;
}

export interface MonthlyRevenue {
  month: string; // "YYYY-MM"
  halalas: number;
}

export interface BoothStatusCount {
  status: BoothStatus;
  count: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    totalEvents,
    ticketRevenue,
    boothRevenue,
    paidInvoiceTotals,
    outstandingInvoices,
    openProductionOrders,
    monthlyPayments,
  ] = await Promise.all([
    // Total events (non-cancelled)
    prisma.event.count({
      where: { status: { not: "cancelled" } },
    }),

    // Ticket sales: sum prices of paid tickets via their ticketType
    prisma.ticketType.findMany({
      where: { tickets: { some: { status: "paid" } } },
      select: {
        price: true,
        tickets: { where: { status: "paid" }, select: { id: true } },
      },
    }),

    // Booth revenue: sum confirmed booth bookings
    prisma.boothBooking.aggregate({
      where: { status: "confirmed" },
      _sum: { price: true },
    }),

    // Total billed on active invoices (to compute outstanding)
    prisma.invoice.findMany({
      where: { status: { in: ["sent", "partially_paid", "overdue"] } },
      select: {
        totalAmount: true,
        payments: { where: { status: "completed" }, select: { amount: true } },
      },
    }),

    // Outstanding (raw field on invoice — we compute from above)
    null,

    // Open production orders
    prisma.productionOrder.count({
      where: { status: { in: ["pending", "in_progress"] } },
    }),

    // This month's completed payments
    prisma.payment.aggregate({
      where: {
        status: "completed",
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amount: true },
    }),
  ]);

  // Compute ticket sales total
  const ticketSalesHalalas = ticketRevenue.reduce(
    (sum, tt) => sum + tt.price * tt.tickets.length,
    0,
  );

  // Compute outstanding debt (totalAmount - payments collected per invoice)
  const outstandingDebtHalalas = paidInvoiceTotals.reduce((sum, inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(0, inv.totalAmount - paid);
  }, 0);

  return {
    totalEvents,
    ticketSalesHalalas,
    boothRevenueHalalas: boothRevenue._sum.price ?? 0,
    outstandingDebtHalalas,
    openProductionOrders,
    monthlyCollectionsHalalas: monthlyPayments._sum.amount ?? 0,
  };
}

// Monthly revenue: sum of completed payments grouped by month (last 6 months)
export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const payments = await prisma.payment.findMany({
    where: {
      status: "completed",
      paidAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 5, 1)),
      },
    },
    select: { amount: true, paidAt: true },
  });

  const byMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, "0")}`;
    byMonth[key] = (byMonth[key] ?? 0) + p.amount;
  }

  // Fill gaps for all 6 months even if zero
  const result: MonthlyRevenue[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ month: key, halalas: byMonth[key] ?? 0 });
  }
  return result;
}

// Booth status breakdown across all events
export async function getBoothStatusCounts(): Promise<BoothStatusCount[]> {
  const groups = await prisma.booth.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const all: BoothStatusCount[] = BOOTH_STATUSES.map((status) => ({ status, count: 0 }));

  for (const g of groups) {
    const found = all.find((a) => a.status === g.status);
    if (found) found.count = g._count.id;
  }

  return all;
}
