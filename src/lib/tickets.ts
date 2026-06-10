import { prisma } from "@/lib/prisma";
import type { TicketTypeItem, TicketItem, TicketEventOption } from "@/lib/tickets-types";

export type { TicketTypeItem, TicketItem, TicketEventOption } from "@/lib/tickets-types";

export async function getEventOptionsWithTicketTypes(): Promise<TicketEventOption[]> {
  return prisma.event.findMany({
    where: { ticketTypes: { some: {} } },
    orderBy: { startDate: "desc" },
    select: { id: true, nameAr: true, nameEn: true },
  });
}

export async function getTicketTypesForEvent(eventId: string): Promise<TicketTypeItem[]> {
  const types = await prisma.ticketType.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      descriptionAr: true,
      descriptionEn: true,
      price: true,
      quantity: true,
      eventId: true,
      event: { select: { nameAr: true, nameEn: true } },
      _count: { select: { tickets: { where: { status: { in: ["reserved", "paid"] } } } } },
    },
  });

  return types.map((tt) => ({
    id: tt.id,
    nameAr: tt.nameAr,
    nameEn: tt.nameEn,
    descriptionAr: tt.descriptionAr,
    descriptionEn: tt.descriptionEn,
    price: tt.price,
    quantity: tt.quantity,
    soldCount: tt._count.tickets,
    eventId: tt.eventId,
    eventNameAr: tt.event.nameAr,
    eventNameEn: tt.event.nameEn,
  }));
}

export async function getTicketsForType(ticketTypeId: string): Promise<TicketItem[]> {
  const tickets = await prisma.ticket.findMany({
    where: { ticketTypeId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      holderName: true,
      holderEmail: true,
      holderPhone: true,
      status: true,
      createdAt: true,
      ticketTypeId: true,
      ticketType: { select: { nameAr: true, nameEn: true } },
      checkIn: { select: { checkedInAt: true } },
    },
  });

  return tickets.map((t) => ({
    id: t.id,
    code: t.code,
    holderName: t.holderName,
    holderEmail: t.holderEmail,
    holderPhone: t.holderPhone,
    status: t.status,
    createdAt: t.createdAt,
    ticketTypeId: t.ticketTypeId,
    ticketTypeNameAr: t.ticketType.nameAr,
    ticketTypeNameEn: t.ticketType.nameEn,
    checkedInAt: t.checkIn?.checkedInAt ?? null,
  }));
}
