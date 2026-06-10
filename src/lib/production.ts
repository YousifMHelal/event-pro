import { prisma } from "@/lib/prisma";
import type {
  ProductionOrderItem,
  ProductionEventOption,
} from "@/lib/production-types";

export type {
  ProductionOrderItem,
  ProductionStepItem,
  MaterialItem,
  ProductionEventOption,
} from "@/lib/production-types";

export async function getProductionEventOptions(): Promise<ProductionEventOption[]> {
  return prisma.event.findMany({
    where: { productionOrders: { some: {} } },
    orderBy: { startDate: "desc" },
    select: { id: true, nameAr: true, nameEn: true },
  });
}

export async function getProductionOrdersForEvent(
  eventId: string,
): Promise<ProductionOrderItem[]> {
  const orders = await prisma.productionOrder.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
    include: {
      event: { select: { nameAr: true, nameEn: true } },
      steps: { orderBy: { sequence: "asc" } },
      materials: { orderBy: { createdAt: "asc" } },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    titleAr: o.titleAr,
    titleEn: o.titleEn,
    descriptionAr: o.descriptionAr,
    descriptionEn: o.descriptionEn,
    status: o.status,
    dueDate: o.dueDate,
    eventId: o.eventId,
    eventNameAr: o.event.nameAr,
    eventNameEn: o.event.nameEn,
    steps: o.steps.map((s) => ({
      id: s.id,
      nameAr: s.nameAr,
      nameEn: s.nameEn,
      sequence: s.sequence,
      status: s.status,
      startDate: s.startDate,
      dueDate: s.dueDate,
      completedAt: s.completedAt,
      notes: s.notes,
    })),
    materials: o.materials.map((m) => ({
      id: m.id,
      nameAr: m.nameAr,
      nameEn: m.nameEn,
      unitAr: m.unitAr,
      unitEn: m.unitEn,
      quantity: m.quantity,
      unitCost: m.unitCost,
      isChecked: m.isChecked,
      supplierAr: m.supplierAr,
      supplierEn: m.supplierEn,
    })),
  }));
}
