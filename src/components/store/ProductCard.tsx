"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const name = getLocalizedField(product, "name", locale);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/${locale}/products/${product.id}`} className="block group">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
          <div className="aspect-[3/4] relative bg-background overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <svg className="w-16 h-16 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-3 start-3">
                <Badge variant="accent">{t("featuredProducts")}</Badge>
              </div>
            )}
            {/* Hover overlay with quick view hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="text-white text-sm font-medium bg-primary/80 backdrop-blur-sm px-4 py-1.5 rounded-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {t("viewDetails")}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-dark text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">{name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
              <svg className="w-5 h-5 text-muted group-hover:text-primary transition-all rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
