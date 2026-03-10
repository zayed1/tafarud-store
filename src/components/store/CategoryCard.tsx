"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Category } from "@/types";
import { getLocalizedField } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const name = getLocalizedField(category, "name", locale);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/${locale}/categories/${category.slug}`} className="block group">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
          <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent group-hover:from-primary-dark/80 transition-all duration-500" />
            <div className="absolute bottom-0 start-0 end-0 p-4">
              <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
              <div className="flex items-center gap-1.5 text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span>{t("viewAll")}</span>
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
