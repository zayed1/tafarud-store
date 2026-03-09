import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-dark via-primary-dark to-secondary min-h-[500px] flex items-center">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 start-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 end-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {t("title")}
        </h1>
        <p className="text-xl sm:text-2xl text-accent-light mb-4 font-medium">
          {t("subtitle")}
        </p>
        <p className="text-white/70 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-dark font-semibold rounded-lg hover:bg-accent-light transition-colors text-lg"
          >
            {t("browseProducts")}
          </Link>
          <Link
            href={`/${locale}/categories`}
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
          >
            {t("browseCategories")}
          </Link>
        </div>
      </div>
    </section>
  );
}
