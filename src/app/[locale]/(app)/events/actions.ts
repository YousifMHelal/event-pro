"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { EVENT_STATUSES } from "@/lib/events-types";

const statusSchema = z.enum(EVENT_STATUSES as [string, ...string[]]);

const eventInputSchema = z
  .object({
    nameAr: z.string().min(1),
    nameEn: z.string().min(1),
    descriptionAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    venueAr: z.string().optional(),
    venueEn: z.string().optional(),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    status: statusSchema,
    clientId: z.string().min(1),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  });

const upsertSchema = z.object({
  eventId: z.string().optional(),
  event: eventInputSchema,
});

export type UpsertEventInput = z.infer<typeof upsertSchema>;

export type UpsertEventState = {
  error?: "validation" | "generic";
  success?: boolean;
};

export async function upsertEvent(input: UpsertEventInput): Promise<UpsertEventState> {
  const parsed = upsertSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation" };
  }

  const { eventId, event } = parsed.data;

  const data = {
    nameAr: event.nameAr,
    nameEn: event.nameEn,
    descriptionAr: event.descriptionAr || null,
    descriptionEn: event.descriptionEn || null,
    venueAr: event.venueAr || null,
    venueEn: event.venueEn || null,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    status: event.status as never,
    clientId: event.clientId,
  };

  try {
    if (eventId) {
      await prisma.event.update({ where: { id: eventId }, data });
    } else {
      await prisma.event.create({ data });
    }
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/events", "page");
  revalidatePath("/[locale]/(app)/events/[id]", "page");
  return { success: true };
}

export type DeleteEventState = {
  error?: "generic";
  success?: boolean;
};

export async function deleteEvent(eventId: string): Promise<DeleteEventState> {
  if (!eventId) return { error: "generic" };

  try {
    await prisma.event.delete({ where: { id: eventId } });
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/events", "page");
  return { success: true };
}

export async function deleteEventAndRedirect(locale: string, eventId: string) {
  const result = await deleteEvent(eventId);
  if (result.success) {
    redirect({ href: "/events", locale });
  }
  return result;
}
