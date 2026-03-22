"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField, formatPrice } from "@/lib/utils";

const STORAGE_KEY = "tafarud_seen_products";

interface NewProduct {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  image_url: string | null;
}

export default function NewProductNotification() {
  const [product, setProduct] = useState<NewProduct | null>(null);
  const [show, setShow] = useState(false);
  const locale = useLocale();
  const t = useTranslations("common");

  useEffect(() => {
    async function check() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("id, name_ar, name_en, price, image_url")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!data) return;

        const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
        if (!seen.includes(data.id)) {
           
          setProduct(data);
          // Show after a delay
          const timer = setTimeout(() => setShow(true), 3000);
          // Auto-hide after 8s
          const hideTimer = setTimeout(() => setShow(false), 11000);
          // Mark as seen
          seen.push(data.id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(seen.slice(-20)));
          return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
          };
        }
      } catch {
        // ignore
      }
    }
    check();
  }, []);

  const name = product ? getLocalizedField(product, "name", locale) : "";

  return (
    <AnimatePresence>
      {show && product && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-20 end-4 z-50 w-72 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-accent p-2.5 text-white text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {t("newProductAlert")}
            <button
              onClick={() => setShow(false)}
              className="ms-auto p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Link
            href={`/${locale}/products/${product.id}`}
            onClick={() => setShow(false)}
            className="flex items-center gap-3 p-3 group"
          >
            <div className="w-14 h-[4.5rem] relative bg-background rounded-lg overflow-hidden flex-shrink-0 border border-border">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark truncate group-hover:text-primary transition-colors">{name}</p>
              <p className="text-sm text-primary font-bold mt-0.5">{formatPrice(product.price)}</p>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
