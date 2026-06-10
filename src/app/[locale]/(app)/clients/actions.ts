"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PIPELINE_STAGES } from "@/lib/crm-types";

const stageSchema = z.enum(PIPELINE_STAGES as [string, ...string[]]);

const moveStageSchema = z.object({
  opportunityId: z.string().min(1),
  stage: stageSchema,
});

export async function moveOpportunityStage(
  input: z.infer<typeof moveStageSchema>,
) {
  const parsed = moveStageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation" as const };
  }

  await prisma.opportunity.update({
    where: { id: parsed.data.opportunityId },
    data: { stage: parsed.data.stage as never },
  });

  revalidatePath("/[locale]/(app)/clients", "page");
  return { success: true as const };
}

const clientInputSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  companyNameAr: z.string().optional(),
  companyNameEn: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

const opportunityInputSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  stage: stageSchema,
  estimatedValue: z.coerce.number().int().min(0),
  expectedCloseDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
  ownerId: z.string().optional().or(z.literal("")),
});

const upsertSchema = z.object({
  opportunityId: z.string().optional(),
  clientId: z.string().optional(),
  client: clientInputSchema.optional(),
  opportunity: opportunityInputSchema,
});

export type UpsertOpportunityInput = z.infer<typeof upsertSchema>;

export type UpsertOpportunityState = {
  error?: "validation" | "generic";
  success?: boolean;
};

export async function upsertOpportunity(
  input: UpsertOpportunityInput,
): Promise<UpsertOpportunityState> {
  const parsed = upsertSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation" };
  }

  const { opportunityId, clientId, client, opportunity } = parsed.data;

  if (!clientId && !client) {
    return { error: "validation" };
  }

  try {
    let resolvedClientId: string;

    if (!client && clientId) {
      // Existing client selected, no edits to client fields submitted.
      resolvedClientId = clientId;
    } else if (client) {
      const clientData = {
        nameAr: client.nameAr,
        nameEn: client.nameEn,
        companyNameAr: client.companyNameAr || null,
        companyNameEn: client.companyNameEn || null,
        email: client.email || null,
        phone: client.phone || null,
      };

      resolvedClientId = clientId
        ? (
            await prisma.client.update({
              where: { id: clientId },
              data: clientData,
            })
          ).id
        : (await prisma.client.create({ data: clientData })).id;
    } else {
      // Unreachable: the guard above ensures clientId or client is set.
      return { error: "validation" };
    }

    const opportunityData = {
      titleAr: opportunity.titleAr,
      titleEn: opportunity.titleEn,
      stage: opportunity.stage as never,
      estimatedValue: opportunity.estimatedValue,
      expectedCloseDate: opportunity.expectedCloseDate
        ? new Date(opportunity.expectedCloseDate)
        : null,
      notes: opportunity.notes || null,
      ownerId: opportunity.ownerId || null,
      clientId: resolvedClientId,
    };

    if (opportunityId) {
      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: opportunityData,
      });
    } else {
      await prisma.opportunity.create({ data: opportunityData });
    }
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/clients", "page");
  return { success: true };
}
