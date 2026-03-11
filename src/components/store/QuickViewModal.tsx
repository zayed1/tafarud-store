"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import WhatsAppButton from "./WhatsAppButton";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [product, onClose]);

  if (!product) return null;

  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-border/50"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 end-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm border border-border hover:bg-background transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-[3/4] relative bg-background overflow-hidden rounded-t-2xl sm:rounded-s-2xl sm:rounded-e-none">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGNEYzIi8+PC9zdmc+"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    <svg className="w-20 h-20 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-3 start-3">
                    <Badge variant="accent">{t("featuredProducts")}</Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 space-y-4 flex flex-col">
                {product.category && (
                  <Badge variant="accent" className="self-start">
                    {getLocalizedField(product.category, "name", locale)}
                  </Badge>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-dark">{name}</h2>
                <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>

                {description && (
                  <p className="text-dark-light text-sm leading-relaxed line-clamp-4 flex-1">
                    {description}
                  </p>
                )}

                <div className="space-y-3 pt-2">
                  <WhatsAppButton productName={name} />
                  <Link
                    href={`/${locale}/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    {t("viewDetails")}
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
