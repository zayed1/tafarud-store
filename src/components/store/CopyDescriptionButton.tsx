"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function CopyDescriptionButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("common");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  if (!text) return null;

  return (
    <motion.button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-primary/5"
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t("descriptionCopied")}
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {t("copyDescription")}
        </>
      )}
    </motion.button>
  );
}
