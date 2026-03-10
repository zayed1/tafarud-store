"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("common");

  const searchProducts = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .or(
            `name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`
          )
          .limit(8);

        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("searchProducts")}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg border border-border/50 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchProducts")}
                className="flex-1 bg-transparent text-dark text-lg outline-none placeholder:text-muted"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-muted bg-background border border-border rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {isLoading && (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-12 h-16 bg-border rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-border rounded w-3/4" />
                        <div className="h-3 bg-border rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center text-muted">
                  <svg className="w-12 h-12 mx-auto mb-3 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p>{t("noSearchResults")}</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((product, index) => {
                    const name = getLocalizedField(product, "name", locale);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/${locale}/products/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-background transition-colors group"
                        >
                          <div className="w-12 h-16 relative bg-background rounded-lg overflow-hidden flex-shrink-0 border border-border">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={name}
                                fill
                                className="object-contain"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark group-hover:text-primary transition-colors truncate">{name}</p>
                            <p className="text-sm text-primary font-semibold">{formatPrice(product.price)}</p>
                          </div>
                          <svg className="w-4 h-4 text-muted group-hover:text-primary transition-colors rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {!isLoading && query.length < 2 && (
                <div className="p-8 text-center text-muted">
                  <svg className="w-12 h-12 mx-auto mb-3 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm">{t("searchProducts")}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
