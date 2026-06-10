import { getTranslations } from "next-intl/server";
import { ScanLine } from "lucide-react";
import { CheckinBoard } from "@/components/checkin/checkin-board";

export default async function CheckinPage() {
  const t = await getTranslations("checkin");

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-info-surface text-info">
            <ScanLine className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
            <p className="mt-0.5 text-base text-foreground-muted">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      <CheckinBoard />
    </div>
  );
}
