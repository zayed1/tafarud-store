"use client";

import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = [
  { id: "classic", color: "#0D8070", darkColor: "#2DD4BF" },
  { id: "ocean", color: "#1E6CB0", darkColor: "#60A5FA" },
  { id: "sunset", color: "#C96830", darkColor: "#F59E0B" },
  { id: "lavender", color: "#7C3AED", darkColor: "#A78BFA" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const THEME_CLASSES: Record<string, string> = {
  classic: "",
  ocean: "theme-ocean",
  sunset: "theme-sunset",
  lavender: "theme-lavender",
};

const _noop = () => () => {};

function getCurrentTheme(): ThemeId {
  if (typeof document === "undefined") return "classic";
  const el = document.documentElement;
  if (el.classList.contains("theme-ocean")) return "ocean";
  if (el.classList.contains("theme-sunset")) return "sunset";
  if (el.classList.contains("theme-lavender")) return "lavender";
  return "classic";
}

export default function DesignThemeSelector() {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [, rerender] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentTheme = useSyncExternalStore(
    _noop,
    getCurrentTheme,
    () => "classic" as ThemeId
  );

  const isDark = useSyncExternalStore(
    _noop,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const applyTheme = useCallback((themeId: ThemeId) => {
    const el = document.documentElement;
    // Remove all theme classes
    el.classList.remove("theme-ocean", "theme-sunset", "theme-lavender");
    // Apply new theme class
    const cls = THEME_CLASSES[themeId];
    if (cls) el.classList.add(cls);
    localStorage.setItem("design-theme", themeId);
    rerender((n) => n + 1);
    setIsOpen(false);
  }, []);

  const currentThemeData = THEMES.find((th) => th.id === currentTheme) || THEMES[0];

  return (
    <div ref={panelRef} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-border/50 text-dark hover:text-primary transition-colors cursor-pointer dark:text-gray-300 dark:hover:text-accent"
        whileTap={{ scale: 0.9 }}
        aria-label={t("designTheme")}
        title={t("designTheme")}
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full end-0 mt-2 bg-surface border border-border rounded-xl shadow-xl p-3 z-50 min-w-[200px]"
          >
            <p className="text-xs font-medium text-muted mb-2 px-1">{t("designTheme")}</p>
            <div className="space-y-1">
              {THEMES.map((theme) => {
                const isActive = theme.id === currentTheme;
                const displayColor = isDark ? theme.darkColor : theme.color;
                return (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary/10 ring-1 ring-primary/30"
                        : "hover:bg-border/30"
                    }`}
                  >
                    {/* Color swatch */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full border-2 shadow-sm flex-shrink-0"
                        style={{
                          backgroundColor: displayColor,
                          borderColor: isActive ? displayColor : "transparent",
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-dark"
                    }`}>
                      {t(`theme_${theme.id}`)}
                    </span>
                    {isActive && (
                      <svg className="w-4 h-4 text-primary ms-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
