"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEvent, deleteEventAndRedirect } from "@/app/[locale]/(app)/events/actions";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  /** When set, redirects to /events on success (used from the profile page). */
  redirectLocale?: string;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  eventId,
  eventName,
  redirectLocale,
}: DeleteEventDialogProps) {
  const t = useTranslations("events.deleteDialog");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      if (redirectLocale) {
        await deleteEventAndRedirect(redirectLocale, eventId);
        return;
      }
      const result = await deleteEvent(eventId);
      if (result.success) {
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description", { name: eventName })}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button type="button" variant="destructive" loading={pending} onClick={handleDelete}>
            {pending ? t("deleting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
