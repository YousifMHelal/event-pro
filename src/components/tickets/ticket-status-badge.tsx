import { Badge } from "@/components/ui/badge";
import { TICKET_STATUS_COLORS } from "@/lib/tickets-types";
import type { TicketStatus } from "@/generated/prisma/enums";

interface TicketStatusBadgeProps {
  status: TicketStatus;
  label: string;
}

export function TicketStatusBadge({ status, label }: TicketStatusBadgeProps) {
  const color = TICKET_STATUS_COLORS[status] as "success" | "warn" | "danger" | "neutral";
  return <Badge variant={color}>{label}</Badge>;
}
