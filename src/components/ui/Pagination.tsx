"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const t = useTranslations("common");

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-surface text-dark hover:border-primary/30 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer dark:text-gray-300"
        whileTap={{ scale: 0.95 }}
      >
        {t("previous")}
      </motion.button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-muted">...</span>
          ) : (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "border border-border bg-surface text-dark hover:border-primary/30 hover:text-primary dark:text-gray-300"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </motion.button>
          )
        )}
      </div>

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-border bg-surface text-dark hover:border-primary/30 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer dark:text-gray-300"
        whileTap={{ scale: 0.95 }}
      >
        {t("next")}
      </motion.button>
    </nav>
  );
}
