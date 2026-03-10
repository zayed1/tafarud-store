"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("common");

  const suggestedLinks = [
    { href: `/${locale}/products`, label: t("allProducts") },
    { href: `/${locale}/categories`, label: t("allCategories") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-8xl sm:text-9xl font-bold gradient-text mb-4">404</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
            {t("pageNotFound")}
          </h1>
          <p className="text-muted text-lg mb-8">
            {t("pageNotFoundDesc")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-6"
        >
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("backHome")}
          </Link>

          {/* Suggested links */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted mb-3">{t("suggestedCategories")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm bg-surface border border-border rounded-full text-dark-light hover:border-primary/30 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
