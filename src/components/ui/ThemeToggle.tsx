"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Subscribe to nothing (values only change via user clicks)
const _noop = () => () => {};

export default function ThemeToggle() {
  const t = useTranslations("common");

  const isDark = useSyncExternalStore(
    _noop,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  const isHighContrast = useSyncExternalStore(
    _noop,
    () => document.documentElement.classList.contains("high-contrast"),
    () => false
  );

  const [, rerender] = useState(0);

  const toggleTheme = useCallback(() => {
    const newDark = !document.documentElement.classList.contains("dark");
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    rerender((n) => n + 1);
  }, []);

  const toggleHighContrast = useCallback(() => {
    const newHC = !document.documentElement.classList.contains("high-contrast");
    if (newHC) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("high-contrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("high-contrast", "false");
    }
    rerender((n) => n + 1);
  }, []);

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-border/50 text-dark hover:text-primary transition-colors cursor-pointer dark:text-gray-300 dark:hover:text-accent"
        whileTap={{ scale: 0.9 }}
        aria-label={isDark ? t("lightMode") : t("darkMode")}
        title={isDark ? t("lightMode") : t("darkMode")}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.button>
      <motion.button
        onClick={toggleHighContrast}
        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
          isHighContrast
            ? "bg-primary/20 text-primary dark:bg-accent/20 dark:text-accent"
            : "text-muted hover:text-dark hover:bg-border/50 dark:hover:text-gray-300"
        }`}
        whileTap={{ scale: 0.9 }}
        aria-label={t("highContrast")}
        aria-pressed={isHighContrast}
        title={t("highContrast")}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M12 3a9 9 0 010 18" fill="currentColor" />
        </svg>
      </motion.button>
    </div>
  );
}
