"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CheckCircle2, UserPlus } from "lucide-react";
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
import { TicketQR } from "@/components/tickets/ticket-qr";
import { issueTicket } from "@/app/[locale]/(app)/tickets/actions";
import type { TicketTypeItem } from "@/lib/tickets-types";
import { formatSar } from "@/lib/utils";

interface IssueTicketDialogProps {
  ticketType: TicketTypeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IssueTicketDialog({ ticketType, open, onOpenChange }: IssueTicketDialogProps) {
  const t = useTranslations("tickets");
  const locale = useLocale();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [issuedName, setIssuedName] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const result = await issueTicket({
      ticketTypeId: ticketType.id,
      holderName: String(fd.get("holderName") ?? ""),
      holderEmail: String(fd.get("holderEmail") ?? ""),
      holderPhone: String(fd.get("holderPhone") ?? ""),
    });

    setLoading(false);

    if (result.success && result.code) {
      setIssuedCode(result.code);
      setIssuedName(String(fd.get("holderName") ?? ""));
      return;
    }

    if (result.error === "sold_out") setError(t("dialog.errorSoldOut"));
    else if (result.error === "validation") setError(t("dialog.errorValidation"));
    else setError(t("dialog.errorGeneric"));
  }

  function handleClose(open: boolean) {
    if (!open) {
      setIssuedCode(null);
      setIssuedName(null);
      setError(null);
      formRef.current?.reset();
    }
    onOpenChange(open);
  }

  const typeName = locale === "ar" ? ticketType.nameAr : ticketType.nameEn;
  const price = ticketType.price === 0 ? t("free") : formatSar(ticketType.price, locale);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {issuedCode ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <span className="font-semibold text-sm">{t("dialog.issued")}</span>
            </div>

            <TicketQR code={issuedCode} size={180} />

            <div className="text-center">
              <p className="font-semibold text-foreground">{issuedName}</p>
              <p className="text-sm text-foreground-muted">{typeName}</p>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">{issuedCode}</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleClose(false)}
            >
              {t("dialog.close")}
            </Button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <DialogHeader>
              <DialogTitle>{t("dialog.issueTitle")}</DialogTitle>
              <DialogDescription>
                {typeName} — {price}
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="holderName">{t("dialog.holderName")} *</Label>
                <Input
                  id="holderName"
                  name="holderName"
                  required
                  maxLength={200}
                  placeholder={t("dialog.holderNamePlaceholder")}
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="holderEmail">{t("dialog.holderEmail")}</Label>
                <Input
                  id="holderEmail"
                  name="holderEmail"
                  type="email"
                  maxLength={200}
                  placeholder={t("dialog.holderEmailPlaceholder")}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="holderPhone">{t("dialog.holderPhone")}</Label>
                <Input
                  id="holderPhone"
                  name="holderPhone"
                  type="tel"
                  maxLength={30}
                  placeholder={t("dialog.holderPhonePlaceholder")}
                  autoComplete="tel"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={loading}
                >
                  {t("dialog.cancel")}
                </Button>
                <Button type="submit" loading={loading}>
                  <UserPlus aria-hidden="true" />
                  {loading ? t("dialog.issuing") : t("dialog.issue")}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
