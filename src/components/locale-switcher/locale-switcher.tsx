"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-current={isActive ? "true" : undefined}
            disabled={isActive}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`min-w-11 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isActive
                ? "bg-neutral-900 text-white"
                : "cursor-pointer text-neutral-600 hover:bg-neutral-100"
            } focus-visible:ring-neutral-900`}
          >
            {t(loc)}
          </button>
        );
      })}
    </div>
  );
}
