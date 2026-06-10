import type { EventStatus, BoothBookingStatus, InvoiceStatus } from "@/generated/prisma/enums";

export const EVENT_STATUSES: EventStatus[] = [
  "draft",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

export interface EventListItem {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  venueAr: string | null;
  venueEn: string | null;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  client: {
    id: string;
    nameAr: string;
    nameEn: string;
  };
  boothCount: number;
  confirmedRevenueHalalas: number;
}

export interface EventDetail {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  venueAr: string | null;
  venueEn: string | null;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  createdAt: Date;
  client: {
    id: string;
    nameAr: string;
    nameEn: string;
  };
  totalBooths: number;
  bookedBooths: number;
  expectedRevenueHalalas: number;
  collectedRevenueHalalas: number;
}

export interface EventFormValues {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  venueAr: string | null;
  venueEn: string | null;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  clientId: string;
}

export function toEventFormValues(
  event: Pick<
    EventListItem | EventDetail,
    | "id"
    | "nameAr"
    | "nameEn"
    | "descriptionAr"
    | "descriptionEn"
    | "venueAr"
    | "venueEn"
    | "startDate"
    | "endDate"
    | "status"
  > & { client: { id: string } },
): EventFormValues {
  return {
    id: event.id,
    nameAr: event.nameAr,
    nameEn: event.nameEn,
    descriptionAr: event.descriptionAr,
    descriptionEn: event.descriptionEn,
    venueAr: event.venueAr,
    venueEn: event.venueEn,
    startDate: event.startDate,
    endDate: event.endDate,
    status: event.status,
    clientId: event.client.id,
  };
}

export interface EventParticipant {
  clientId: string;
  client: {
    nameAr: string;
    nameEn: string;
    companyNameAr: string | null;
    companyNameEn: string | null;
  };
  booths: {
    id: string;
    codeAr: string;
    codeEn: string;
    status: BoothBookingStatus;
    price: number;
  }[];
  totalAmountHalalas: number;
  paidAmountHalalas: number;
  paymentStatus: InvoiceStatus | "no_invoice";
}
