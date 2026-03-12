"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import SearchModal from "@/components/ui/SearchModal";

function SuggestedProducts({ locale }: { locale: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const t = useTranslations("common");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("featured", true)
      .limit(4)
      .then(({ data }) => setProducts(data || []));
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="pt-6 border-t border-border">
      <p className="text-sm text-muted mb-4">{t("youMightLike")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((product, index) => {
          const name = getLocalizedField(product, "name", locale);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={`/${locale}/products/${product.id}`}
                className="block bg-surface border border-border rounded-xl p-3 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-full aspect-[3/4] relative bg-background rounded-lg overflow-hidden mb-2">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform"
                      sizes="120px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-dark truncate group-hover:text-primary transition-colors">{name}</p>
                <p className="text-xs text-primary font-semibold mt-0.5">{formatPrice(product.price)}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("common");
  const [searchOpen, setSearchOpen] = useState(false);

  const suggestedLinks = [
    { href: `/${locale}/products`, label: t("allProducts"), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { href: `/${locale}/categories`, label: t("allCategories"), icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { href: `/${locale}/about`, label: t("about"), icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 start-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 end-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/10 rounded-full"
            style={{ top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }}
            animate={{ y: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="text-center max-w-2xl relative">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <div className="text-[10rem] sm:text-[12rem] font-black leading-none gradient-text select-none">
            404
          </div>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 bg-primary/10 backdrop-blur-sm rounded-2xl border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </motion.div>
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
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 w-full max-w-sm mx-auto px-5 py-3 bg-surface border border-border rounded-xl text-muted hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm">{t("trySearching")}</span>
          </button>

          {/* Back home */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t("backHome")}
          </Link>

          {/* Suggested Products */}
          <SuggestedProducts locale={locale} />

          {/* Suggested links */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted mb-4">{t("suggestedCategories")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestedLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-dark hover:border-primary/30 hover:text-primary hover:shadow-md transition-all dark:text-gray-300 group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
