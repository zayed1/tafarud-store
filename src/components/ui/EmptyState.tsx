"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  icon: "book" | "category" | "search" | "cart" | "error" | "favorite";
  message: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const illustrations: Record<string, React.ReactNode> = {
  book: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="52" height="56" rx="4" className="fill-primary/5 stroke-primary/20" strokeWidth="2" />
      <rect x="20" y="18" width="40" height="4" rx="2" className="fill-primary/15" />
      <rect x="20" y="26" width="32" height="3" rx="1.5" className="fill-primary/10" />
      <rect x="20" y="33" width="36" height="3" rx="1.5" className="fill-primary/10" />
      <rect x="20" y="40" width="28" height="3" rx="1.5" className="fill-primary/10" />
      <path d="M40 52C40 52 32 56 24 56C24 56 24 48 32 46C36 45 40 46 40 46C40 46 44 45 48 46C56 48 56 56 56 56C48 56 40 52 40 52Z" className="fill-primary/10 stroke-primary/30" strokeWidth="1.5" />
    </svg>
  ),
  category: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="24" height="24" rx="6" className="fill-primary/10 stroke-primary/20" strokeWidth="2" />
      <rect x="46" y="10" width="24" height="24" rx="6" className="fill-accent/10 stroke-accent/20" strokeWidth="2" />
      <rect x="10" y="46" width="24" height="24" rx="6" className="fill-accent/10 stroke-accent/20" strokeWidth="2" />
      <rect x="46" y="46" width="24" height="24" rx="6" className="fill-primary/10 stroke-primary/20" strokeWidth="2" />
      <circle cx="22" cy="22" r="4" className="fill-primary/20" />
      <circle cx="58" cy="22" r="4" className="fill-accent/20" />
      <circle cx="22" cy="58" r="4" className="fill-accent/20" />
      <circle cx="58" cy="58" r="4" className="fill-primary/20" />
    </svg>
  ),
  search: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="34" cy="34" r="20" className="fill-primary/5 stroke-primary/20" strokeWidth="2" />
      <circle cx="34" cy="34" r="12" className="stroke-primary/10" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="48" y1="48" x2="64" y2="64" className="stroke-primary/30" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 32C28 32 31 28 36 28" className="stroke-primary/20" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  cart: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 16H24L30 52H56L64 24H28" className="fill-none stroke-primary/20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="60" r="4" className="fill-primary/10 stroke-primary/20" strokeWidth="2" />
      <circle cx="52" cy="60" r="4" className="fill-primary/10 stroke-primary/20" strokeWidth="2" />
      <line x1="36" y1="32" x2="48" y2="44" className="stroke-primary/15" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="32" x2="36" y2="44" className="stroke-primary/15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 14L68 62H12L40 14Z" className="fill-red-500/5 stroke-red-500/20" strokeWidth="2" strokeLinejoin="round" />
      <line x1="40" y1="32" x2="40" y2="46" className="stroke-red-500/30" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="54" r="2" className="fill-red-500/30" />
    </svg>
  ),
  favorite: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 64S12 48 12 28C12 18 20 12 30 12C36 12 40 16 40 16C40 16 44 12 50 12C60 12 68 18 68 28C68 48 40 64 40 64Z" className="fill-primary/5 stroke-primary/20" strokeWidth="2" />
      <path d="M32 28C28 28 24 30 24 34" className="stroke-primary/15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export default function EmptyState({ icon, message, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-20 text-muted">
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-border/20 rounded-3xl flex items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {illustrations[icon]}
      </motion.div>
      <p className="text-lg font-medium text-dark/70 mb-2">{message}</p>
      {description && <p className="text-sm text-muted mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
        >
          {actionLabel}
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
