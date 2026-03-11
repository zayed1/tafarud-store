"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getLocalizedField, formatPrice } from "@/lib/utils";

interface RecentProduct {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  image_url: string | null;
}

const STORAGE_KEY = "tafarud_recently_viewed";
const MAX_ITEMS = 8;

export function trackProductView(product: RecentProduct) {
  if (typeof window === "undefined") return;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
    const filtered = stored.filter((p) => p.id !== product.id);
    filtered.unshift(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    // ignore
  }
}

function getRecentlyViewed(excludeId?: string): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
    return excludeId ? stored.filter((p) => p.id !== excludeId) : stored;
  } catch {
    return [];
  }
}

interface RecentlyViewedProps {
  excludeProductId?: string;
}

export default function RecentlyViewed({ excludeProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    setProducts(getRecentlyViewed(excludeProductId));
  }, [excludeProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-gradient-to-b from-primary/60 to-accent/60 rounded-full" />
        <h2 className="text-xl sm:text-2xl font-bold text-dark">{t("recentlyViewed")}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mb-4 snap-x">
        <AnimatePresence>
          {products.map((product, index) => {
            const name = getLocalizedField(product, "name", locale);
            return (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-36 sm:w-44 snap-start"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/${locale}/products/${product.id}`} className="group block">
                  <div className="aspect-[3/4] relative bg-background rounded-xl overflow-hidden border border-border mb-2 group-hover:border-primary/20 transition-colors">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="176px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-dark truncate group-hover:text-primary transition-colors">{name}</p>
                  <p className="text-sm text-primary font-semibold">{formatPrice(product.price)}</p>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
