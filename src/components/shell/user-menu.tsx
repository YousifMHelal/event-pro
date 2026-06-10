"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const t = useTranslations("app.userMenu");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const menuItems = [
    { key: "profile", icon: UserCircle },
    { key: "settings", icon: Settings },
  ] as const;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("label")}
        className="flex items-center gap-2 rounded-full p-1 transition-colors duration-150 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {t("defaultName")
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
        <span className="hidden text-start sm:flex sm:flex-col sm:leading-tight">
          <span className="text-sm font-medium text-foreground">{t("defaultName")}</span>
          <span className="text-xs text-foreground-muted">{t("defaultRole")}</span>
        </span>
        <ChevronDown
          className={cn("hidden size-4 text-foreground-muted transition-transform duration-150 sm:block", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-48 rounded-md border border-border bg-surface p-1 shadow-popover"
        >
          {menuItems.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-start text-sm text-foreground transition-colors duration-150 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <Icon className="size-4 text-foreground-muted" aria-hidden="true" />
              {t(key)}
            </button>
          ))}
          <div className="my-1 h-px bg-border" role="separator" />
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-start text-sm text-danger transition-colors duration-150 hover:bg-danger-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <LogOut className="size-4" aria-hidden="true" />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
