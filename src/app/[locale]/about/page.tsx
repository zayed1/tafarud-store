import { useTranslations } from "next-intl";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-dark mb-8">{t("title")}</h1>

      <div className="space-y-6 text-dark-light text-lg leading-relaxed">
        <p className="text-xl font-semibold text-primary">{t("content1")}</p>
        <p>{t("content2")}</p>
        <p>{t("content3")}</p>
        <p>{t("content4")}</p>

        <blockquote className="border-s-4 border-primary ps-6 py-2 my-8">
          <p className="text-2xl font-bold text-dark italic">{t("tagline")}</p>
        </blockquote>
      </div>

      {/* Contact Info */}
      <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl">
        <h2 className="text-2xl font-bold text-dark mb-6">{tCommon("contactUs")}</h2>
        <div className="space-y-4">
          <p className="flex items-center gap-3 text-dark-light">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <Link href="mailto:sh@altafarud.com" className="hover:text-primary">
              sh@altafarud.com
            </Link>
          </p>
          <p className="flex items-center gap-3 text-dark-light">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <Link href="tel:+971504677161" className="hover:text-primary" dir="ltr">
              +971 504677161
            </Link>
          </p>
          <p className="flex items-center gap-3 text-dark-light">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <Link
              href="https://altafarud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              altafarud.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
