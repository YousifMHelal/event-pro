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
import { deleteOpportunity } from "@/app/[locale]/(app)/clients/actions";

interface DeleteOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityId: string;
  opportunityTitle: string;
}

export function DeleteOpportunityDialog({
  open,
  onOpenChange,
  opportunityId,
  opportunityTitle,
}: DeleteOpportunityDialogProps) {
  const t = useTranslations("crm.deleteDialog");
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOpportunity(opportunityId);
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
          <DialogDescription>
            {t("description", { title: opportunityTitle })}
          </DialogDescription>
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
