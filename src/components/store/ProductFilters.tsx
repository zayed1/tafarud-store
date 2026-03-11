"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types";
import { getLocalizedField } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  productCount: number;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
  productCount,
}: ProductFiltersProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
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
          <span className="text-sm text-muted">{t("sortBy")}:</span>
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

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
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
    </motion.div>
  );
}
