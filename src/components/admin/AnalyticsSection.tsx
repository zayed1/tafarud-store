"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";

interface AnalyticsSectionProps {
  products: Product[];
}

export default function AnalyticsSection({ products }: AnalyticsSectionProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const analytics = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = products.filter((p) => new Date(p.created_at) >= weekAgo);
    const thisMonth = products.filter((p) => new Date(p.created_at) >= monthAgo);

    // Price distribution
    const priceRanges = [
      { label: "0-50", min: 0, max: 50, count: 0 },
      { label: "50-100", min: 50, max: 100, count: 0 },
      { label: "100-200", min: 100, max: 200, count: 0 },
      { label: "200+", min: 200, max: Infinity, count: 0 },
    ];
    products.forEach((p) => {
      const range = priceRanges.find((r) => p.price >= r.min && p.price < r.max);
      if (range) range.count++;
    });

    // Category distribution
    const categoryMap = new Map<string, { name: string; count: number }>();
    products.forEach((p) => {
      if (p.category) {
        const key = p.category_id || "unknown";
        const existing = categoryMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(key, {
            name: getLocalizedField(p.category, "name", locale),
            count: 1,
          });
        }
      }
    });
    const categoryDist = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

    // Average price
    const avgPrice = products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

    // Most expensive
    const mostExpensive = products.length > 0
      ? products.reduce((max, p) => (p.price > max.price ? p : max), products[0])
      : null;

    return {
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      priceRanges,
      categoryDist,
      avgPrice,
      mostExpensive,
    };
  }, [products, locale]);

  const maxCategoryCount = Math.max(...analytics.categoryDist.map((c) => c.count), 1);
  const maxPriceCount = Math.max(...analytics.priceRanges.map((r) => r.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products added timeline */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t("analytics")}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-background rounded-lg">
            <p className="text-2xl font-bold text-primary">{products.length}</p>
            <p className="text-xs text-muted mt-1">{t("totalViews")}</p>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <p className="text-2xl font-bold text-green-600">{analytics.thisWeek}</p>
            <p className="text-xs text-muted mt-1">{t("viewsThisWeek")}</p>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <p className="text-2xl font-bold text-accent">{analytics.thisMonth}</p>
            <p className="text-xs text-muted mt-1">30 days</p>
          </div>
        </div>
        {analytics.mostExpensive && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs text-muted mb-1">{t("mostViewed")}</p>
            <p className="font-medium text-dark text-sm truncate">
              {getLocalizedField(analytics.mostExpensive, "name", locale)}
            </p>
            <p className="text-primary font-semibold text-sm">{formatPrice(analytics.mostExpensive.price)}</p>
          </div>
        )}
      </div>

      {/* Category distribution */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          {t("filterByCategory")}
        </h3>
        {analytics.categoryDist.length > 0 ? (
          <div className="space-y-3">
            {analytics.categoryDist.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-dark">{cat.name}</span>
                  <span className="text-muted">{cat.count}</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">{t("noData")}</p>
        )}
      </div>

      {/* Price distribution */}
      <div className="bg-surface border border-border rounded-xl p-5 lg:col-span-2">
        <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t("price")} (AED) — Avg: {formatPrice(analytics.avgPrice)}
        </h3>
        <div className="flex items-end gap-4 h-32">
          {analytics.priceRanges.map((range) => (
            <div key={range.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-muted">{range.count}</span>
              <div className="w-full bg-background rounded-t-lg overflow-hidden flex-1 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-500"
                  style={{ height: `${(range.count / maxPriceCount) * 100}%`, minHeight: range.count > 0 ? "8px" : "0" }}
                />
              </div>
              <span className="text-xs text-muted">{range.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
