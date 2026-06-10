import { prisma } from "@/lib/prisma";
import type {
  InvoiceItem,
  FinanceKpis,
  AgingReportRow,
  OverdueInvoiceItem,
  AgingBucket,
} from "@/lib/finance-types";

const PAID_AMOUNT_SELECT = {
  payments: {
    where: { status: "completed" as const },
    select: { id: true, amount: true, method: true, paidAt: true, reference: true, notes: true },
  },
  installments: {
    select: { id: true, amount: true, dueDate: true, status: true },
    orderBy: { dueDate: "asc" as const },
  },
};

export async function getInvoices(): Promise<InvoiceItem[]> {
  const invoices = await prisma.invoice.findMany({
    orderBy: { issueDate: "desc" },
    select: {
      id: true,
      number: true,
      status: true,
      totalAmount: true,
      issueDate: true,
      dueDate: true,
      clientId: true,
      client: { select: { nameAr: true, nameEn: true } },
      eventId: true,
      event: { select: { nameAr: true, nameEn: true } },
      ...PAID_AMOUNT_SELECT,
    },
  });

  return invoices.map((inv) => {
    const paidAmount = inv.payments.reduce((sum, p) => sum + p.amount, 0);
    return {
      id: inv.id,
      number: inv.number,
      status: inv.status,
      totalAmount: inv.totalAmount,
      paidAmount,
      balance: inv.totalAmount - paidAmount,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      clientId: inv.clientId,
      clientNameAr: inv.client.nameAr,
      clientNameEn: inv.client.nameEn,
      eventId: inv.eventId,
      eventNameAr: inv.event?.nameAr ?? null,
      eventNameEn: inv.event?.nameEn ?? null,
      installments: inv.installments,
      payments: inv.payments,
    };
  });
}

export async function getInvoiceById(id: string): Promise<InvoiceItem | null> {
  const inv = await prisma.invoice.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      status: true,
      totalAmount: true,
      issueDate: true,
      dueDate: true,
      clientId: true,
      client: { select: { nameAr: true, nameEn: true } },
      eventId: true,
      event: { select: { nameAr: true, nameEn: true } },
      ...PAID_AMOUNT_SELECT,
    },
  });
  if (!inv) return null;

  const paidAmount = inv.payments.reduce((sum, p) => sum + p.amount, 0);
  return {
    id: inv.id,
    number: inv.number,
    status: inv.status,
    totalAmount: inv.totalAmount,
    paidAmount,
    balance: inv.totalAmount - paidAmount,
    issueDate: inv.issueDate,
    dueDate: inv.dueDate,
    clientId: inv.clientId,
    clientNameAr: inv.client.nameAr,
    clientNameEn: inv.client.nameEn,
    eventId: inv.eventId,
    eventNameAr: inv.event?.nameAr ?? null,
    eventNameEn: inv.event?.nameEn ?? null,
    installments: inv.installments,
    payments: inv.payments,
  };
}

export async function getFinanceKpis(): Promise<FinanceKpis> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [activeInvoices, overdueInvoices, monthlyPayments, allInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: { status: { in: ["sent", "partially_paid", "overdue"] } },
      select: {
        totalAmount: true,
        payments: { where: { status: "completed" }, select: { amount: true } },
      },
    }),
    prisma.invoice.findMany({
      where: { status: "overdue" },
      select: {
        totalAmount: true,
        payments: { where: { status: "completed" }, select: { amount: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "completed", paidAt: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: { not: "cancelled" } },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalOutstandingHalalas = activeInvoices.reduce((sum, inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return sum + (inv.totalAmount - paid);
  }, 0);

  const overdueAmountHalalas = overdueInvoices.reduce((sum, inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    return sum + (inv.totalAmount - paid);
  }, 0);

  return {
    totalOutstandingHalalas,
    overdueAmountHalalas,
    overdueCount: overdueInvoices.length,
    collectedThisMonthHalalas: monthlyPayments._sum.amount ?? 0,
    totalInvoicedHalalas: allInvoices._sum.totalAmount ?? 0,
  };
}

export async function getAgingReport(): Promise<AgingReportRow[]> {
  const now = new Date();

  const invoices = await prisma.invoice.findMany({
    where: { status: { in: ["sent", "partially_paid", "overdue"] } },
    select: {
      totalAmount: true,
      dueDate: true,
      payments: { where: { status: "completed" }, select: { amount: true } },
    },
  });

  const buckets: Record<AgingBucket, { amountHalalas: number; count: number }> = {
    current: { amountHalalas: 0, count: 0 },
    "1-30": { amountHalalas: 0, count: 0 },
    "31-60": { amountHalalas: 0, count: 0 },
    "60+": { amountHalalas: 0, count: 0 },
  };

  for (const inv of invoices) {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    const balance = inv.totalAmount - paid;
    if (balance <= 0) continue;

    const bucket = getAgingBucket(inv.dueDate, now);
    buckets[bucket].amountHalalas += balance;
    buckets[bucket].count += 1;
  }

  return (Object.entries(buckets) as [AgingBucket, { amountHalalas: number; count: number }][]).map(
    ([bucket, v]) => ({ bucket, amountHalalas: v.amountHalalas, count: v.count }),
  );
}

function getAgingBucket(dueDate: Date | null, now: Date): AgingBucket {
  if (!dueDate || dueDate >= now) return "current";

  const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysOverdue <= 30) return "1-30";
  if (daysOverdue <= 60) return "31-60";
  return "60+";
}

export async function getOverdueInvoices(): Promise<OverdueInvoiceItem[]> {
  const now = new Date();

  const invoices = await prisma.invoice.findMany({
    where: { status: "overdue" },
    orderBy: { dueDate: "asc" },
    select: {
      id: true,
      number: true,
      totalAmount: true,
      dueDate: true,
      clientId: true,
      client: { select: { nameAr: true, nameEn: true, email: true } },
      payments: { where: { status: "completed" }, select: { amount: true } },
    },
  });

  return invoices
    .filter((inv) => inv.dueDate !== null)
    .map((inv) => {
      const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
      const daysOverdue = Math.floor(
        (now.getTime() - inv.dueDate!.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        id: inv.id,
        number: inv.number,
        totalAmount: inv.totalAmount,
        balance: inv.totalAmount - paid,
        dueDate: inv.dueDate!,
        daysOverdue,
        clientId: inv.clientId,
        clientNameAr: inv.client.nameAr,
        clientNameEn: inv.client.nameEn,
        clientEmail: inv.client.email,
      };
    });
}
