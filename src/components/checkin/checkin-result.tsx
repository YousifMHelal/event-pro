import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { CheckInResult } from "@/lib/tickets-types";

interface CheckinResultProps {
  result: CheckInResult;
  code: string;
}

export function CheckinResult({ result, code }: CheckinResultProps) {
  const t = useTranslations("checkin");
  const locale = useLocale();

  if (result.ok) {
    const typeName = locale === "ar" ? result.ticketTypeNameAr : result.ticketTypeNameEn;
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-xl border border-success-border bg-success-surface px-6 py-5 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <div>
          <p className="font-semibold text-success">{t("result.success")}</p>
          <p className="mt-1 text-sm text-foreground font-medium">{result.holderName}</p>
          <p className="text-xs text-foreground-muted">{typeName}</p>
        </div>
        <p className="font-mono text-xs text-foreground-muted">{code}</p>
      </div>
    );
  }

  if (result.reason === "already_checked_in") {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-xl border border-warn-border bg-warn-surface px-6 py-5 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <AlertCircle className="size-10 text-warn" aria-hidden="true" />
        <div>
          <p className="font-semibold text-warn">{t("result.alreadyCheckedIn")}</p>
          <p className="text-xs text-foreground-muted mt-1">{code}</p>
        </div>
      </div>
    );
  }

  const msgKey = result.reason === "not_found" ? "result.notFound" : "result.invalidStatus";
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-danger-border bg-danger-surface px-6 py-5 text-center animate-in fade-in zoom-in-95 duration-200"
    >
      <XCircle className="size-10 text-danger" aria-hidden="true" />
      <div>
        <p className="font-semibold text-danger">{t(msgKey)}</p>
        <p className="text-xs text-foreground-muted mt-1">{code}</p>
      </div>
    </div>
  );
}
