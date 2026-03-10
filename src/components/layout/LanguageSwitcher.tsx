"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <button
      onClick={switchLocale}
      className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer"
    >
      {t("language")}
    </button>
  );
}
