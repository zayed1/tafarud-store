"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

const STORAGE_KEY = "tafarud_welcomed";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const locale = useLocale();

  useEffect(() => {
    // Only show once per visitor
    const welcomed = localStorage.getItem(STORAGE_KEY);
    if (!welcomed) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-border"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary p-8 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 start-4 w-20 h-20 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-4 end-4 w-24 h-24 bg-accent rounded-full blur-2xl" />
              </div>
              <div className="relative">
                <Image
                  src="/main/iconn.png"
                  alt={t("storeName")}
                  width={64}
                  height={64}
                  className="mx-auto mb-4 drop-shadow-lg"
                />
                <h2 className="text-2xl font-bold text-white mb-1">{t("welcomeTitle")}</h2>
                <p className="text-white/80 text-sm">{t("welcomeSubtitle")}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              <p className="text-dark-light text-sm leading-relaxed mb-6">
                {t("welcomeDesc")}
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/products`}
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
                >
                  {t("welcomeBrowse")}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button
                  onClick={handleClose}
                  className="text-sm text-muted hover:text-dark transition-colors cursor-pointer py-2"
                >
                  {t("welcomeSkip")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
