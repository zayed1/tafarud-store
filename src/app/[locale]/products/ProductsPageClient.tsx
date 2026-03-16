"use client";

import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGrid from "@/components/store/ProductGrid";
import ProductListItem from "@/components/store/ProductListItem";
import ProductFilters from "@/components/store/ProductFilters";
import ShareCollection from "@/components/store/ShareCollection";
import type { Product, Category } from "@/types";

const QuickViewModal = lazy(() => import("@/components/store/QuickViewModal"));

const PRODUCTS_PER_PAGE = 12;

interface Props {
  products: Product[];
  categories: Category[];
  locale: string;
}

export default function ProductsPageClient({ products, categories, locale }: Props) {
  const t = useTranslations("common");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  const visibleProducts = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
        }
      },
      { rootMargin: "200px" }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setVisibleCount(PRODUCTS_PER_PAGE);
  };

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("allProducts") },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
          <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("allProducts")}</h1>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-dark"
            }`}
            title={t("gridView")}
            aria-label={t("gridView")}
            aria-pressed={viewMode === "grid"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-dark"
            }`}
            title={t("listView")}
            aria-label={t("listView")}
            aria-pressed={viewMode === "list"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        productCount={filteredAndSorted.length}
      />

      {visibleProducts.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProductGrid products={visibleProducts} onQuickView={handleQuickView} />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductListItem product={product} onQuickView={handleQuickView} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-muted text-sm">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {t("loading")}
              </div>
              <p className="text-xs text-muted mt-2">
                {t("showingOf", {
                  showing: visibleProducts.length,
                  total: filteredAndSorted.length,
                })}
              </p>
            </div>
          )}

          {!hasMore && filteredAndSorted.length > PRODUCTS_PER_PAGE && (
            <p className="text-center text-xs text-muted mt-8">
              {t("showingOf", {
                showing: filteredAndSorted.length,
                total: filteredAndSorted.length,
              })}
            </p>
          )}
        </>
      ) : (
        <motion.div
          className="text-center py-20 text-muted"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-4 bg-border/30 rounded-2xl flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </motion.div>
          <p className="text-lg">{t("noResults")}</p>
        </motion.div>
      )}

      {quickViewProduct && (
        <Suspense fallback={null}>
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
        </Suspense>
      )}

      {/* Share Collection */}
      <ShareCollection products={products} />
    </div>
  );
}
