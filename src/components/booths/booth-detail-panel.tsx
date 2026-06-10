"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Building2, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BoothStatusBadge } from "@/components/booths/booth-status-badge";
import { AssignBoothDialog } from "@/components/booths/assign-booth-dialog";
import { formatSar } from "@/lib/utils";
import type { BoothGridItem, BoothClientOption } from "@/lib/booths-types";

interface BoothDetailPanelProps {
  booth: BoothGridItem | null;
  clients: BoothClientOption[];
}

export function BoothDetailPanel({ booth, clients }: BoothDetailPanelProps) {
  const t = useTranslations("booths.detail");
  const locale = useLocale();
  const [assignOpen, setAssignOpen] = useState(false);

  if (!booth) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
              <LayoutGrid className="size-6" aria-hidden="true" />
            </span>
            <p className="text-sm text-foreground-muted">{t("selectPrompt")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const code = locale === "ar" ? booth.codeAr : booth.codeEn;
  const description = locale === "ar" ? booth.descriptionAr : booth.descriptionEn;
  const client = booth.activeBooking?.client;
  const clientName = client ? (locale === "ar" ? client.nameAr : client.nameEn) : null;
  const companyName = client
    ? locale === "ar"
      ? client.companyNameAr
      : client.companyNameEn
    : null;

  const isAssigned = booth.status !== "available";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-foreground-muted">{t("code")}</p>
              <p className="text-xl font-semibold tabular-nums text-foreground">{code}</p>
            </div>
            <BoothStatusBadge status={booth.status} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-foreground-muted">{t("area")}</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {booth.areaSqm ? `${booth.areaSqm} m²` : t("noArea")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-foreground-muted">{t("basePrice")}</dt>
              <dd className="font-medium tabular-nums text-foreground">
                {formatSar(booth.basePrice, locale)}
              </dd>
            </div>
          </dl>

          <div>
            <p className="text-xs text-foreground-muted">{t("description")}</p>
            <p className="mt-1 text-sm text-foreground">
              {description || t("noDescription")}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-muted p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              {t("client")}
            </p>
            {clientName ? (
              <div className="mt-2 flex flex-col gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{clientName}</p>
                  {companyName && (
                    <p className="text-xs text-foreground-muted">{companyName}</p>
                  )}
                </div>
                {booth.activeBooking && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <p className="text-xs text-foreground-muted">{t("bookingPrice")}</p>
                      <p className="font-medium tabular-nums text-foreground">
                        {formatSar(booth.activeBooking.price, locale)}
                      </p>
                    </div>
                  </div>
                )}
                {booth.activeBooking?.notes && (
                  <div>
                    <p className="text-xs text-foreground-muted">{t("bookingNotes")}</p>
                    <p className="text-sm text-foreground">{booth.activeBooking.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm text-foreground-muted">{t("noClient")}</p>
            )}
          </div>

          <Button onClick={() => setAssignOpen(true)} className="w-full">
            {isAssigned ? t("reassign") : t("assign")}
          </Button>
        </CardContent>
      </Card>

      <AssignBoothDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        booth={booth}
        clients={clients}
      />
    </>
  );
}
