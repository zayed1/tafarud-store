"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted mb-8 overflow-x-auto pb-1">
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="flex items-center gap-2 flex-shrink-0"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {index > 0 && (
            <svg className="w-3.5 h-3.5 rtl:rotate-180 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {index === 0 && item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-1.5 group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ) : item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors hover:underline underline-offset-4">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark font-medium truncate max-w-[200px]">{item.label}</span>
          )}
        </motion.span>
      ))}
    </nav>
  );
}
