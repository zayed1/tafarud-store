"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("title")}</h1>
        </div>
      </AnimatedSection>

      <div className="space-y-6 text-dark-light text-lg leading-relaxed">
        <AnimatedSection delay={0.1}>
          <p className="text-xl font-semibold text-primary">{t("content1")}</p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <p>{t("content2")}</p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p>{t("content3")}</p>
        </AnimatedSection>
        <AnimatedSection delay={0.25}>
          <p>{t("content4")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <blockquote className="border-s-4 border-primary ps-6 py-4 my-10 bg-primary/5 rounded-e-xl">
            <p className="text-2xl font-bold text-dark italic">&ldquo;{t("tagline")}&rdquo;</p>
          </blockquote>
        </AnimatedSection>
      </div>

      {/* Contact Info */}
      <AnimatedSection delay={0.35}>
        <div className="mt-12 p-8 sm:p-10 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50">
          <h2 className="text-2xl font-bold text-dark mb-6">{tCommon("contactUs")}</h2>
          <div className="space-y-4">
            <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3 text-dark-light">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <Link href="mailto:sh@altafarud.com" className="hover:text-primary transition-colors">
                sh@altafarud.com
              </Link>
            </motion.p>
            <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3 text-dark-light">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <Link href="tel:+971504677161" className="hover:text-primary transition-colors" dir="ltr">
                +971 504677161
              </Link>
            </motion.p>
            <motion.p whileHover={{ x: 4 }} className="flex items-center gap-3 text-dark-light">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </span>
              <Link
                href="https://altafarud.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                altafarud.com
              </Link>
            </motion.p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
