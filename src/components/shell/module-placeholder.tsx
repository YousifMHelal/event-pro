import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  titleKey: string;
  descriptionKey: string;
  icon: LucideIcon;
}

export function ModulePlaceholder({ titleKey, descriptionKey, icon: Icon }: ModulePlaceholderProps) {
  const tNav = useTranslations("nav");
  const tApp = useTranslations("app.placeholder");

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-foreground">{tNav(titleKey)}</h1>
      <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <p className="max-w-md text-sm text-foreground-muted">{tApp(descriptionKey)}</p>
        <p className="text-xs text-foreground-muted">{tApp("comingSoon")}</p>
      </div>
    </div>
  );
}
