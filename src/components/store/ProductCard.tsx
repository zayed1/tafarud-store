"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import TiltCard from "./TiltCard";

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

  // Smart prefetch on hover
  const handlePrefetch = useCallback(() => {
    router.prefetch(`/${locale}/products/${product.id}`);
  }, [router, locale, product.id]);

  return (
    <TiltCard>
      <Link href={`/${locale}/products/${product.id}`} className="block group" onMouseEnter={handlePrefetch}>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
          <div className="aspect-[3/4] relative bg-background overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGNEYzIi8+PC9zdmc+"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <svg className="w-16 h-16 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 start-3 flex flex-col gap-1.5">
              {product.featured && (
                <Badge variant="accent">{t("featuredProducts")}</Badge>
              )}
              {isNew && (
                <motion.span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {t("new")}
                </motion.span>
              )}
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-dark/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
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
          <div className="p-4 space-y-2">
            {categoryName && (
              <span className="text-xs text-primary/70 font-medium">{categoryName}</span>
            )}
            <h3 className="font-semibold text-dark text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">{name}</h3>
            {authorName && (
              <p className="text-xs text-muted">{t("by")} {authorName}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-all rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export default memo(ProductCard);
