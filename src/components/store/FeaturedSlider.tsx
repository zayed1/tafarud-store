"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface FeaturedSliderProps {
  products: Product[];
}

export default function FeaturedSlider({ products }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const locale = useLocale();
  const t = useTranslations("common");

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (products.length === 0) return null;

  const product = products[currentIndex];
  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-bold text-dark">{t("featuredProducts")}</h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/${locale}/products/${product.id}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center group bg-surface rounded-2xl border border-border p-4 sm:p-6 hover:shadow-xl hover:border-primary/15 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[3/4] sm:aspect-square relative bg-background rounded-xl overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={currentIndex === 0}
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGNEYzIi8+PC9zdmc+"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                      <svg className="w-20 h-20 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 start-4">
                    <Badge variant="accent">{t("featuredProducts")}</Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-5 py-2">
                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-dark group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                    <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                  </div>
                  {description && (
                    <p className="text-dark-light text-lg leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 text-primary font-semibold bg-primary/5 px-5 py-2.5 rounded-xl group-hover:bg-primary/10 transition-colors">
                    {t("viewDetails")}
                    <svg className="w-5 h-5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots with progress */}
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
