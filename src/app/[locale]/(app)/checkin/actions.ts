"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { CheckInResult } from "@/lib/tickets-types";

const checkInSchema = z.object({ code: z.string().min(1) });

export async function checkInByCode(input: { code: string }): Promise<CheckInResult> {
  const parsed = checkInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "not_found" };

  const session = await auth();

  const ticket = await prisma.ticket.findUnique({
    where: { code: parsed.data.code.trim().toUpperCase() },
    select: {
      id: true,
      holderName: true,
      status: true,
      checkIn: { select: { id: true } },
      ticketType: { select: { nameAr: true, nameEn: true } },
    },
  });

  if (!ticket) return { ok: false, reason: "not_found" };
  if (ticket.checkIn) return { ok: false, reason: "already_checked_in" };
  if (ticket.status !== "paid" && ticket.status !== "reserved") {
    return { ok: false, reason: "invalid_status" };
  }

  await prisma.checkIn.create({
    data: {
      ticketId: ticket.id,
      scannedById: session?.user?.id ?? null,
    },
  });

  revalidatePath("/[locale]/(app)/checkin", "page");

  return {
    ok: true,
    holderName: ticket.holderName,
    ticketTypeNameAr: ticket.ticketType.nameAr,
    ticketTypeNameEn: ticket.ticketType.nameEn,
  };
}
