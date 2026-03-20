"use client";

import { useTranslations } from "next-intl";
import AnimatedCounter from "./AnimatedCounter";

interface StatsCountersProps {
  productsCount: number;
  categoriesCount: number;
  authorsCount: number;
}

export default function StatsCounters({ productsCount, categoriesCount, authorsCount }: StatsCountersProps) {
  const t = useTranslations("common");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10">
        <div className="grid grid-cols-3 gap-6 sm:gap-8">
          <AnimatedCounter
            end={productsCount}
            label={t("statsProducts")}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
          <AnimatedCounter
            end={categoriesCount}
            label={t("statsCategories")}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <AnimatedCounter
            end={authorsCount}
            label={t("statsAuthors")}
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
