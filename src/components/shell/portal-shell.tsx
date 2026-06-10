import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher/locale-switcher";
import { UserMenu } from "./user-menu";

interface PortalShellProps {
  children: React.ReactNode;
  user: { name: string; roleLabel: string };
}

export async function PortalShell({ children, user }: PortalShellProps) {
  const t = await getTranslations("brand");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
        <Link
          href="/portal"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-md object-contain"
            priority
          />
          <span className="truncate text-base font-semibold text-foreground">{t("name")}</span>
        </Link>

        <div className="flex-1" />

        <LocaleSwitcher />
        <UserMenu name={user.name} roleLabel={user.roleLabel} />
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
