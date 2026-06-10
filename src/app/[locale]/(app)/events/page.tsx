import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CalendarDays, MapPin, Store } from "lucide-react";
import {
  getEventsList,
  getClientOptions,
  toEventFormValues,
} from "@/lib/events";
import { formatSar, formatNumber } from "@/lib/utils";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { NewEventButton } from "@/components/events/new-event-button";
import { EventRowActions } from "@/components/events/event-row-actions";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function EventsPage() {
  const locale = await getLocale();
  const t = await getTranslations("events");

  const [events, clients] = await Promise.all([
    getEventsList(),
    getClientOptions(),
  ]);

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-SA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-semibold">
            {t("title")}
          </h1>
          <p className="text-foreground-muted mt-1 text-base">
            {t("subtitle")}
          </p>
        </div>
        <NewEventButton clients={clients} />
      </div>

      <div className="border-border bg-surface shadow-card overflow-hidden rounded-lg border">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="bg-surface-muted text-primary flex size-12 items-center justify-center rounded-full">
              <CalendarDays className="size-6" aria-hidden="true" />
            </span>
            <p className="text-foreground-muted text-sm">{t("list.empty")}</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("list.columnEvent")}</TableHead>
                <TableHead>{t("list.columnClient")}</TableHead>
                <TableHead>{t("list.columnDates")}</TableHead>
                <TableHead>{t("list.columnVenue")}</TableHead>
                <TableHead>{t("list.columnBooths")}</TableHead>
                <TableHead>{t("list.columnRevenue")}</TableHead>
                <TableHead>{t("list.columnStatus")}</TableHead>
                <TableHead>{t("list.columnActions")}</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">{t("list.columnActions")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const name = locale === "ar" ? event.nameAr : event.nameEn;
                const clientName =
                  locale === "ar" ? event.client.nameAr : event.client.nameEn;
                const venue = locale === "ar" ? event.venueAr : event.venueEn;

                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Link
                        href={`/events/${event.id}`}
                        className="text-foreground hover:text-primary focus-visible:ring-ring rounded-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {clientName}
                    </TableCell>
                    <TableCell className="text-foreground-muted whitespace-nowrap">
                      {dateFormatter.formatRange(
                        event.startDate,
                        event.endDate,
                      )}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {venue ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          {venue}
                        </span>
                      ) : (
                        t("list.noVenue")
                      )}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Store
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        {formatNumber(event.boothCount, locale)}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground font-medium tabular-nums">
                      {formatSar(event.confirmedRevenueHalalas, locale)}
                    </TableCell>
                    <TableCell>
                      <EventStatusBadge status={event.status} />
                    </TableCell>
                    <TableCell>
                      <EventRowActions
                        event={toEventFormValues(event)}
                        eventName={name}
                        clients={clients}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
