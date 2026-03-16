"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField } from "@/lib/utils";
import type { Category } from "@/types";

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<(Category & { product_count: number })[]>([]);
  const locale = useLocale();
  const t = useTranslations("common");
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("categories").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("category_id"),
    ]).then(([{ data: cats }, { data: prods }]) => {
      const countMap = new Map<string, number>();
      (prods || []).forEach((p) => {
        if (p.category_id) countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
      });
      setCategories(
        (cats || []).map((c) => ({ ...c, product_count: countMap.get(c.id) || 0 }))
      );
    });
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  if (categories.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="relative hidden md:block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1.5 px-4 py-2 font-medium transition-colors rounded-lg ${
          isOpen
            ? "text-primary bg-primary/10 dark:text-accent dark:bg-accent/10"
            : "text-dark hover:text-primary hover:bg-primary/5 dark:text-gray-300 dark:hover:text-accent"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {t("categories")}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full start-0 mt-2 w-[480px] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-dark">{t("allCategories")}</h3>
                <Link
                  href={`/${locale}/categories`}
                  className="text-xs text-primary hover:text-primary-dark font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {t("viewAll")} →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map((category, index) => {
                  const name = getLocalizedField(category, "name", locale);
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/${locale}/categories/${category.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 transition-colors group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden flex-shrink-0 relative">
                          {category.image_url ? (
                            <Image
                              src={category.image_url}
                              alt={name}
                              fill
                              className="object-contain"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-dark group-hover:text-primary transition-colors truncate">
                            {name}
                          </p>
                          <p className="text-xs text-muted">
                            {t("productsCount", { count: category.product_count })}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
