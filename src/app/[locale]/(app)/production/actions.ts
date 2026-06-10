"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ---- Advance a production step ----

const advanceStepSchema = z.object({
  stepId: z.string().min(1),
  // next status to transition into
  toStatus: z.enum(["in_progress", "completed", "blocked", "pending"]),
});

export type AdvanceStepState = { error?: "validation" | "generic"; success?: boolean };

export async function advanceProductionStep(
  input: z.infer<typeof advanceStepSchema>,
): Promise<AdvanceStepState> {
  const parsed = advanceStepSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  const { stepId, toStatus } = parsed.data;

  try {
    const step = await prisma.productionStep.findUnique({
      where: { id: stepId },
      select: { productionOrderId: true, status: true },
    });
    if (!step) return { error: "generic" };

    await prisma.productionStep.update({
      where: { id: stepId },
      data: {
        status: toStatus,
        completedAt: toStatus === "completed" ? new Date() : null,
        startDate:
          toStatus === "in_progress"
            ? { set: new Date() }
            : undefined,
      },
    });

    // Sync the parent order status
    const allSteps = await prisma.productionStep.findMany({
      where: { productionOrderId: step.productionOrderId },
      select: { status: true },
    });

    const statuses = allSteps.map((s) => s.status);
    let orderStatus: "pending" | "in_progress" | "completed" | "cancelled" = "pending";
    if (statuses.every((s) => s === "completed")) {
      orderStatus = "completed";
    } else if (statuses.some((s) => s === "in_progress" || s === "completed")) {
      orderStatus = "in_progress";
    }

    await prisma.productionOrder.update({
      where: { id: step.productionOrderId },
      data: { status: orderStatus },
    });
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/production", "page");
  return { success: true };
}

// ---- Toggle a material checklist item ----

const toggleMaterialSchema = z.object({
  materialId: z.string().min(1),
  isChecked: z.boolean(),
});

export type ToggleMaterialState = { error?: "validation" | "generic"; success?: boolean };

export async function toggleMaterial(
  input: z.infer<typeof toggleMaterialSchema>,
): Promise<ToggleMaterialState> {
  const parsed = toggleMaterialSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  try {
    await prisma.material.update({
      where: { id: parsed.data.materialId },
      data: { isChecked: parsed.data.isChecked },
    });
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/production", "page");
  return { success: true };
}
