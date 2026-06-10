import type { BoothStatus } from "@/generated/prisma/enums";

export const BOOTH_STATUSES: BoothStatus[] = [
  "available",
  "reserved",
  "contracted",
  "production",
  "delivered",
];

export interface BoothGridItem {
  id: string;
  codeAr: string;
  codeEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  areaSqm: number | null;
  basePrice: number;
  status: BoothStatus;
  eventId: string;
  activeBooking: {
    id: string;
    price: number;
    notes: string | null;
    client: {
      id: string;
      nameAr: string;
      nameEn: string;
      companyNameAr: string | null;
      companyNameEn: string | null;
    };
  } | null;
}

export interface BoothEventOption {
  id: string;
  nameAr: string;
  nameEn: string;
}

export interface BoothClientOption {
  id: string;
  nameAr: string;
  nameEn: string;
  companyNameAr: string | null;
  companyNameEn: string | null;
}
