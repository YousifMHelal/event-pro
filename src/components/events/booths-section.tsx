"use client";

import * as React from "react";
import { useActionState, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { BoothStatusBadge } from "@/components/booths/booth-status-badge";
import { formatSar, formatNumber } from "@/lib/utils";
import {
  addBooth,
  deleteBooth,
  type AddBoothState,
  type DeleteBoothState,
} from "@/app/[locale]/(app)/events/actions";
import type { BoothGridItem } from "@/lib/booths-types";

interface BoothsSectionProps {
  eventId: string;
  booths: BoothGridItem[];
}

const initialAddState: AddBoothState = {};

// ---------------------------------------------------------------------------
// Add Booth dialog (remounts on open via key)
// ---------------------------------------------------------------------------

function AddBoothDialog({
  open,
  onOpenChange,
  eventId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eventId: string;
}) {
  const t = useTranslations("events.boothsSection.addDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <AddBoothForm
          key={`add-${eventId}-${Date.now()}`}
          eventId={eventId}
          onOpenChange={onOpenChange}
        />
      )}
    </Dialog>
  );
}

function AddBoothForm({
  eventId,
  onOpenChange,
}: {
  eventId: string;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useTranslations("events.boothsSection.addDialog");

  const [state, formAction, pending] = useActionState(
    async (_prev: AddBoothState, formData: FormData): Promise<AddBoothState> => {
      const result = await addBooth({
        eventId,
        codeAr: String(formData.get("codeAr") ?? ""),
        codeEn: String(formData.get("codeEn") ?? ""),
        descriptionAr: String(formData.get("descriptionAr") ?? ""),
        descriptionEn: String(formData.get("descriptionEn") ?? ""),
        areaSqm: String(formData.get("areaSqm") ?? "") as unknown as number,
        basePrice: Number(formData.get("basePrice") ?? 0) * 100,
      });
      if (result.success) {
        onOpenChange(false);
      }
      return result;
    },
    initialAddState,
  );

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="codeAr">{t("codeAr")} *</Label>
            <Input id="codeAr" name="codeAr" dir="rtl" placeholder={t("codeArPlaceholder")} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="codeEn">{t("codeEn")} *</Label>
            <Input id="codeEn" name="codeEn" placeholder={t("codeEnPlaceholder")} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="areaSqm">{t("area")}</Label>
            <Input
              id="areaSqm"
              name="areaSqm"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              placeholder={t("areaPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="basePrice">{t("basePrice")} *</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="descriptionAr">{t("descriptionAr")}</Label>
          <Input id="descriptionAr" name="descriptionAr" dir="rtl" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="descriptionEn">{t("descriptionEn")}</Label>
          <Input id="descriptionEn" name="descriptionEn" />
        </div>

        {state.error === "duplicate" && (
          <p role="alert" className="text-sm text-danger">{t("errorDuplicate")}</p>
        )}
        {state.error === "generic" && (
          <p role="alert" className="text-sm text-danger">{t("errorGeneric")}</p>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button type="submit" loading={pending}>
            {pending ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ---------------------------------------------------------------------------
// Delete confirmation dialog
// ---------------------------------------------------------------------------

function DeleteBoothDialog({
  booth,
  open,
  onOpenChange,
}: {
  booth: BoothGridItem;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useTranslations("events.boothsSection");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const code = locale === "ar" ? booth.codeAr : booth.codeEn;

  function handleDelete() {
    startTransition(async () => {
      const result: DeleteBoothState = await deleteBooth(booth.id);
      if (result.success) {
        onOpenChange(false);
      } else if (result.error === "has_bookings") {
        setError(t("errorHasBookings"));
      } else {
        setError(t("errorGeneric"));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("deleteTitle")}</DialogTitle>
          <DialogDescription>{t("deleteDescription", { code })}</DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t("deleteCancel")}
          </Button>
          <Button variant="destructive" loading={isPending} onClick={handleDelete}>
            {isPending ? t("deleting") : t("deleteConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function BoothsSection({ eventId, booths }: BoothsSectionProps) {
  const t = useTranslations("events.boothsSection");
  const locale = useLocale();
  const [addOpen, setAddOpen] = useState(false);
  const [deletingBooth, setDeletingBooth] = useState<BoothGridItem | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("title")}</h2>
          <p className="text-sm text-foreground-muted">
            {t("subtitle", { count: formatNumber(booths.length, locale) })}
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus aria-hidden="true" />
          {t("addBooth")}
        </Button>
      </div>

      {booths.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-foreground-muted">{t("empty")}</p>
          <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
            <Plus aria-hidden="true" />
            {t("addBooth")}
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columnCode")}</TableHead>
                <TableHead>{t("columnArea")}</TableHead>
                <TableHead>{t("columnBasePrice")}</TableHead>
                <TableHead>{t("columnStatus")}</TableHead>
                <TableHead className="w-0">
                  <span className="sr-only">{t("columnActions")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booths.map((booth) => {
                const code = locale === "ar" ? booth.codeAr : booth.codeEn;
                return (
                  <TableRow key={booth.id}>
                    <TableCell className="font-semibold tabular-nums">{code}</TableCell>
                    <TableCell className="text-foreground-muted tabular-nums">
                      {booth.areaSqm ? `${formatNumber(booth.areaSqm, locale)} m²` : t("noArea")}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatSar(booth.basePrice, locale)}
                    </TableCell>
                    <TableCell>
                      <BoothStatusBadge status={booth.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground-muted hover:text-danger"
                        aria-label={t("delete")}
                        onClick={() => setDeletingBooth(booth)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AddBoothDialog open={addOpen} onOpenChange={setAddOpen} eventId={eventId} />

      {deletingBooth && (
        <DeleteBoothDialog
          booth={deletingBooth}
          open={!!deletingBooth}
          onOpenChange={(v) => { if (!v) setDeletingBooth(null); }}
        />
      )}
    </div>
  );
}
