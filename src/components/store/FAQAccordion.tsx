"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  categories?: string[];
  whatsappNumber?: string;
  contactText?: string;
  contactDesc?: string;
  searchPlaceholder?: string;
  allText?: string;
}

export default function FAQAccordion({
  items,
  categories = [],
  whatsappNumber,
  contactText,
  contactDesc,
  searchPlaceholder,
  allText = "الكل",
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory) {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (search.trim().length >= 2) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, search, activeCategory]);

  const highlightMatch = (text: string) => {
    if (search.trim().length < 2) return text;
    const q = search.trim();
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full ps-12 pe-4 py-3 rounded-xl border border-border bg-surface text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              !activeCategory
                ? "bg-primary text-white"
                : "bg-surface border border-border text-muted hover:border-primary/30 hover:text-primary"
            }`}
          >
            {allText}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted hover:border-primary/30 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Items */}
      {filtered.length === 0 ? (
        <p className="text-muted text-center py-8">لا توجد نتائج</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
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
                    {highlightMatch(item.question)}
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
                        {highlightMatch(item.answer)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact button */}
      {whatsappNumber && (
        <div className="mt-8 text-center bg-surface rounded-2xl border border-border p-8">
          <svg className="w-10 h-10 text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.065 2.085-1.37 3.146-.806.374.197.698.483.94.84.29.429.436.95.436 1.466 0 .516-.146 1.037-.436 1.466-.242.357-.566.643-.94.84-1.061.564-2.597.259-3.146-.806M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-dark mb-2">{contactText}</h3>
          <p className="text-sm text-muted mb-4">{contactDesc}</p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.612l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.678-6.305-1.843l-.44-.282-2.655.89.89-2.655-.282-.44A9.964 9.964 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
            </svg>
            <span>{contactText}</span>
          </a>
        </div>
      )}
    </div>
  );
}
