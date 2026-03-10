"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGrid from "@/components/store/ProductGrid";
import ProductFilters from "@/components/store/ProductFilters";
import { Product, Category } from "@/types";

interface Props {
  products: Product[];
  categories: Category[];
  locale: string;
}

export default function ProductsPageClient({ products, categories, locale }: Props) {
  const t = useTranslations("common");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
        productCount={filteredAndSorted.length}
      />

      {filteredAndSorted.length > 0 ? (
        <ProductGrid products={filteredAndSorted} />
      ) : (
        <div className="text-center py-20 text-muted">
          <div className="w-20 h-20 mx-auto mb-4 bg-border/30 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
