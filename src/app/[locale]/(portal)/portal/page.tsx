import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PortalPage() {
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
    <Card>
      <CardHeader>
        <CardTitle>
          {t("welcome")}
          {name ? `, ${name}` : ""}
        </CardTitle>
        <CardDescription>{t("comingSoon")}</CardDescription>
      </CardHeader>
    </Card>
  );
}
