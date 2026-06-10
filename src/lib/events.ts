import { prisma } from "@/lib/prisma";
import type { EventListItem, EventDetail, EventFormValues, EventParticipant } from "@/lib/events-types";

export { EVENT_STATUSES, toEventFormValues } from "@/lib/events-types";
export type { EventListItem, EventDetail, EventFormValues, EventParticipant } from "@/lib/events-types";
export { getClientOptions } from "@/lib/crm";

export async function getEventsList(): Promise<EventListItem[]> {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      descriptionAr: true,
      descriptionEn: true,
      venueAr: true,
      venueEn: true,
      startDate: true,
      endDate: true,
      status: true,
      client: {
        select: { id: true, nameAr: true, nameEn: true },
      },
      boothBookings: {
        where: { status: "confirmed" },
        select: { price: true },
      },
      booths: {
        select: { id: true },
      },
    },
  });

  return events.map((e) => ({
    id: e.id,
    nameAr: e.nameAr,
    nameEn: e.nameEn,
    descriptionAr: e.descriptionAr,
    descriptionEn: e.descriptionEn,
    venueAr: e.venueAr,
    venueEn: e.venueEn,
    startDate: e.startDate,
    endDate: e.endDate,
    status: e.status,
    client: e.client,
    boothCount: e.booths.length,
    confirmedRevenueHalalas: e.boothBookings.reduce((sum, b) => sum + b.price, 0),
  }));
}

export async function getEventFormValues(id: string): Promise<EventFormValues | null> {
  return prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      descriptionAr: true,
      descriptionEn: true,
      venueAr: true,
      venueEn: true,
      startDate: true,
      endDate: true,
      status: true,
      clientId: true,
    },
  });
}

export async function getEventDetail(id: string): Promise<EventDetail | null> {
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      descriptionAr: true,
      descriptionEn: true,
      venueAr: true,
      venueEn: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      client: {
        select: { id: true, nameAr: true, nameEn: true },
      },
      booths: {
        select: { id: true, status: true },
      },
      boothBookings: {
        where: { status: "confirmed" },
        select: { price: true },
      },
      invoices: {
        select: {
          totalAmount: true,
          payments: {
            where: { status: "completed" },
            select: { amount: true },
          },
        },
      },
    },
  });

  if (!event) return null;

  const expectedRevenueHalalas = event.boothBookings.reduce((sum, b) => sum + b.price, 0);
  const collectedRevenueHalalas = event.invoices.reduce(
    (sum, inv) => sum + inv.payments.reduce((s, p) => s + p.amount, 0),
    0,
  );

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
    createdAt: event.createdAt,
    client: event.client,
    totalBooths: event.booths.length,
    bookedBooths: event.booths.filter((b) => b.status !== "available").length,
    expectedRevenueHalalas,
    collectedRevenueHalalas,
  };
}

// One row per client with active booth bookings on this event, joined with
// that client's invoices for this event to derive amount paid + payment status.
export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  const bookings = await prisma.boothBooking.findMany({
    where: { eventId, status: { not: "cancelled" } },
    select: {
      status: true,
      price: true,
      clientId: true,
      client: {
        select: { nameAr: true, nameEn: true, companyNameAr: true, companyNameEn: true },
      },
      booth: {
        select: { id: true, codeAr: true, codeEn: true },
      },
    },
  });

  if (bookings.length === 0) return [];

  const clientIds = [...new Set(bookings.map((b) => b.clientId))];

  const invoices = await prisma.invoice.findMany({
    where: { eventId, clientId: { in: clientIds } },
    select: {
      clientId: true,
      status: true,
      totalAmount: true,
      payments: {
        where: { status: "completed" },
        select: { amount: true },
      },
    },
  });

  const byClient = new Map<string, EventParticipant>();

  for (const booking of bookings) {
    let participant = byClient.get(booking.clientId);
    if (!participant) {
      participant = {
        clientId: booking.clientId,
        client: booking.client,
        booths: [],
        totalAmountHalalas: 0,
        paidAmountHalalas: 0,
        paymentStatus: "no_invoice",
      };
      byClient.set(booking.clientId, participant);
    }
    participant.booths.push({
      id: booking.booth.id,
      codeAr: booking.booth.codeAr,
      codeEn: booking.booth.codeEn,
      status: booking.status,
      price: booking.price,
    });
  }

  for (const invoice of invoices) {
    const participant = byClient.get(invoice.clientId);
    if (!participant) continue;
    participant.totalAmountHalalas += invoice.totalAmount;
    participant.paidAmountHalalas += invoice.payments.reduce((s, p) => s + p.amount, 0);
    // Use the most "advanced" status if there are multiple invoices for this client/event.
    if (participant.paymentStatus === "no_invoice") {
      participant.paymentStatus = invoice.status;
    } else if (participant.paymentStatus !== "overdue") {
      const priority: Record<string, number> = {
        draft: 0,
        sent: 1,
        partially_paid: 2,
        paid: 3,
        overdue: 4,
        cancelled: 0,
      };
      if ((priority[invoice.status] ?? 0) > (priority[participant.paymentStatus] ?? 0)) {
        participant.paymentStatus = invoice.status;
      }
    }
  }

  return [...byClient.values()];
}
