import type {
  ProductionOrderStatus,
  ProductionStepStatus,
} from "@/generated/prisma/enums";

export type { ProductionOrderStatus, ProductionStepStatus };

// 7-step workflow in canonical display order.
// These names match the ProductionStep.nameEn values seeded for new orders.
export const WORKFLOW_STEPS = [
  "design_request",
  "approval",
  "materials",
  "in_production",
  "qa",
  "installation",
  "delivery",
] as const;

export type WorkflowStepKey = (typeof WORKFLOW_STEPS)[number];

export const STEP_LABEL_KEYS: Record<WorkflowStepKey, string> = {
  design_request: "steps.design_request",
  approval: "steps.approval",
  materials: "steps.materials",
  in_production: "steps.in_production",
  qa: "steps.qa",
  installation: "steps.installation",
  delivery: "steps.delivery",
};

export const ORDER_STATUS_COLORS: Record<ProductionOrderStatus, string> = {
  pending: "warn",
  in_progress: "info",
  completed: "success",
  cancelled: "danger",
};

export const STEP_STATUS_COLORS: Record<ProductionStepStatus, string> = {
  pending: "neutral",
  in_progress: "info",
  completed: "success",
  blocked: "danger",
};

// ---- Query return shapes ----

export interface MaterialItem {
  id: string;
  nameAr: string;
  nameEn: string;
  unitAr: string;
  unitEn: string;
  quantity: number;
  unitCost: number;
  isChecked: boolean;
  supplierAr: string | null;
  supplierEn: string | null;
}

export interface ProductionStepItem {
  id: string;
  nameAr: string;
  nameEn: string;
  sequence: number;
  status: ProductionStepStatus;
  startDate: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
  notes: string | null;
}

export interface ProductionOrderItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  status: ProductionOrderStatus;
  dueDate: Date | null;
  eventId: string;
  eventNameAr: string;
  eventNameEn: string;
  steps: ProductionStepItem[];
  materials: MaterialItem[];
}

export interface ProductionEventOption {
  id: string;
  nameAr: string;
  nameEn: string;
}
