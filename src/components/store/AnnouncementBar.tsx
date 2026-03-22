"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Announcement {
  id: string;
  text_ar: string;
  text_en: string;
  link: string | null;
  is_active: boolean;
  bg_color: string | null;
  text_color: string | null;
  starts_at: string | null;
  ends_at: string | null;
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const locale = useLocale();

  const loadAnnouncement = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        const now = new Date().toISOString();
        const withinSchedule =
          (!data.starts_at || data.starts_at <= now) &&
          (!data.ends_at || data.ends_at >= now);
        if (withinSchedule) setAnnouncement(data);
      }
    } catch {
      // Table might not exist yet
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnnouncement();
  }, [loadAnnouncement]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissedId = sessionStorage.getItem("dismissed_announcement");
    if (dismissedId && announcement && dismissedId === announcement.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(true);
    }
  }, [announcement]);

  if (!announcement || dismissed) return null;

  const text = getLocalizedField(announcement, "text", locale);
  const bgColor = announcement.bg_color || "var(--color-primary)";
  const textColor = announcement.text_color || "#FFFFFF";

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("dismissed_announcement", announcement.id);
  };

  const content = (
    <span className="text-sm font-medium">{text}</span>
  );

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ backgroundColor: bgColor, color: textColor }}
          className="relative z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            {announcement.link ? (
              <Link href={announcement.link} className="hover:underline underline-offset-2">
                {content}
              </Link>
            ) : (
              content
            )}
            <button
              onClick={handleDismiss}
              className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: textColor }}
              aria-label="close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
