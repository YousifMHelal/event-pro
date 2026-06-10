"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSar } from "@/lib/utils";
import { recordPayment } from "@/app/[locale]/(app)/finance/actions";
import { PAYMENT_METHODS, type InvoiceItem } from "@/lib/finance-types";

interface RecordPaymentDialogProps {
  invoice: InvoiceItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordPaymentDialog({ invoice, open, onOpenChange }: RecordPaymentDialogProps) {
  const t = useTranslations("finance");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState("bank_transfer");
  const [installmentId, setInstallmentId] = useState("none");
  const formRef = useRef<HTMLFormElement>(null);

  const pendingInstallments = invoice.installments.filter((i) => i.status !== "paid");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const amountRaw = parseFloat(String(fd.get("amountSar") ?? "0"));

    const result = await recordPayment({
      invoiceId: invoice.id,
      amount: Math.round(amountRaw * 100),
      method,
      reference: String(fd.get("reference") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      installmentId: installmentId === "none" ? "" : installmentId,
    });

    setLoading(false);

    if (result.success) {
      formRef.current?.reset();
      onOpenChange(false);
      return;
    }

    if (result.error === "exceeds_balance") {
      setError(t("recordPayment.errorExceedsBalance"));
    } else if (result.error === "validation") {
      setError(t("recordPayment.errorValidation"));
    } else {
      setError(t("recordPayment.errorGeneric"));
    }
  }

  function handleClose(v: boolean) {
    if (!v) {
      setError(null);
      setMethod("bank_transfer");
      setInstallmentId("none");
      formRef.current?.reset();
    }
    onOpenChange(v);
  }

  const balanceSar = invoice.balance / 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("recordPayment.title")}</DialogTitle>
          <DialogDescription>
            {t("recordPayment.description", { number: invoice.number })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 rounded-md bg-surface-muted p-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-muted">{t("recordPayment.invoiceTotal")}</span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatSar(invoice.totalAmount, locale)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-muted">{t("recordPayment.alreadyPaid")}</span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatSar(invoice.paidAmount, locale)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-muted">{t("recordPayment.remainingBalance")}</span>
            <span className="font-semibold text-primary tabular-nums">
              {formatSar(invoice.balance, locale)}
            </span>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amountSar">{t("recordPayment.amount")} *</Label>
              <Input
                id="amountSar"
                name="amountSar"
                type="number"
                min="0.01"
                step="0.01"
                max={balanceSar}
                required
                defaultValue={balanceSar}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="method">{t("recordPayment.method")} *</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {t(`paymentMethod.${m}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {pendingInstallments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="installmentId">{t("recordPayment.installment")}</Label>
              <Select value={installmentId} onValueChange={setInstallmentId}>
                <SelectTrigger id="installmentId">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("recordPayment.noInstallment")}</SelectItem>
                  {pendingInstallments.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {formatSar(i.amount, locale)} —{" "}
                      {t("installments.due", {
                        date: new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(i.dueDate)),
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reference">{t("recordPayment.reference")}</Label>
            <Input
              id="reference"
              name="reference"
              maxLength={200}
              placeholder={t("recordPayment.referencePlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">{t("recordPayment.notes")}</Label>
            <Input id="notes" name="notes" maxLength={500} />
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
              {t("recordPayment.cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? t("recordPayment.saving") : t("recordPayment.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
