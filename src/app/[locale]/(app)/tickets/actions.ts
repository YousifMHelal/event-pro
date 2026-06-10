"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
// ---- Issue a single ticket ----

const issueTicketSchema = z.object({
  ticketTypeId: z.string().min(1),
  holderName: z.string().min(1).max(200),
  holderEmail: z.string().email().optional().or(z.literal("")),
  holderPhone: z.string().max(30).optional().or(z.literal("")),
});

export type IssueTicketState = {
  error?: "validation" | "sold_out" | "generic";
  code?: string; // ticket code on success
  success?: boolean;
};

export async function issueTicket(
  input: z.infer<typeof issueTicketSchema>,
): Promise<IssueTicketState> {
  const parsed = issueTicketSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  const { ticketTypeId, holderName, holderEmail, holderPhone } = parsed.data;

  try {
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
      select: { id: true, quantity: true, _count: { select: { tickets: { where: { status: { in: ["reserved", "paid"] } } } } } },
    });
    if (!ticketType) return { error: "generic" };

    if (ticketType._count.tickets >= ticketType.quantity) return { error: "sold_out" };

    const code = `TKT-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

    await prisma.ticket.create({
      data: {
        code,
        holderName,
        holderEmail: holderEmail || null,
        holderPhone: holderPhone || null,
        status: "paid",
        ticketTypeId,
      },
    });

    revalidatePath("/[locale]/(app)/tickets", "page");
    return { success: true, code };
  } catch {
    return { error: "generic" };
  }
}

// ---- Add a ticket type ----

const addTicketTypeSchema = z.object({
  eventId: z.string().min(1),
  nameAr: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  descriptionAr: z.string().max(500).optional().or(z.literal("")),
  descriptionEn: z.string().max(500).optional().or(z.literal("")),
  price: z.number().int().min(0), // halalas
  quantity: z.number().int().min(1),
});

export type AddTicketTypeState = { error?: "validation" | "generic"; success?: boolean };

export async function addTicketType(
  input: z.infer<typeof addTicketTypeSchema>,
): Promise<AddTicketTypeState> {
  const parsed = addTicketTypeSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  const { eventId, nameAr, nameEn, descriptionAr, descriptionEn, price, quantity } = parsed.data;

  try {
    await prisma.ticketType.create({
      data: {
        eventId,
        nameAr,
        nameEn,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
        price,
        quantity,
      },
    });
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/tickets", "page");
  return { success: true };
}
