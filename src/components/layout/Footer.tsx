"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Store Info */}
          <AnimatedSection delay={0}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-lg">ت</span>
                </div>
                <span className="text-xl font-bold">{t("storeName")}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {t("partOf")}{" "}
                <Link
                  href="https://altafarud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
                >
                  {t("groupName")}
                </Link>
              </p>
            </div>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("products")}</h3>
              <div className="space-y-3">
                {[
                  { href: "/products", label: t("allProducts") },
                  { href: "/categories", label: t("allCategories") },
                  { href: "/about", label: t("about") },
                ].map((link) => (
                  <motion.div key={link.href} whileHover={{ x: 4 }} className="rtl:text-right">
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-accent transition-colors text-sm inline-flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-accent/50 rounded-full" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t("contactUs")}</h3>
              <div className="space-y-3 text-sm text-white/60">
                <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <Link href="mailto:sh@altafarud.com" className="hover:text-accent transition-colors">
                    sh@altafarud.com
                  </Link>
                </motion.p>
                <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <Link href="tel:+971504677161" className="hover:text-accent transition-colors" dir="ltr">
                    +971 504677161
                  </Link>
                </motion.p>
                <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <Link
                    href="https://altafarudstore.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    altafarudstore.com
                  </Link>
                </motion.p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          <p>
            &copy; {currentYear} {t("storeName")}. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
