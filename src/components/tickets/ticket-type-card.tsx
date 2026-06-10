"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Ticket, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IssueTicketDialog } from "@/components/tickets/issue-ticket-dialog";
import { TicketsListDialog } from "@/components/tickets/tickets-list-dialog";
import { formatSar, formatNumber, cn } from "@/lib/utils";
import type { TicketTypeItem } from "@/lib/tickets-types";

interface TicketTypeCardProps {
  ticketType: TicketTypeItem;
}

export function TicketTypeCard({ ticketType }: TicketTypeCardProps) {
  const t = useTranslations("tickets");
  const locale = useLocale();

  const [issueOpen, setIssueOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const name = locale === "ar" ? ticketType.nameAr : ticketType.nameEn;
  const description = locale === "ar" ? ticketType.descriptionAr : ticketType.descriptionEn;
  const price = ticketType.price === 0 ? t("free") : formatSar(ticketType.price, locale);
  const remaining = ticketType.quantity - ticketType.soldCount;
  const pct = ticketType.quantity > 0 ? (ticketType.soldCount / ticketType.quantity) * 100 : 0;
  const isSoldOut = remaining <= 0;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-surface text-info">
              <Ticket className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground leading-snug">{name}</h3>
              {description && (
                <p className="mt-0.5 text-xs text-foreground-muted line-clamp-2">{description}</p>
              )}
            </div>
          </div>
          <span className="shrink-0 font-semibold text-sm text-foreground">{price}</span>
        </div>

        {/* Capacity bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {t("card.sold", { sold: formatNumber(ticketType.soldCount, locale), total: formatNumber(ticketType.quantity, locale) })}
            </span>
            {isSoldOut ? (
              <Badge variant="danger" dot={false}>
                <AlertTriangle className="size-3" aria-hidden="true" />
                {t("card.soldOut")}
              </Badge>
            ) : (
              <span>{t("card.remaining", { n: formatNumber(remaining, locale) })}</span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100" role="progressbar" aria-valuenow={ticketType.soldCount} aria-valuemax={ticketType.quantity} aria-label={t("card.capacityLabel")}>
            <div
              className={cn("h-full rounded-full transition-all", pct >= 100 ? "bg-danger" : pct >= 80 ? "bg-warn" : "bg-accent")}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setListOpen(true)}
          >
            {t("card.viewTickets")}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={isSoldOut}
            onClick={() => setIssueOpen(true)}
          >
            {t("card.issue")}
          </Button>
        </div>
      </div>

      <IssueTicketDialog
        ticketType={ticketType}
        open={issueOpen}
        onOpenChange={setIssueOpen}
      />

      <TicketsListDialog
        ticketType={ticketType}
        open={listOpen}
        onOpenChange={setListOpen}
      />
    </>
  );
}
