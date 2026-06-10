import type { InvoiceStatus, PaymentMethod, InstallmentStatus } from "@/generated/prisma/enums";

export type { InvoiceStatus, PaymentMethod, InstallmentStatus };

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "neutral",
  sent: "info",
  partially_paid: "warn",
  paid: "success",
  overdue: "danger",
  cancelled: "neutral",
};

export const INSTALLMENT_STATUS_COLORS: Record<InstallmentStatus, string> = {
  pending: "neutral",
  paid: "success",
  overdue: "danger",
};

export const PAYMENT_METHODS: PaymentMethod[] = ["cash", "bank_transfer", "card", "online"];

export const AGING_BUCKETS = ["current", "1-30", "31-60", "60+"] as const;
export type AgingBucket = (typeof AGING_BUCKETS)[number];

// ---- Query return shapes (no Prisma imports — safe for client components) ----

export interface InstallmentItem {
  id: string;
  amount: number; // halalas
  dueDate: Date;
  status: InstallmentStatus;
}

export interface PaymentItem {
  id: string;
  amount: number; // halalas
  method: PaymentMethod;
  paidAt: Date;
  reference: string | null;
  notes: string | null;
}

export interface InvoiceItem {
  id: string;
  number: string;
  status: InvoiceStatus;
  totalAmount: number; // halalas
  paidAmount: number; // halalas, sum of completed payments
  balance: number; // halalas, totalAmount - paidAmount
  issueDate: Date;
  dueDate: Date | null;
  clientId: string;
  clientNameAr: string;
  clientNameEn: string;
  eventId: string | null;
  eventNameAr: string | null;
  eventNameEn: string | null;
  installments: InstallmentItem[];
  payments: PaymentItem[];
}

export interface FinanceKpis {
  totalOutstandingHalalas: number;
  overdueAmountHalalas: number;
  overdueCount: number;
  collectedThisMonthHalalas: number;
  totalInvoicedHalalas: number;
}

export interface AgingReportRow {
  bucket: AgingBucket;
  amountHalalas: number;
  count: number;
}

export interface OverdueInvoiceItem {
  id: string;
  number: string;
  totalAmount: number;
  balance: number;
  dueDate: Date;
  daysOverdue: number;
  clientId: string;
  clientNameAr: string;
  clientNameEn: string;
  clientEmail: string | null;
}
