import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ت</span>
              </div>
              <span className="text-xl font-bold">{t("storeName")}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t("partOf")}{" "}
              <Link
                href="https://altafarud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-light underline"
              >
                {t("groupName")}
              </Link>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("products")}</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-white/70 hover:text-accent transition-colors text-sm">
                {t("allProducts")}
              </Link>
              <Link href="/categories" className="block text-white/70 hover:text-accent transition-colors text-sm">
                {t("allCategories")}
              </Link>
              <Link href="/about" className="block text-white/70 hover:text-accent transition-colors text-sm">
                {t("about")}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("contactUs")}</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <Link href="mailto:sh@altafarud.com" className="hover:text-accent">
                  sh@altafarud.com
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <Link href="tel:+971504677161" className="hover:text-accent" dir="ltr">
                  +971 504677161
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <Link
                  href="https://altafarudstore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  altafarudstore.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>
            &copy; {currentYear} {t("storeName")}. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
