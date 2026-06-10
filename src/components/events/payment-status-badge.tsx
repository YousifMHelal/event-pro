import { useTranslations } from "next-intl";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/generated/prisma/enums";

type PaymentStatus = InvoiceStatus | "no_invoice";

const STATUS_VARIANTS: Record<PaymentStatus, BadgeProps["variant"]> = {
  draft: "neutral",
  sent: "info",
  partially_paid: "warn",
  paid: "success",
  overdue: "danger",
  cancelled: "neutral",
  no_invoice: "neutral",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const t = useTranslations("events.paymentStatus");
  return <Badge variant={STATUS_VARIANTS[status]}>{t(status)}</Badge>;
}
