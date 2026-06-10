"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { QrCode, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TicketQR } from "@/components/tickets/ticket-qr";
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge";
import type { TicketTypeItem, TicketItem } from "@/lib/tickets-types";

interface TicketsListDialogProps {
  ticketType: TicketTypeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketsListDialog({ ticketType, open, onOpenChange }: TicketsListDialogProps) {
  const t = useTranslations("tickets");
  const locale = useLocale();

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/tickets?typeId=${ticketType.id}`)
      .then((r) => r.json())
      .then((data) => setTickets(data))
      .finally(() => setLoading(false));
  }, [open, ticketType.id]);

  const typeName = locale === "ar" ? ticketType.nameAr : ticketType.nameEn;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("list.title")}</DialogTitle>
          <DialogDescription>{typeName}</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 min-h-0">
          {loading ? (
            <div className="flex flex-col gap-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-100" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground-muted">{t("list.empty")}</p>
          ) : (
            <div className="flex flex-col gap-2 py-1">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-border bg-surface">
                  {/* Row */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start hover:bg-neutral-50 transition-colors rounded-lg"
                    onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                    aria-expanded={expandedId === ticket.id}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-medium text-sm text-foreground truncate">{ticket.holderName}</span>
                      <span className="font-mono text-xs text-foreground-muted">{ticket.code}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TicketStatusBadge
                        status={ticket.status}
                        label={t(`status.${ticket.status}`)}
                      />
                      <QrCode className="size-4 text-foreground-muted" aria-hidden="true" />
                    </div>
                  </button>

                  {/* Expanded: QR + details */}
                  {expandedId === ticket.id && (
                    <div className="border-t border-border px-4 py-4 flex flex-col items-center gap-3">
                      <TicketQR code={ticket.code} size={140} />
                      <div className="w-full flex flex-col gap-1 text-sm">
                        {ticket.holderEmail && (
                          <span className="flex items-center gap-1.5 text-foreground-muted">
                            <Mail className="size-3.5" aria-hidden="true" />
                            {ticket.holderEmail}
                          </span>
                        )}
                        {ticket.holderPhone && (
                          <span className="flex items-center gap-1.5 text-foreground-muted">
                            <Phone className="size-3.5" aria-hidden="true" />
                            {ticket.holderPhone}
                          </span>
                        )}
                        {ticket.checkedInAt && (
                          <span className="text-success text-xs font-medium">
                            {t("list.checkedIn", { date: new Date(ticket.checkedInAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-SA") })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
