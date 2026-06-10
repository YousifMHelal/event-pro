import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Store } from "lucide-react";
import { getEventDetail, getEventParticipants, getClientOptions, toEventFormValues } from "@/lib/events";
import { formatSar, formatNumber } from "@/lib/utils";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { RevenueProgress } from "@/components/events/revenue-progress";
import { ParticipantsTable } from "@/components/events/participants-table";
import { EventRowActions } from "@/components/events/event-row-actions";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("events");

  const event = await getEventDetail(id);
  if (!event) notFound();

  const [participants, clients] = await Promise.all([
    getEventParticipants(id),
    getClientOptions(),
  ]);

  const BackIcon = locale === "ar" ? ArrowRight : ArrowLeft;

  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const name = locale === "ar" ? event.nameAr : event.nameEn;
  const description = locale === "ar" ? event.descriptionAr : event.descriptionEn;
  const venue = locale === "ar" ? event.venueAr : event.venueEn;
  const clientName = locale === "ar" ? event.client.nameAr : event.client.nameEn;

  const revenuePct =
    event.expectedRevenueHalalas > 0
      ? (event.collectedRevenueHalalas / event.expectedRevenueHalalas) * 100
      : 0;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/events"
          className="text-foreground-muted hover:text-foreground focus-visible:ring-ring inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <BackIcon className="size-4" aria-hidden="true" />
          {t("detail.back")}
        </Link>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-semibold">{name}</h1>
            <p className="text-foreground-muted mt-1 text-base">{clientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <EventStatusBadge status={event.status} />
            <EventRowActions
              event={toEventFormValues(event)}
              eventName={name}
              clients={clients}
              redirectLocale={locale}
            />
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="border-border bg-surface shadow-card grid grid-cols-1 gap-6 rounded-lg border p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground-muted flex items-center gap-1.5 text-sm font-medium">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            {t("detail.dates")}
          </p>
          <p className="text-foreground text-sm">
            {dateFormatter.formatRange(event.startDate, event.endDate)}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-foreground-muted flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {t("detail.venue")}
          </p>
          <p className="text-foreground text-sm">{venue ?? t("detail.noVenue")}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-foreground-muted flex items-center gap-1.5 text-sm font-medium">
            <Store className="size-4 shrink-0" aria-hidden="true" />
            {t("detail.boothsBooked")}
          </p>
          <p className="text-foreground text-sm">
            {t("detail.boothsBookedDesc", {
              booked: formatNumber(event.bookedBooths, locale),
              total: formatNumber(event.totalBooths, locale),
            })}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
          <p className="text-foreground-muted text-sm font-medium">{t("detail.description")}</p>
          <p className="text-foreground text-sm">{description ?? t("detail.noDescription")}</p>
        </div>
      </div>

      {/* Revenue progress */}
      <div className="border-border bg-surface shadow-card flex flex-col gap-4 rounded-lg border p-5">
        <div>
          <h2 className="text-foreground text-lg font-semibold">{t("detail.revenueProgress")}</h2>
          {event.expectedRevenueHalalas > 0 && (
            <p className="text-foreground-muted text-sm">
              {t("detail.revenueProgressDesc", {
                collected: formatSar(event.collectedRevenueHalalas, locale),
                expected: formatSar(event.expectedRevenueHalalas, locale),
              })}
            </p>
          )}
        </div>
        {event.expectedRevenueHalalas > 0 ? (
          <RevenueProgress
            collected={formatSar(event.collectedRevenueHalalas, locale)}
            expected={formatSar(event.expectedRevenueHalalas, locale)}
            pct={revenuePct}
          />
        ) : (
          <p className="text-foreground-muted text-sm">{t("detail.noRevenue")}</p>
        )}
      </div>

      {/* Participants */}
      <ParticipantsTable participants={participants} />
    </div>
  );
}
