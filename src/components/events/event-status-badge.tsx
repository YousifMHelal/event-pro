import { useTranslations } from "next-intl";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { EventStatus } from "@/generated/prisma/enums";

const STATUS_VARIANTS: Record<EventStatus, BadgeProps["variant"]> = {
  draft: "neutral",
  confirmed: "info",
  in_progress: "warn",
  completed: "success",
  cancelled: "danger",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const t = useTranslations("events.status");
  return <Badge variant={STATUS_VARIANTS[status]}>{t(status)}</Badge>;
}
