import { getLocale, getTranslations } from "next-intl/server";
import { Users } from "lucide-react";
import { formatSar } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/events/payment-status-badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { EventParticipant } from "@/lib/events-types";

export async function ParticipantsTable({ participants }: { participants: EventParticipant[] }) {
  const locale = await getLocale();
  const t = await getTranslations("events.participants");

  return (
    <div className="border-border bg-surface shadow-card flex flex-col gap-4 rounded-lg border p-5">
      <div>
        <h2 className="text-foreground text-lg font-semibold">{t("title")}</h2>
        <p className="text-foreground-muted text-sm">{t("subtitle")}</p>
      </div>

      {participants.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="bg-surface-muted text-primary flex size-12 items-center justify-center rounded-full">
            <Users className="size-6" aria-hidden="true" />
          </span>
          <p className="text-foreground-muted text-sm">{t("empty")}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnClient")}</TableHead>
              <TableHead>{t("columnBooths")}</TableHead>
              <TableHead>{t("columnAmountPaid")}</TableHead>
              <TableHead>{t("columnTotal")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => {
              const clientName =
                locale === "ar" ? participant.client.nameAr : participant.client.nameEn;
              const companyName =
                locale === "ar"
                  ? participant.client.companyNameAr
                  : participant.client.companyNameEn;

              return (
                <TableRow key={participant.clientId}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">{clientName}</span>
                      {companyName && (
                        <span className="text-foreground-muted text-xs">{companyName}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {participant.booths.map((booth) => (
                        <span
                          key={booth.id}
                          className="border-border bg-surface-muted text-foreground-muted inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"
                        >
                          {locale === "ar" ? booth.codeAr : booth.codeEn}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-medium tabular-nums">
                    {formatSar(participant.paidAmountHalalas, locale)}
                  </TableCell>
                  <TableCell className="text-foreground-muted tabular-nums">
                    {formatSar(participant.totalAmountHalalas, locale)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={participant.paymentStatus} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
