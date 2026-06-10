import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortalShell } from "@/components/shell/portal-shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations("portal");

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { nameAr: true, nameEn: true },
      })
    : null;

  const name = dbUser ? (locale === "ar" ? dbUser.nameAr : dbUser.nameEn) : "";

  return (
    <PortalShell user={{ name, roleLabel: t("userRole") }}>{children}</PortalShell>
  );
}
