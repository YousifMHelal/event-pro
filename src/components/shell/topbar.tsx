"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { LocaleSwitcher } from "@/components/locale-switcher/locale-switcher";
import { UserMenu } from "./user-menu";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const t = useTranslations("app.sidebar");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="flex size-10 shrink-0 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
        aria-label={t("toggle")}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="flex-1" />

      <LocaleSwitcher />
      <UserMenu />
    </header>
  );
}
