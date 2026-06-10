import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { INVOICE_STATUS_COLORS, INSTALLMENT_STATUS_COLORS } from "@/lib/finance-types";
import type { InvoiceStatus, InstallmentStatus } from "@/lib/finance-types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  label: string;
}

export function InvoiceStatusBadge({ status, label }: InvoiceStatusBadgeProps) {
  const variant = INVOICE_STATUS_COLORS[status] as BadgeProps["variant"];
  return <Badge variant={variant}>{label}</Badge>;
}

interface InstallmentStatusBadgeProps {
  status: InstallmentStatus;
  label: string;
}

export function InstallmentStatusBadge({ status, label }: InstallmentStatusBadgeProps) {
  const variant = INSTALLMENT_STATUS_COLORS[status] as BadgeProps["variant"];
  return <Badge variant={variant}>{label}</Badge>;
}
