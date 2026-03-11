"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGrid from "@/components/store/ProductGrid";
import ProductFilters from "@/components/store/ProductFilters";
import Pagination from "@/components/ui/Pagination";
import QuickViewModal from "@/components/store/QuickViewModal";
import { Product, Category } from "@/types";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

  const totalPages = Math.ceil(filteredAndSorted.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("allProducts")}</h1>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        productCount={filteredAndSorted.length}
      />

      {paginatedProducts.length > 0 ? (
        <>
          <ProductGrid products={paginatedProducts} onQuickView={handleQuickView} />

          {/* Load more + pagination */}
          {totalPages > 1 && (
            <div className="mt-8 space-y-4">
              {currentPage < totalPages && (
                <div className="text-center">
                  <motion.button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-dark font-medium hover:border-primary/30 hover:text-primary transition-all cursor-pointer dark:text-gray-300"
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                    </svg>
                    {t("loadMore")}
                  </motion.button>
                  <p className="text-xs text-muted mt-2">
                    {t("showingOf", {
                      showing: Math.min(currentPage * PRODUCTS_PER_PAGE, filteredAndSorted.length),
                      total: filteredAndSorted.length,
                    })}
                  </p>
                </div>
              )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
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

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
