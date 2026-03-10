"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Footer() {
  const t = useTranslations("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-dark text-white mt-auto relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -end-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -start-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
              <p className="text-white/50 text-sm leading-relaxed max-w-xs">
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
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full" />
                {t("products")}
              </h3>
              <div className="space-y-3">
                {[
                  { href: "/products", label: t("allProducts") },
                  { href: "/categories", label: t("allCategories") },
                  { href: "/about", label: t("about") },
                ].map((link) => (
                  <motion.div key={link.href} whileHover={{ x: 4 }} className="rtl:text-right">
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-accent transition-colors text-sm inline-flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-primary/50 rounded-full" />
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
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full" />
                {t("contactUs")}
              </h3>
              <div className="space-y-3 text-sm text-white/50">
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
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </span>
                  <Link href="https://wa.me/971504677161" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" dir="ltr">
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
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/30">
          <p>
            &copy; {currentYear} {t("storeName")}. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
