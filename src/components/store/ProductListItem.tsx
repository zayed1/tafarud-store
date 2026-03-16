"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductListItemProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

function ProductListItem({ product, onQuickView }: ProductListItemProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale);
  const categoryName = product.category
    ? getLocalizedField(product.category, "name", locale)
    : "";

  return (
    <motion.div
      whileHover={{ x: locale === "ar" ? -4 : 4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/${locale}/products/${product.id}`}
        className="flex gap-4 sm:gap-6 bg-surface rounded-2xl border border-border p-4 hover:shadow-lg hover:border-primary/20 transition-all group"
      >
        <div className="w-24 h-32 sm:w-32 sm:h-44 relative bg-background rounded-xl overflow-hidden flex-shrink-0">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
              <svg className="w-10 h-10 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 start-2">
              <Badge variant="accent">{t("featuredProducts")}</Badge>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            {categoryName && (
              <span className="text-xs text-primary font-medium">{categoryName}</span>
            )}
            <h3 className="font-semibold text-dark text-lg group-hover:text-primary transition-colors line-clamp-2 mt-1">
              {name}
            </h3>
            {description && (
              <p className="text-muted text-sm line-clamp-2 mt-2">{description}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-2">
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product);
                  }}
                  className="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  title={t("quickView")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              )}
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-all rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(ProductListItem);
