import type { EventStatus } from "@/generated/prisma/enums";

export type { EventStatus };

// ---- Query return shapes (no Prisma imports — safe for client components) ----

export interface ReportsKpis {
  totalRevenueHalalas: number; // booth revenue + ticket revenue, all events
  totalProductionCostHalalas: number;
  totalProfitHalalas: number;
  ticketRevenueHalalas: number;
  boothRevenueHalalas: number;
  overdueAmountHalalas: number;
  overdueCount: number;
}

export interface EventProfitRow {
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
  status: EventStatus;
  startDate: Date;
  ticketRevenueHalalas: number;
  boothRevenueHalalas: number;
  totalRevenueHalalas: number;
  productionCostHalalas: number;
  profitHalalas: number;
}

export interface TicketSalesRow {
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
  ticketsSold: number;
  ticketsTotal: number;
  revenueHalalas: number;
}

export interface BoothRevenueRow {
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
  boothsTotal: number;
  boothsBooked: number;
  revenueHalalas: number;
}

export interface ProductionCostRow {
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
  ordersCount: number;
  materialsCount: number;
  costHalalas: number;
}

export interface OverduePaymentRow {
  clientId: string;
  clientNameAr: string;
  clientNameEn: string;
  invoiceCount: number;
  amountHalalas: number;
}

export interface SalesPerformanceRow {
  ownerId: string;
  ownerNameAr: string;
  ownerNameEn: string;
  totalOpportunities: number;
  wonCount: number;
  lostCount: number;
  conversionRate: number; // 0-100
  wonValueHalalas: number;
  pipelineValueHalalas: number;
}
