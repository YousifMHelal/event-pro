import { prisma } from "@/lib/prisma";
import type { BoothGridItem, BoothEventOption, BoothClientOption } from "@/lib/booths-types";

export { BOOTH_STATUSES } from "@/lib/booths-types";
export type { BoothGridItem, BoothEventOption, BoothClientOption } from "@/lib/booths-types";

// Events that have at least one booth, for the floor-plan event selector.
export async function getEventOptionsWithBooths(): Promise<BoothEventOption[]> {
  return prisma.event.findMany({
    where: { booths: { some: {} } },
    orderBy: { startDate: "desc" },
    select: { id: true, nameAr: true, nameEn: true },
  });
}

export async function getBoothsForEvent(eventId: string): Promise<BoothGridItem[]> {
  const booths = await prisma.booth.findMany({
    where: { eventId },
    orderBy: { codeEn: "asc" },
    select: {
      id: true,
      codeAr: true,
      codeEn: true,
      descriptionAr: true,
      descriptionEn: true,
      areaSqm: true,
      basePrice: true,
      status: true,
      eventId: true,
      bookings: {
        where: { status: { in: ["held", "confirmed"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          price: true,
          notes: true,
          client: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              companyNameAr: true,
              companyNameEn: true,
            },
          },
        },
      },
    },
  });

  return booths.map((b) => ({
    id: b.id,
    codeAr: b.codeAr,
    codeEn: b.codeEn,
    descriptionAr: b.descriptionAr,
    descriptionEn: b.descriptionEn,
    areaSqm: b.areaSqm,
    basePrice: b.basePrice,
    status: b.status,
    eventId: b.eventId,
    activeBooking: b.bookings[0] ?? null,
  }));
}

export async function getClientOptionsForBooths(): Promise<BoothClientOption[]> {
  return prisma.client.findMany({
    orderBy: { nameEn: "asc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      companyNameAr: true,
      companyNameEn: true,
    },
  });
}
