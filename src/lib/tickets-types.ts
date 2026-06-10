import type { TicketStatus } from "@/generated/prisma/enums";

export type { TicketStatus };

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  reserved: "warn",
  paid: "success",
  cancelled: "danger",
  refunded: "neutral",
};

// ---- Query return shapes (no Prisma imports — safe for client components) ----

export interface TicketTypeItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  price: number; // halalas
  quantity: number;
  soldCount: number;
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
}

export interface TicketItem {
  id: string;
  code: string;
  holderName: string;
  holderEmail: string | null;
  holderPhone: string | null;
  status: TicketStatus;
  createdAt: Date;
  ticketTypeId: string;
  ticketTypeNameAr: string;
  ticketTypeNameEn: string;
  checkedInAt: Date | null;
}

export interface TicketEventOption {
  id: string;
  nameAr: string;
  nameEn: string;
}

// Check-in result shapes
export type CheckInResult =
  | { ok: true; holderName: string; ticketTypeNameAr: string; ticketTypeNameEn: string }
  | { ok: false; reason: "not_found" | "already_checked_in" | "invalid_status" };
