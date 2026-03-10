"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
    <div className="space-y-4 mb-8">
      {/* Sort + Count row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted">
          {t("productsCount", { count: productCount })}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{t("sortBy")}:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm bg-surface border border-border rounded-lg px-3 py-1.5 text-dark focus:outline-none focus:border-primary cursor-pointer"
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
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              selectedCategory === ""
                ? "bg-primary text-white shadow-sm"
                : "bg-surface border border-border text-dark-light hover:border-primary/30 hover:text-primary"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {t("allCategories2")}
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface border border-border text-dark-light hover:border-primary/30 hover:text-primary"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {getLocalizedField(category, "name", locale)}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
