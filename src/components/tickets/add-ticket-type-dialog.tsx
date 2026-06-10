"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTicketType } from "@/app/[locale]/(app)/tickets/actions";

interface AddTicketTypeDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTicketTypeDialog({ eventId, open, onOpenChange }: AddTicketTypeDialogProps) {
  const t = useTranslations("tickets");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const priceRaw = parseFloat(String(fd.get("priceSar") ?? "0"));
    const result = await addTicketType({
      eventId,
      nameAr: String(fd.get("nameAr") ?? ""),
      nameEn: String(fd.get("nameEn") ?? ""),
      descriptionAr: String(fd.get("descriptionAr") ?? ""),
      descriptionEn: String(fd.get("descriptionEn") ?? ""),
      price: Math.round(priceRaw * 100),
      quantity: parseInt(String(fd.get("quantity") ?? "0"), 10),
    });

    setLoading(false);

    if (result.success) {
      formRef.current?.reset();
      onOpenChange(false);
      return;
    }
    setError(t("addType.errorGeneric"));
  }

  function handleClose(v: boolean) {
    if (!v) {
      setError(null);
      formRef.current?.reset();
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addType.title")}</DialogTitle>
          <DialogDescription>{t("addType.description")}</DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameAr">{t("addType.nameAr")} *</Label>
              <Input id="nameAr" name="nameAr" required maxLength={200} placeholder={t("addType.nameArPlaceholder")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">{t("addType.nameEn")} *</Label>
              <Input id="nameEn" name="nameEn" required maxLength={200} placeholder={t("addType.nameEnPlaceholder")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descriptionAr">{t("addType.descriptionAr")}</Label>
              <Input id="descriptionAr" name="descriptionAr" maxLength={500} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="descriptionEn">{t("addType.descriptionEn")}</Label>
              <Input id="descriptionEn" name="descriptionEn" maxLength={500} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceSar">{t("addType.price")} *</Label>
              <Input id="priceSar" name="priceSar" type="number" min="0" step="0.01" required defaultValue="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantity">{t("addType.quantity")} *</Label>
              <Input id="quantity" name="quantity" type="number" min="1" required defaultValue="100" />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-danger">{error}</p>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={loading}>
              {t("addType.cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? t("addType.saving") : t("addType.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
