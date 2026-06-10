"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { BOOTH_STATUSES } from "@/lib/booths-types";

const statusSchema = z.enum(BOOTH_STATUSES as [string, ...string[]]);

const assignBoothSchema = z.object({
  boothId: z.string().min(1),
  status: statusSchema,
  clientId: z.string().optional().or(z.literal("")),
  price: z.coerce.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export type AssignBoothInput = z.infer<typeof assignBoothSchema>;

export type AssignBoothState = {
  error?: "validation" | "generic";
  success?: boolean;
};

const BOOKED_STATUSES = ["reserved", "contracted", "production", "delivered"] as const;

export async function assignBooth(input: AssignBoothInput): Promise<AssignBoothState> {
  const parsed = assignBoothSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation" };
  }

  const { boothId, status, clientId, price, notes } = parsed.data;
  const isBooked = (BOOKED_STATUSES as readonly string[]).includes(status);

  if (isBooked && !clientId) {
    return { error: "validation" };
  }

  try {
    const booth = await prisma.booth.findUnique({
      where: { id: boothId },
      select: { eventId: true, basePrice: true },
    });
    if (!booth) {
      return { error: "generic" };
    }

    const existingBooking = await prisma.boothBooking.findFirst({
      where: { boothId, status: { in: ["held", "confirmed"] } },
      orderBy: { createdAt: "desc" },
    });

    if (isBooked && clientId) {
      const bookingStatus = status === "reserved" ? "held" : "confirmed";
      const bookingData = {
        boothId,
        eventId: booth.eventId,
        clientId,
        price: price ?? booth.basePrice,
        status: bookingStatus,
        notes: notes || null,
      } as const;

      if (existingBooking) {
        await prisma.boothBooking.update({
          where: { id: existingBooking.id },
          data: bookingData,
        });
      } else {
        await prisma.boothBooking.create({ data: bookingData });
      }
    } else if (existingBooking) {
      // Status moved back to "available" — release the active booking.
      await prisma.boothBooking.update({
        where: { id: existingBooking.id },
        data: { status: "cancelled" },
      });
    }

    await prisma.booth.update({
      where: { id: boothId },
      data: { status: status as never },
    });
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/booths", "page");
  return { success: true };
}
