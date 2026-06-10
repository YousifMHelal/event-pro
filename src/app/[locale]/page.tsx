import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher/locale-switcher";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-1 flex-col bg-white text-neutral-900">
      <header className="flex justify-end p-4">
        <LocaleSwitcher />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="max-w-md text-neutral-600">{t("description")}</p>
      </main>
    </div>
  );
}
