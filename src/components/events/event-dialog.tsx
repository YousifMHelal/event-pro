"use client";

import * as React from "react";
import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertEvent, type UpsertEventState } from "@/app/[locale]/(app)/events/actions";
import { EVENT_STATUSES, type EventFormValues } from "@/lib/events-types";
import type { ClientOption } from "@/lib/crm-types";
import type { EventStatus } from "@/generated/prisma/enums";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientOption[];
  event?: EventFormValues;
}

const initialState: UpsertEventState = {};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Wraps the form in a remountable component so its local state resets
// to fresh defaults every time the dialog is opened for a new target.
export function EventDialog(props: EventDialogProps) {
  const { open, event } = props;
  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      {open && <EventDialogForm key={event?.id ?? "new"} {...props} />}
    </Dialog>
  );
}

function EventDialogForm({ onOpenChange, clients, event }: EventDialogProps) {
  const t = useTranslations("events.dialog");
  const tStatus = useTranslations("events.status");
  const locale = useLocale();
  const isEdit = Boolean(event);

  const [clientId, setClientId] = useState<string>(event?.clientId ?? "");
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "draft");

  const [state, formAction, pending] = useActionState(
    async (_prevState: UpsertEventState, formData: FormData): Promise<UpsertEventState> => {
      const result = await upsertEvent({
        eventId: event?.id,
        event: {
          nameAr: String(formData.get("nameAr") ?? ""),
          nameEn: String(formData.get("nameEn") ?? ""),
          descriptionAr: String(formData.get("descriptionAr") ?? ""),
          descriptionEn: String(formData.get("descriptionEn") ?? ""),
          venueAr: String(formData.get("venueAr") ?? ""),
          venueEn: String(formData.get("venueEn") ?? ""),
          startDate: String(formData.get("startDate") ?? ""),
          endDate: String(formData.get("endDate") ?? ""),
          status,
          clientId,
        },
      });

      if (result.success) {
        onOpenChange(false);
      }

      return result;
    },
    initialState,
  );

  return (
    <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? t("editTitle") : t("createTitle")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="nameAr">{t("nameAr")}</Label>
            <Input id="nameAr" name="nameAr" dir="rtl" required defaultValue={event?.nameAr ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nameEn">{t("nameEn")}</Label>
            <Input id="nameEn" name="nameEn" required defaultValue={event?.nameEn ?? ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client-select">{t("client")}</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client-select">
                <SelectValue placeholder={t("selectClientPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status-select">{t("status")}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)}>
              <SelectTrigger id="status-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {tStatus(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="startDate">{t("startDate")}</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={event ? toDateInputValue(event.startDate) : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">{t("endDate")}</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              required
              defaultValue={event ? toDateInputValue(event.endDate) : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="venueAr">{t("venueAr")}</Label>
            <Input id="venueAr" name="venueAr" dir="rtl" defaultValue={event?.venueAr ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="venueEn">{t("venueEn")}</Label>
            <Input id="venueEn" name="venueEn" defaultValue={event?.venueEn ?? ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="descriptionAr">{t("descriptionAr")}</Label>
            <textarea
              id="descriptionAr"
              name="descriptionAr"
              dir="rtl"
              rows={3}
              defaultValue={event?.descriptionAr ?? ""}
              className="border-border bg-surface text-foreground placeholder:text-foreground-muted focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descriptionEn">{t("descriptionEn")}</Label>
            <textarea
              id="descriptionEn"
              name="descriptionEn"
              rows={3}
              defaultValue={event?.descriptionEn ?? ""}
              className="border-border bg-surface text-foreground placeholder:text-foreground-muted focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>

        {state.error && (
          <p role="alert" className="text-danger text-sm">
            {t("error")}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button type="submit" loading={pending} disabled={!clientId}>
            {pending ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
