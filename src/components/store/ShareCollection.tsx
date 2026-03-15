"use client";

import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Image from "next/image";

interface ShareCollectionProps {
  products: Product[];
}

export default function ShareCollection({ products }: ShareCollectionProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const locale = useLocale();
  const t = useTranslations("common");

  const toggleProduct = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const generateLink = useCallback(() => {
    const ids = Array.from(selected).join(",");
    const url = `${window.location.origin}/${locale}/products?collection=${ids}`;
    return url;
  }, [selected, locale]);

  const handleCopy = useCallback(async () => {
    const url = generateLink();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generateLink]);

  const handleShare = useCallback(async () => {
    const url = generateLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("shareCollection"),
          text: t("shareCollectionDesc", { count: selected.size }),
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  }, [generateLink, t, selected.size, handleCopy]);

  if (products.length === 0) return null;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 end-6 z-30 bg-primary text-white rounded-full px-5 py-3 shadow-lg shadow-primary/30 flex items-center gap-2 cursor-pointer hover:bg-primary-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t("shareCollection")} ({selected.size})
          </motion.button>
        )}
      </AnimatePresence>

      {/* Selection indicators on products */}
      <div className="hidden">
        {/* This component exposes toggleProduct and selected via context-like pattern */}
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-surface rounded-2xl border border-border max-w-md w-full max-h-[70vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-dark text-lg">{t("shareCollection")}</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-border/50 cursor-pointer">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-5 max-h-[40vh] overflow-y-auto space-y-3">
                {products.filter((p) => selected.has(p.id)).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-2 bg-background rounded-lg">
                    <div className="w-10 h-12 relative bg-border/20 rounded overflow-hidden flex-shrink-0">
                      {product.image_url && (
                        <Image src={product.image_url} alt="" fill className="object-contain" sizes="40px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">
                        {getLocalizedField(product, "name", locale)}
                      </p>
                      <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className="p-1 text-red-400 hover:text-red-500 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-border space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {t("shareVia")}
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full py-3 bg-background border border-border text-dark rounded-xl font-medium hover:bg-border/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {copied ? t("linkCopied") : t("copyLink")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Export selection helpers for use in ProductCard
export function useCollectionSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { selected, toggle };
}
