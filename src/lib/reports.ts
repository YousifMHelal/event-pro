import { prisma } from "@/lib/prisma";
import type {
  ReportsKpis,
  EventProfitRow,
  TicketSalesRow,
  BoothRevenueRow,
  ProductionCostRow,
  OverduePaymentRow,
  SalesPerformanceRow,
} from "@/lib/reports-types";

// Per-event aggregation: ticket revenue, booth revenue, production cost, profit.
// Reconciles with /tickets, /booths, and /production module data.
export async function getEventProfitReport(): Promise<EventProfitRow[]> {
  const events = await prisma.event.findMany({
    where: { status: { not: "cancelled" } },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      status: true,
      startDate: true,
      ticketTypes: {
        select: {
          price: true,
          tickets: { where: { status: "paid" }, select: { id: true } },
        },
      },
      boothBookings: {
        where: { status: "confirmed" },
        select: { price: true },
      },
      productionOrders: {
        select: {
          materials: { select: { quantity: true, unitCost: true } },
        },
      },
    },
  });

  return events.map((e) => {
    const ticketRevenueHalalas = e.ticketTypes.reduce(
      (sum, tt) => sum + tt.price * tt.tickets.length,
      0,
    );
    const boothRevenueHalalas = e.boothBookings.reduce((sum, b) => sum + b.price, 0);
    const productionCostHalalas = e.productionOrders.reduce(
      (sum, po) =>
        sum + po.materials.reduce((s, m) => s + m.quantity * m.unitCost, 0),
      0,
    );
    const totalRevenueHalalas = ticketRevenueHalalas + boothRevenueHalalas;

    return {
      eventId: e.id,
      eventNameAr: e.nameAr,
      eventNameEn: e.nameEn,
      status: e.status,
      startDate: e.startDate,
      ticketRevenueHalalas,
      boothRevenueHalalas,
      totalRevenueHalalas,
      productionCostHalalas,
      profitHalalas: totalRevenueHalalas - productionCostHalalas,
    };
  });
}

// Top-level executive KPIs derived from the same per-event data plus finance overdue figures.
export async function getReportsKpis(): Promise<ReportsKpis> {
  const [eventRows, overdueInvoices] = await Promise.all([
    getEventProfitReport(),
    prisma.invoice.findMany({
      where: { status: "overdue" },
      select: {
        totalAmount: true,
        payments: { where: { status: "completed" }, select: { amount: true } },
      },
    }),
  ]);

  const ticketRevenueHalalas = eventRows.reduce((s, r) => s + r.ticketRevenueHalalas, 0);
  const boothRevenueHalalas = eventRows.reduce((s, r) => s + r.boothRevenueHalalas, 0);
  const totalProductionCostHalalas = eventRows.reduce((s, r) => s + r.productionCostHalalas, 0);
  const totalRevenueHalalas = ticketRevenueHalalas + boothRevenueHalalas;

  const overdueAmountHalalas = overdueInvoices.reduce((sum, inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(0, inv.totalAmount - paid);
  }, 0);

  return {
    totalRevenueHalalas,
    totalProductionCostHalalas,
    totalProfitHalalas: totalRevenueHalalas - totalProductionCostHalalas,
    ticketRevenueHalalas,
    boothRevenueHalalas,
    overdueAmountHalalas,
    overdueCount: overdueInvoices.length,
  };
}

// Ticket sales per event (sold tickets vs. capacity, revenue from paid tickets).
export async function getTicketSalesReport(): Promise<TicketSalesRow[]> {
  const events = await prisma.event.findMany({
    where: { ticketTypes: { some: {} } },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      ticketTypes: {
        select: {
          price: true,
          quantity: true,
          tickets: { select: { id: true, status: true } },
        },
      },
    },
  });

  return events.map((e) => {
    let ticketsSold = 0;
    let ticketsTotal = 0;
    let revenueHalalas = 0;

    for (const tt of e.ticketTypes) {
      ticketsTotal += tt.quantity;
      const paid = tt.tickets.filter((t) => t.status === "paid");
      ticketsSold += paid.length;
      revenueHalalas += paid.length * tt.price;
    }

    return {
      eventId: e.id,
      eventNameAr: e.nameAr,
      eventNameEn: e.nameEn,
      ticketsSold,
      ticketsTotal,
      revenueHalalas,
    };
  });
}

// Booth revenue per event (confirmed bookings vs. total booths).
export async function getBoothRevenueReport(): Promise<BoothRevenueRow[]> {
  const events = await prisma.event.findMany({
    where: { booths: { some: {} } },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      booths: { select: { id: true } },
      boothBookings: {
        where: { status: "confirmed" },
        select: { price: true },
      },
    },
  });

  return events.map((e) => ({
    eventId: e.id,
    eventNameAr: e.nameAr,
    eventNameEn: e.nameEn,
    boothsTotal: e.booths.length,
    boothsBooked: e.boothBookings.length,
    revenueHalalas: e.boothBookings.reduce((sum, b) => sum + b.price, 0),
  }));
}

// Production cost per event (materials cost across all production orders).
export async function getProductionCostReport(): Promise<ProductionCostRow[]> {
  const events = await prisma.event.findMany({
    where: { productionOrders: { some: {} } },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      productionOrders: {
        select: {
          materials: { select: { quantity: true, unitCost: true } },
        },
      },
    },
  });

  return events.map((e) => {
    const allMaterials = e.productionOrders.flatMap((po) => po.materials);
    return {
      eventId: e.id,
      eventNameAr: e.nameAr,
      eventNameEn: e.nameEn,
      ordersCount: e.productionOrders.length,
      materialsCount: allMaterials.length,
      costHalalas: allMaterials.reduce((s, m) => s + m.quantity * m.unitCost, 0),
    };
  });
}

// Overdue payments grouped by client.
export async function getOverduePaymentsReport(): Promise<OverduePaymentRow[]> {
  const invoices = await prisma.invoice.findMany({
    where: { status: "overdue" },
    select: {
      totalAmount: true,
      clientId: true,
      client: { select: { nameAr: true, nameEn: true } },
      payments: { where: { status: "completed" }, select: { amount: true } },
    },
  });

  const byClient = new Map<string, OverduePaymentRow>();
  for (const inv of invoices) {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    const balance = Math.max(0, inv.totalAmount - paid);

    const existing = byClient.get(inv.clientId);
    if (existing) {
      existing.invoiceCount += 1;
      existing.amountHalalas += balance;
    } else {
      byClient.set(inv.clientId, {
        clientId: inv.clientId,
        clientNameAr: inv.client.nameAr,
        clientNameEn: inv.client.nameEn,
        invoiceCount: 1,
        amountHalalas: balance,
      });
    }
  }

  return Array.from(byClient.values()).sort((a, b) => b.amountHalalas - a.amountHalalas);
}

// Sales-team performance: opportunities won/lost/pipeline value per owner.
export async function getSalesPerformanceReport(): Promise<SalesPerformanceRow[]> {
  const opportunities = await prisma.opportunity.findMany({
    where: { ownerId: { not: null } },
    select: {
      stage: true,
      estimatedValue: true,
      ownerId: true,
      owner: { select: { id: true, nameAr: true, nameEn: true } },
    },
  });

  const byOwner = new Map<string, SalesPerformanceRow>();
  for (const o of opportunities) {
    if (!o.owner) continue;

    let row = byOwner.get(o.owner.id);
    if (!row) {
      row = {
        ownerId: o.owner.id,
        ownerNameAr: o.owner.nameAr,
        ownerNameEn: o.owner.nameEn,
        totalOpportunities: 0,
        wonCount: 0,
        lostCount: 0,
        conversionRate: 0,
        wonValueHalalas: 0,
        pipelineValueHalalas: 0,
      };
      byOwner.set(o.owner.id, row);
    }

    row.totalOpportunities += 1;
    if (o.stage === "won") {
      row.wonCount += 1;
      row.wonValueHalalas += o.estimatedValue;
    } else if (o.stage === "lost") {
      row.lostCount += 1;
    } else {
      row.pipelineValueHalalas += o.estimatedValue;
    }
  }

  for (const row of byOwner.values()) {
    const closed = row.wonCount + row.lostCount;
    row.conversionRate = closed > 0 ? (row.wonCount / closed) * 100 : 0;
  }

  return Array.from(byOwner.values()).sort((a, b) => b.wonValueHalalas - a.wonValueHalalas);
}
