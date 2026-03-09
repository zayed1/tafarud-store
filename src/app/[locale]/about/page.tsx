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
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </span>
              <Link href="https://wa.me/971504677161" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" dir="ltr">
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
