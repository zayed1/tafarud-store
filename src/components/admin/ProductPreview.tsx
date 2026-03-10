"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { PurchaseLink } from "@/types";
import { formatPrice, getCountryFlag } from "@/lib/utils";

interface ProductPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    nameAr: string;
    nameEn: string;
    descAr: string;
    descEn: string;
    price: string;
    imageUrl?: string | null;
    featured: boolean;
    purchaseLinks: Partial<PurchaseLink>[];
  };
}

export default function ProductPreview({ isOpen, onClose, product }: ProductPreviewProps) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const name = locale === "ar" ? product.nameAr : product.nameEn || product.nameAr;
  const description = locale === "ar" ? product.descAr : product.descEn || product.descAr;
  const price = parseFloat(product.price) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-semibold text-dark">{t("preview")}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-border/50 text-muted hover:text-dark cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview content */}
            <div className="p-5 space-y-5">
              {/* Image */}
              {product.imageUrl && (
                <div className="aspect-[3/2] relative bg-background rounded-xl overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={name || ""}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  {product.featured && (
                    <div className="absolute top-3 start-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/20 text-secondary border border-accent/30">
                        {tCommon("featuredProducts")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-dark">{name || "-"}</h2>
                <div className="bg-primary/5 px-4 py-2 rounded-xl inline-block">
                  <p className="text-2xl font-bold text-primary">{formatPrice(price)}</p>
                </div>
              </div>

              {description && (
                <div className="pt-3 border-t border-border">
                  <p className="text-dark-light leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
              )}

              {/* Purchase links */}
              {product.purchaseLinks.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <h4 className="font-semibold text-dark">{tCommon("buyFrom")}</h4>
                  {product.purchaseLinks
                    .filter((l) => l.is_enabled !== false)
                    .map((link, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                      >
                        <span className="text-lg">{getCountryFlag(link.country_code || "AE")}</span>
                        <span className="text-sm font-medium text-dark">
                          {tCommon("buyFrom")} {link.platform_name || "-"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
