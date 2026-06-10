import { useTranslations } from "next-intl";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { BoothStatus } from "@/generated/prisma/enums";

const STATUS_VARIANTS: Record<BoothStatus, BadgeProps["variant"]> = {
  available: "neutral",
  reserved: "info",
  contracted: "warn",
  production: "violet",
  delivered: "success",
};

export function BoothStatusBadge({ status }: { status: BoothStatus }) {
  const t = useTranslations("booths.status");
  return <Badge variant={STATUS_VARIANTS[status]}>{t(status)}</Badge>;
}
