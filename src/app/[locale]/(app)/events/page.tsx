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
import { EmptyState } from "@/components/ui/empty-state";
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

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={t("list.empty")}
          description={t("list.emptyDescription")}
          action={<NewEventButton clients={clients} />}
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="flex flex-col gap-3 lg:hidden">
            {events.map((event) => {
              const name = locale === "ar" ? event.nameAr : event.nameEn;
              const clientName =
                locale === "ar" ? event.client.nameAr : event.client.nameEn;
              const venue = locale === "ar" ? event.venueAr : event.venueEn;

              return (
                <div
                  key={event.id}
                  className="border-border bg-surface shadow-card flex flex-col gap-3 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/events/${event.id}`}
                        className="text-foreground hover:text-primary focus-visible:ring-ring rounded-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        {name}
                      </Link>
                      <p className="text-sm text-foreground-muted">{clientName}</p>
                    </div>
                    <EventStatusBadge status={event.status} />
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <dt className="text-foreground-muted">{t("list.columnDates")}</dt>
                      <dd className="text-foreground whitespace-nowrap">
                        {dateFormatter.formatRange(event.startDate, event.endDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground-muted">{t("list.columnVenue")}</dt>
                      <dd className="text-foreground">
                        {venue ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                            {venue}
                          </span>
                        ) : (
                          t("list.noVenue")
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground-muted">{t("list.columnBooths")}</dt>
                      <dd className="text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Store className="size-3.5 shrink-0" aria-hidden="true" />
                          {formatNumber(event.boothCount, locale)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-foreground-muted">{t("list.columnRevenue")}</dt>
                      <dd className="font-medium tabular-nums text-foreground">
                        {formatSar(event.confirmedRevenueHalalas, locale)}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex justify-end border-t border-border pt-2">
                    <EventRowActions
                      event={toEventFormValues(event)}
                      eventName={name}
                      clients={clients}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="border-border bg-surface shadow-card hidden overflow-hidden rounded-lg border lg:block">
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
          </div>
        </>
      )}
    </div>
  );
}
