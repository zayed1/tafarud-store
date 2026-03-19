"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`bg-surface rounded-xl border transition-colors ${
              isOpen ? "border-primary/30 shadow-sm" : "border-border"
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex items-center justify-between w-full px-5 py-4 text-start cursor-pointer"
            >
              <span className={`font-semibold transition-colors ${isOpen ? "text-primary" : "text-dark"}`}>
                {item.question}
              </span>
              <motion.svg
                className="w-5 h-5 text-muted flex-shrink-0 ms-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-dark-light leading-relaxed whitespace-pre-wrap">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
