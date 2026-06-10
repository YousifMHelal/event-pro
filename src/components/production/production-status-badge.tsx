import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import type {
  ProductionOrderStatus,
  ProductionStepStatus,
} from "@/lib/production-types";
import { ORDER_STATUS_COLORS, STEP_STATUS_COLORS } from "@/lib/production-types";

interface OrderStatusBadgeProps {
  status: ProductionOrderStatus;
  label: string;
}

export function OrderStatusBadge({ status, label }: OrderStatusBadgeProps) {
  const variant = ORDER_STATUS_COLORS[status] as BadgeProps["variant"];
  return <Badge variant={variant}>{label}</Badge>;
}

interface StepStatusBadgeProps {
  status: ProductionStepStatus;
  label: string;
}

export function StepStatusBadge({ status, label }: StepStatusBadgeProps) {
  const variant = STEP_STATUS_COLORS[status] as BadgeProps["variant"];
  return <Badge variant={variant}>{label}</Badge>;
}
