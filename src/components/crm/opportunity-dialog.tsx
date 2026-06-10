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
import {
  upsertOpportunity,
  type UpsertOpportunityState,
} from "@/app/[locale]/(app)/clients/actions";
import {
  PIPELINE_STAGES,
  type PipelineOpportunity,
  type ClientOption,
  type OwnerOption,
} from "@/lib/crm-types";
import type { OpportunityStage } from "@/generated/prisma/enums";

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: ClientOption[];
  owners: OwnerOption[];
  opportunity?: PipelineOpportunity;
  defaultStage?: OpportunityStage;
}

const initialState: UpsertOpportunityState = {};
const NEW_CLIENT_VALUE = "__new__";

// Wraps the form in a remountable component so its local state resets
// to fresh defaults every time the dialog is opened for a new target.
export function OpportunityDialog(props: OpportunityDialogProps) {
  const { open, opportunity, defaultStage } = props;
  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      {open && (
        <OpportunityDialogForm
          key={opportunity?.id ?? `new-${defaultStage}`}
          {...props}
        />
      )}
    </Dialog>
  );
}

function OpportunityDialogForm({
  onOpenChange,
  clients,
  owners,
  opportunity,
  defaultStage,
}: OpportunityDialogProps) {
  const t = useTranslations("crm.dialog");
  const tStages = useTranslations("crm.stages");
  const locale = useLocale();
  const isEdit = Boolean(opportunity);

  const [selectedClientId, setSelectedClientId] = useState<string>(
    opportunity?.clientId ?? NEW_CLIENT_VALUE,
  );
  const [stage, setStage] = useState<OpportunityStage>(
    opportunity?.stage ?? defaultStage ?? "lead",
  );
  const [ownerId, setOwnerId] = useState<string>(opportunity?.owner?.id ?? "");

  const [state, formAction, pending] = useActionState(
    async (
      _prevState: UpsertOpportunityState,
      formData: FormData,
    ): Promise<UpsertOpportunityState> => {
      const isNewClient = selectedClientId === NEW_CLIENT_VALUE;
      const showsClientFields = isNewClient || isEdit;

      const result = await upsertOpportunity({
        opportunityId: opportunity?.id,
        clientId: isNewClient ? undefined : selectedClientId,
        client: showsClientFields
          ? {
              nameAr: String(formData.get("clientNameAr") ?? ""),
              nameEn: String(formData.get("clientNameEn") ?? ""),
              companyNameAr: String(formData.get("companyNameAr") ?? ""),
              companyNameEn: String(formData.get("companyNameEn") ?? ""),
              email: String(formData.get("email") ?? ""),
              phone: String(formData.get("phone") ?? ""),
            }
          : undefined,
        opportunity: {
          titleAr: String(formData.get("titleAr") ?? ""),
          titleEn: String(formData.get("titleEn") ?? ""),
          stage,
          estimatedValue: Number(formData.get("estimatedValue") ?? 0) * 100,
          expectedCloseDate: String(formData.get("expectedCloseDate") ?? ""),
          notes: String(formData.get("notes") ?? ""),
          ownerId,
        },
      });

      if (result.success) {
        onOpenChange(false);
      }

      return result;
    },
    initialState,
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const isNewClient = selectedClientId === NEW_CLIENT_VALUE;

  return (
    <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? t("editTitle") : t("createTitle")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <form action={formAction} className="flex flex-col gap-6">
        {/* Client section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-sm font-semibold">
            {t("clientSection")}
          </h3>

          <div className="grid gap-2">
            <Label htmlFor="client-select">{t("selectClient")}</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
              disabled={isEdit}
            >
              <SelectTrigger id="client-select">
                <SelectValue placeholder={t("selectClientPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NEW_CLIENT_VALUE}>
                  {t("newClient")}
                </SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(isNewClient || isEdit) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="clientNameAr">{t("nameAr")}</Label>
                <Input
                  id="clientNameAr"
                  name="clientNameAr"
                  dir="rtl"
                  required
                  defaultValue={
                    isEdit
                      ? opportunity?.client.nameAr
                      : (selectedClient?.nameAr ?? "")
                  }
                  key={`clientNameAr-${selectedClientId}`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientNameEn">{t("nameEn")}</Label>
                <Input
                  id="clientNameEn"
                  name="clientNameEn"
                  required
                  defaultValue={
                    isEdit
                      ? opportunity?.client.nameEn
                      : (selectedClient?.nameEn ?? "")
                  }
                  key={`clientNameEn-${selectedClientId}`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyNameAr">{t("companyNameAr")}</Label>
                <Input
                  id="companyNameAr"
                  name="companyNameAr"
                  dir="rtl"
                  defaultValue={
                    isEdit
                      ? (opportunity?.client.companyNameAr ?? "")
                      : (selectedClient?.companyNameAr ?? "")
                  }
                  key={`companyNameAr-${selectedClientId}`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyNameEn">{t("companyNameEn")}</Label>
                <Input
                  id="companyNameEn"
                  name="companyNameEn"
                  defaultValue={
                    isEdit
                      ? (opportunity?.client.companyNameEn ?? "")
                      : (selectedClient?.companyNameEn ?? "")
                  }
                  key={`companyNameEn-${selectedClientId}`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={isEdit ? (opportunity?.client.email ?? "") : ""}
                  key={`email-${selectedClientId}`}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={isEdit ? (opportunity?.client.phone ?? "") : ""}
                  key={`phone-${selectedClientId}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Opportunity section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-foreground text-sm font-semibold">
            {t("opportunitySection")}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="titleAr">{t("titleAr")}</Label>
              <Input
                id="titleAr"
                name="titleAr"
                dir="rtl"
                required
                defaultValue={opportunity?.titleAr ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="titleEn">{t("titleEn")}</Label>
              <Input
                id="titleEn"
                name="titleEn"
                required
                defaultValue={opportunity?.titleEn ?? ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage-select">{t("stage")}</Label>
              <Select
                value={stage}
                onValueChange={(v) => setStage(v as OpportunityStage)}
              >
                <SelectTrigger id="stage-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {tStages(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimatedValue">{t("estimatedValue")}</Label>
              <Input
                id="estimatedValue"
                name="estimatedValue"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                required
                defaultValue={
                  opportunity ? opportunity.estimatedValue / 100 : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expectedCloseDate">
                {t("expectedCloseDate")}
              </Label>
              <Input
                id="expectedCloseDate"
                name="expectedCloseDate"
                type="date"
                defaultValue={
                  opportunity?.expectedCloseDate
                    ? opportunity.expectedCloseDate.toISOString().slice(0, 10)
                    : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="owner-select">{t("owner")}</Label>
              <Select
                value={ownerId || "__none__"}
                onValueChange={(v) => setOwnerId(v === "__none__" ? "" : v)}
              >
                <SelectTrigger id="owner-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("noOwner")}</SelectItem>
                  {owners.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {locale === "ar" ? o.nameAr : o.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={opportunity?.notes ?? ""}
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
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
