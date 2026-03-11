"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import { Product, Category } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = "tafarud_recent_searches";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const searches = getRecentSearches().filter((s) => s !== query);
  searches.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 5)));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      const supabase = createClient();
      supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data }) => setCategories(data || []));
    }
  }, [isOpen]);

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
            `name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%,description_ar.ilike.%${searchQuery}%,description_en.ilike.%${searchQuery}%`
          )
          .limit(8);

        setResults(data || []);
        if (data && data.length > 0) {
          saveRecentSearch(searchQuery);
        }
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
              {isLoading ? (
                <div className="w-5 h-5 flex-shrink-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchProducts")}
                className="flex-1 bg-transparent text-dark text-lg outline-none placeholder:text-muted"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted hover:text-dark transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-muted bg-background border border-border rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto">
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
                  <motion.svg
                    className="w-12 h-12 mx-auto mb-3 text-muted/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </motion.svg>
                  <p>{t("noSearchResults")}</p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((product, index) => {
                    const name = getLocalizedField(product, "name", locale);
                    const categoryName = product.category
                      ? getLocalizedField(product.category, "name", locale)
                      : "";
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
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
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-primary font-semibold">{formatPrice(product.price)}</p>
                              {categoryName && (
                                <span className="text-xs text-muted bg-border/30 px-2 py-0.5 rounded-full">{categoryName}</span>
                              )}
                            </div>
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

              {/* Default state: categories + recent searches */}
              {!isLoading && query.length < 2 && (
                <div className="p-4 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted uppercase tracking-wider">{t("recentSearches")}</p>
                        <button
                          onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                          className="text-xs text-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          {t("clearSearch")}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1.5 text-sm bg-background border border-border rounded-lg text-dark-light hover:border-primary/30 hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {categories.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">{t("searchByCategory")}</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/${locale}/categories/${cat.slug}`}
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm bg-primary/5 border border-primary/10 rounded-lg text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10m-7 5h4" />
                            </svg>
                            {getLocalizedField(cat, "name", locale)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentSearches.length === 0 && categories.length === 0 && (
                    <div className="py-4 text-center text-muted">
                      <svg className="w-10 h-10 mx-auto mb-2 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-sm">{t("searchProducts")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
