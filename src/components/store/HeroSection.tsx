"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { getLocalizedField } from "@/lib/utils";
import type { Banner } from "@/types";

const floatingSquares = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top: `${15 + (i * 5.83) % 70}%`,
  left: `${5 + (i * 7.5) % 90}%`,
  duration: 4 + (i % 5),
  delay: (i % 4) * 0.75,
}));

interface HeroSectionProps {
  banners?: Banner[];
}

export default function HeroSection({ banners = [] }: HeroSectionProps) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  const activeBanners = banners.filter((b) => b.is_active);
  const hasBanners = activeBanners.length > 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const nextBanner = useCallback(() => {
    if (activeBanners.length > 1) {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(nextBanner, 6000);
    return () => clearInterval(timer);
  }, [nextBanner, activeBanners.length]);

  const banner = hasBanners ? activeBanners[currentBanner] : null;
  const bannerTitle = banner ? getLocalizedField(banner, "title", locale) : t("title");
  const bannerSubtitle = banner ? getLocalizedField(banner, "subtitle", locale) : t("subtitle");

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary min-h-[520px] sm:min-h-[580px] flex items-center">
      {/* Banner background image */}
      {banner?.image_url && (
        <div className="absolute inset-0">
          <Image
            src={banner.image_url}
            alt={bannerTitle}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

      {/* Parallax animated decorative patterns */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: bgY }}>
        <motion.div
          className="absolute top-10 start-10 w-72 h-72 bg-accent rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.28, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 end-10 w-96 h-96 bg-accent-light rounded-full blur-3xl opacity-10"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.18, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-[0.04]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Geometric pattern overlay with parallax */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          y: bgY,
        }}
      />

      {/* Decorative floating squares - mid-layer parallax */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: midY, scale }}>
        {floatingSquares.map((sq) => (
          <motion.div
            key={sq.id}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-white/10 rounded-sm"
            style={{ top: sq.top, left: sq.left }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: sq.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: sq.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center w-full"
        style={{ y: textY, opacity }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={hasBanners ? currentBanner : "default"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full border border-white/15 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="w-2 h-2 bg-accent-light rounded-full animate-pulse" />
              <span className="text-accent-light text-sm font-medium">{bannerSubtitle || t("subtitle")}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              {bannerTitle || t("title")}
            </h1>

            {!hasBanners && (
              <p className="text-white/80 max-w-2xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
                {t("description")}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={banner?.link || `/${locale}/products`}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-primary-dark font-semibold rounded-xl hover:bg-accent-light transition-all text-lg shadow-lg shadow-black/10 hover:shadow-xl"
            >
              {t("browseProducts")}
              <svg className="w-5 h-5 ms-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={`/${locale}/categories`}
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/25 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all text-lg backdrop-blur-sm"
            >
              {t("browseCategories")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Banner dots */}
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  i === currentBanner ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
