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

export default function FloatingRecentlyViewed() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
        setProducts(stored.slice(0, 5));
      } catch {
        // ignore
      }
    };
    load();
    // Re-check on focus (user may have visited another product in a new tab)
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  if (products.length === 0) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 start-4 z-40 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center cursor-pointer group"
        title={t("recentlyViewed")}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="absolute -top-1 -end-1 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
          {products.length}
        </span>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-50"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: locale === "ar" ? -320 : 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: locale === "ar" ? -320 : 320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 bottom-0 start-0 w-80 max-w-[85vw] bg-surface border-e border-border z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-dark">{t("recentlyViewed")}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-background transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Products list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {products.map((product, i) => {
                  const name = getLocalizedField(product, "name", locale);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/${locale}/products/${product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-background transition-colors group"
                      >
                        <div className="w-14 h-[4.5rem] relative bg-background rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={name}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark truncate group-hover:text-primary transition-colors">{name}</p>
                          <p className="text-sm text-primary font-bold mt-0.5">{formatPrice(product.price)}</p>
                        </div>
                        <svg className="w-4 h-4 text-muted/50 group-hover:text-primary transition-colors rtl:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border">
                <Link
                  href={`/${locale}/products`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2.5 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors"
                >
                  {t("allProducts")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
