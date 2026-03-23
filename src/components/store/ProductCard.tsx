"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import ProgressiveImage from "@/components/ui/ProgressiveImage";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

function ProductCard({ product, onQuickView }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const name = getLocalizedField(product, "name", locale);
  const categoryName = product.category
    ? getLocalizedField(product.category, "name", locale)
    : "";
  const authorName = product.author
    ? getLocalizedField(product.author, "name", locale)
    : "";
  const isNew = isNewProduct(product.created_at);
  const isOutOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0;

  const handlePrefetch = useCallback(() => {
    router.prefetch(`/${locale}/products/${product.id}`);
  }, [router, locale, product.id]);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/${locale}/products/${product.id}`} className="block group" onMouseEnter={handlePrefetch}>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
          <div className="aspect-[3/4] relative bg-background overflow-hidden">
            {product.image_url ? (
              <ProgressiveImage
                src={product.image_url}
                alt={name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <svg className="w-16 h-16 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}

            {/* Badges - top start */}
            <div className="absolute top-3 start-3 flex flex-col gap-1.5">
              {product.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-accent text-white shadow-sm">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {t("featuredProducts")}
                </span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500 text-white shadow-sm">
                  {t("outOfStock")}
                </span>
              )}
              {isNew && (
                <motion.span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 text-white shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {t("new")}
                </motion.span>
              )}
            </div>

            {/* Wishlist - top end */}
            <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <WishlistButton productId={product.id} size="sm" />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t("viewDetails")}
                </span>
                {onQuickView && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="text-white bg-white/20 backdrop-blur-sm p-2 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-white/30 cursor-pointer"
                    title={t("quickView")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card content */}
          <div className="p-4 space-y-2.5">
            {categoryName && (
              <span className="inline-block text-xs text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-md">{categoryName}</span>
            )}
            <h3 className="font-semibold text-dark text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">{name}</h3>
            {authorName && (
              <p className="text-xs text-muted flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {authorName}
              </p>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
              <span className="text-xs text-muted flex items-center gap-1 group-hover:text-primary transition-colors">
                {t("viewDetails")}
                <svg className="w-3.5 h-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(ProductCard);
