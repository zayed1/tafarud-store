"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types";
import { getLocalizedField } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  productCount: number;
  priceRange?: [number, number];
  maxPrice?: number;
  onPriceRangeChange?: (range: [number, number]) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
  productCount,
  priceRange,
  maxPrice,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const selectedCategoryName = selectedCategory
    ? getLocalizedField(
        categories.find((c) => c.id === selectedCategory) || { name_ar: "", name_en: "" },
        "name",
        locale
      )
    : t("allCategories2");

  return (
    <>
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sort + Count row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <AnimatePresence mode="wait">
            <motion.p
              key={productCount}
              className="text-sm text-muted"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {t("productsCount", { count: productCount })}
            </motion.p>
          </AnimatePresence>
          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            {categories.length > 0 && (
              <button
                onClick={() => setShowMobileFilters(true)}
                className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 text-sm bg-surface border border-border rounded-lg text-dark cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {selectedCategoryName}
              </button>
            )}
            <span className="text-sm text-muted hidden sm:inline">{t("sortBy")}:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm bg-surface border border-border rounded-lg px-3 py-1.5 text-dark focus:outline-none focus:border-primary cursor-pointer transition-colors"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price_asc">{t("priceLowToHigh")}</option>
              <option value="price_desc">{t("priceHighToLow")}</option>
            </select>
          </div>
        </div>

        {/* Desktop category filter chips */}
        {categories.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            <motion.button
              onClick={() => onCategoryChange("")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer relative ${
                selectedCategory === ""
                  ? "text-white shadow-sm"
                  : "bg-surface border border-border text-dark hover:border-primary/30 hover:text-primary dark:text-gray-300"
              }`}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.03 }}
            >
              {selectedCategory === "" && (
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full"
                  layoutId="activeCategory"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t("allCategories2")}</span>
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer relative ${
                  selectedCategory === category.id
                    ? "text-white shadow-sm"
                    : "bg-surface border border-border text-dark hover:border-primary/30 hover:text-primary dark:text-gray-300"
                }`}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.03 }}
              >
                {selectedCategory === category.id && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{getLocalizedField(category, "name", locale)}</span>
              </motion.button>
            ))}
          </div>
        )}
        {/* Price Range Filter */}
        {maxPrice !== undefined && maxPrice > 0 && priceRange && onPriceRangeChange && (
          <div className="hidden sm:flex items-center gap-3 pt-1">
            <span className="text-xs text-muted font-medium flex-shrink-0">{t("priceRange")}:</span>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="flex-1 h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-primary max-w-xs"
            />
            <span className="text-xs text-muted font-mono tabular-nums flex-shrink-0">
              {priceRange[0]} - {priceRange[1]} AED
            </span>
          </div>
        )}
      </motion.div>

      {/* Mobile Bottom Sheet Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              className="fixed bottom-0 start-0 end-0 bg-surface border-t border-border rounded-t-3xl z-50 sm:hidden max-h-[70vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Handle bar */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>
              <div className="px-5 pb-8">
                <h3 className="text-lg font-bold text-dark mb-4">{t("filterByCategory")}</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { onCategoryChange(""); setShowMobileFilters(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      selectedCategory === ""
                        ? "bg-primary text-white"
                        : "text-dark hover:bg-primary/5"
                    }`}
                  >
                    <span>{t("allCategories2")}</span>
                    {selectedCategory === "" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => { onCategoryChange(category.id); setShowMobileFilters(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                        selectedCategory === category.id
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-primary/5"
                      }`}
                    >
                      <span>{getLocalizedField(category, "name", locale)}</span>
                      {selectedCategory === category.id && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
