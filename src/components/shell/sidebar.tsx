"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const content = (
    <>
      <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-4">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onCloseMobile}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            E
          </span>
          {!collapsed && (
            <span className="truncate text-base font-semibold text-foreground">
              {t("brand.name")}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
          aria-label={t("app.sidebar.close")}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label={t("brand.name")}>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? t(`nav.${item.labelKey}`) : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    collapsed && "lg:justify-center lg:px-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-muted hover:bg-neutral-100 hover:text-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className={cn("truncate", collapsed && "lg:hidden")}>
                    {t(`nav.${item.labelKey}`)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-border p-2 lg:block">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground-muted transition-colors duration-150 hover:bg-neutral-100 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            collapsed && "justify-center px-2",
          )}
          aria-label={collapsed ? t("app.sidebar.expand") : t("app.sidebar.collapse")}
        >
          {collapsed ? (
            <ChevronsRight className="size-5 shrink-0 rtl:rotate-180" aria-hidden="true" />
          ) : (
            <ChevronsLeft className="size-5 shrink-0 rtl:rotate-180" aria-hidden="true" />
          )}
          <span className={cn("truncate", collapsed && "hidden")}>{t("app.sidebar.collapse")}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-e border-border bg-surface transition-[width] duration-200 lg:flex",
          collapsed ? "w-18" : "w-64",
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-neutral-900/40 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            "absolute top-0 start-0 flex h-full w-72 max-w-[80vw] flex-col bg-surface shadow-popover transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
        >
          {content}
        </aside>
      </div>
    </>
  );
}
