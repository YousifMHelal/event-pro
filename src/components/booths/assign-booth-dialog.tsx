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
import { assignBooth, type AssignBoothState } from "@/app/[locale]/(app)/booths/actions";
import { BOOTH_STATUSES, type BoothGridItem, type BoothClientOption } from "@/lib/booths-types";
import type { BoothStatus } from "@/generated/prisma/enums";

interface AssignBoothDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booth: BoothGridItem;
  clients: BoothClientOption[];
}

const initialState: AssignBoothState = {};
const BOOKED_STATUSES: BoothStatus[] = ["reserved", "contracted", "production", "delivered"];

export function AssignBoothDialog(props: AssignBoothDialogProps) {
  const { open, booth } = props;
  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      {open && <AssignBoothDialogForm key={booth.id} {...props} />}
    </Dialog>
  );
}

function AssignBoothDialogForm({ onOpenChange, booth, clients }: AssignBoothDialogProps) {
  const t = useTranslations("booths.assignDialog");
  const tStatus = useTranslations("booths.status");
  const locale = useLocale();
  const code = locale === "ar" ? booth.codeAr : booth.codeEn;

  const [status, setStatus] = useState<BoothStatus>(booth.status);
  const [clientId, setClientId] = useState<string>(booth.activeBooking?.client.id ?? "");
  const requiresClient = BOOKED_STATUSES.includes(status);

  const [state, formAction, pending] = useActionState(
    async (_prevState: AssignBoothState, formData: FormData): Promise<AssignBoothState> => {
      if (requiresClient && !clientId) {
        return { error: "validation" };
      }

      const result = await assignBooth({
        boothId: booth.id,
        status,
        clientId: requiresClient ? clientId : "",
        price: requiresClient
          ? Number(formData.get("price") ?? 0) * 100
          : undefined,
        notes: String(formData.get("notes") ?? ""),
      });

      if (result.success) {
        onOpenChange(false);
      }

      return result;
    },
    initialState,
  );

  const defaultPrice = booth.activeBooking
    ? booth.activeBooking.price / 100
    : booth.basePrice / 100;

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{t("title", { code })}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status-select">{t("status")}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as BoothStatus)}>
            <SelectTrigger id="status-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOTH_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {tStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {requiresClient && (
          <>
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
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                defaultValue={defaultPrice}
              />
            </div>
          </>
        )}

        <div className="grid gap-2">
          <Label htmlFor="notes">{t("notes")}</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={booth.activeBooking?.notes ?? ""}
            className="border-border bg-surface text-foreground placeholder:text-foreground-muted focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        {state.error === "validation" && requiresClient && !clientId && (
          <p role="alert" className="text-sm text-danger">
            {t("clientRequired")}
          </p>
        )}
        {state.error === "generic" && (
          <p role="alert" className="text-sm text-danger">
            {t("error")}
          </p>
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
