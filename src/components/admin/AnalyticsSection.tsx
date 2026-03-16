"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Image from "next/image";

interface AnalyticsSectionProps {
  products: Product[];
}

export default function AnalyticsSection({ products }: AnalyticsSectionProps) {
  const t = useTranslations("common");
  const tAdmin = useTranslations("admin");
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

    // Category distribution with revenue
    const categoryMap = new Map<string, { name: string; count: number; revenue: number }>();
    products.forEach((p) => {
      if (p.category) {
        const key = p.category_id || "unknown";
        const existing = categoryMap.get(key);
        if (existing) {
          existing.count++;
          existing.revenue += p.price;
        } else {
          categoryMap.set(key, {
            name: getLocalizedField(p.category, "name", locale),
            count: 1,
            revenue: p.price,
          });
        }
      }
    });
    const categoryDist = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

    // Average price
    const avgPrice = products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

    // Total revenue
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

    // Top 5 most expensive products
    const topProducts = [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);

    // Most expensive
    const mostExpensive = topProducts[0] || null;

    // Products added per month (last 6 months)
    const monthlyData: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = products.filter((p) => {
        const created = new Date(p.created_at);
        return created >= d && created < nextMonth;
      }).length;
      monthlyData.push({
        label: d.toLocaleString(locale === "ar" ? "ar" : "en", { month: "short" }),
        count,
      });
    }

    // Price trend data
    const priceTrend = [...products]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((p) => ({
        name: getLocalizedField(p, "name", locale),
        price: p.price,
        date: new Date(p.created_at),
      }));

    return {
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      priceRanges,
      categoryDist,
      avgPrice,
      totalRevenue,
      topProducts,
      mostExpensive,
      monthlyData,
      priceTrend,
    };
  }, [products, locale]);

  const maxCategoryCount = Math.max(...analytics.categoryDist.map((c) => c.count), 1);
  const maxMonthlyCount = Math.max(...analytics.monthlyData.map((m) => m.count), 1);

  // SVG Price Trend chart calculations
  const chartWidth = 400;
  const chartHeight = 180;
  const chartPadding = { top: 10, right: 10, bottom: 10, left: 10 };
  const trendPoints = analytics.priceTrend;
  const minPrice = trendPoints.length > 0 ? Math.min(...trendPoints.map((p) => p.price)) * 0.9 : 0;
  const maxPrice = trendPoints.length > 0 ? Math.max(...trendPoints.map((p) => p.price)) * 1.1 : 100;
  const priceRange = Math.max(maxPrice - minPrice, 1);
  const trendLine = trendPoints.map((p, i) => {
    const x = chartPadding.left + (i / Math.max(trendPoints.length - 1, 1)) * (chartWidth - chartPadding.left - chartPadding.right);
    const y = chartPadding.top + (1 - (p.price - minPrice) / priceRange) * (chartHeight - chartPadding.top - chartPadding.bottom);
    return { x, y, ...p };
  });
  const trendLinePath = trendLine.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = trendLinePath + (trendLine.length > 0
    ? ` L${trendLine[trendLine.length - 1].x},${chartHeight - chartPadding.bottom} L${trendLine[0].x},${chartHeight - chartPadding.bottom} Z`
    : "");

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">{tAdmin("totalRevenue")}</p>
          <p className="text-xl font-bold text-primary">{formatPrice(analytics.totalRevenue)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">{tAdmin("avgPrice")}</p>
          <p className="text-xl font-bold text-dark">{formatPrice(analytics.avgPrice)}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">{tAdmin("thisWeek")}</p>
          <p className="text-xl font-bold text-green-600">+{analytics.thisWeek}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <p className="text-xs text-muted mb-1">{tAdmin("thisMonth")}</p>
          <p className="text-xl font-bold text-accent">+{analytics.thisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {t("topProducts")}
          </h3>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-5 text-center ${index === 0 ? "text-amber-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : "text-muted"}`}>
                  {index + 1}
                </span>
                <div className="w-8 h-10 relative bg-background rounded overflow-hidden flex-shrink-0 border border-border">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={getLocalizedField(product, "name", locale)}
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  ) : (
                    <div className="w-full h-full bg-border/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">
                    {getLocalizedField(product, "name", locale)}
                  </p>
                </div>
                <p className="text-sm text-primary font-semibold flex-shrink-0">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category distribution with pie chart + revenue */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            {t("categoryPerformance")}
          </h3>
          {analytics.categoryDist.length > 0 ? (
            <div className="space-y-4">
              {/* SVG Pie Chart */}
              <div className="flex justify-center">
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  {(() => {
                    const total = analytics.categoryDist.reduce((s, c) => s + c.count, 0);
                    const colors = ["var(--color-primary, #0d9488)", "var(--color-accent, #f59e0b)", "var(--color-secondary, #6366f1)", "#ec4899", "#10b981", "#8b5cf6"];
                    let startAngle = 0;
                    return analytics.categoryDist.map((cat, i) => {
                      const angle = (cat.count / Math.max(total, 1)) * 360;
                      const endAngle = startAngle + angle;
                      const largeArc = angle > 180 ? 1 : 0;
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      const x1 = 60 + 50 * Math.cos(startRad);
                      const y1 = 60 + 50 * Math.sin(startRad);
                      const x2 = 60 + 50 * Math.cos(endRad);
                      const y2 = 60 + 50 * Math.sin(endRad);
                      const d = total === cat.count
                        ? `M 60,10 A 50,50 0 1,1 59.99,10 Z`
                        : `M 60,60 L ${x1},${y1} A 50,50 0 ${largeArc},1 ${x2},${y2} Z`;
                      startAngle = endAngle;
                      return <path key={i} d={d} fill={colors[i % colors.length]} opacity={0.85} />;
                    });
                  })()}
                </svg>
              </div>
              {/* Legend + bars */}
              <div className="space-y-3">
                {analytics.categoryDist.map((cat, i) => {
                  const colors = ["bg-primary", "bg-accent", "bg-secondary", "bg-pink-500", "bg-emerald-500", "bg-violet-500"];
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-dark flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`} />
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted">{cat.count}</span>
                          <span className="text-xs text-primary font-medium">{formatPrice(cat.revenue)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">{t("noData")}</p>
          )}
        </div>

        {/* Products Added Over Time (SVG bar chart) */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t("productsOverTime")}
          </h3>
          <svg viewBox="0 0 300 140" className="w-full" preserveAspectRatio="xMidYMid meet">
            {analytics.monthlyData.map((month, i) => {
              const barWidth = 30;
              const gap = (300 - analytics.monthlyData.length * barWidth) / (analytics.monthlyData.length + 1);
              const x = gap + i * (barWidth + gap);
              const barHeight = maxMonthlyCount > 0 ? (month.count / maxMonthlyCount) * 100 : 0;
              const y = 110 - barHeight;
              return (
                <g key={i}>
                  <motion.rect
                    x={x}
                    y={y}
                    width={barWidth}
                    rx={4}
                    fill="url(#barGradient)"
                    initial={{ height: 0, y: 110 }}
                    animate={{ height: Math.max(barHeight, month.count > 0 ? 4 : 0), y }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                  <text x={x + barWidth / 2} y={125} textAnchor="middle" className="fill-muted" fontSize="9">
                    {month.label}
                  </text>
                  {month.count > 0 && (
                    <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" className="fill-current text-dark" fontSize="9" fontWeight="600">
                      {month.count}
                    </text>
                  )}
                </g>
              );
            })}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #0d9488)" />
                <stop offset="100%" stopColor="var(--color-accent, #f59e0b)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Price Distribution */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tAdmin("priceDistribution")} (AED)
          </h3>
          <div className="flex items-end gap-4 h-32">
            {analytics.priceRanges.map((range) => {
              const maxPriceCount = Math.max(...analytics.priceRanges.map((r) => r.count), 1);
              return (
                <div key={range.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-dark">{range.count}</span>
                  <div className="w-full bg-background rounded-t-lg overflow-hidden flex-1 flex items-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${(range.count / maxPriceCount) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ minHeight: range.count > 0 ? "8px" : "0" }}
                    />
                  </div>
                  <span className="text-xs text-muted">{range.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Trend Line Chart */}
        {trendPoints.length > 1 && (
          <div className="bg-surface border border-border rounded-xl p-5 lg:col-span-2">
            <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {t("priceTrend")} — Avg: {formatPrice(analytics.avgPrice)}
            </h3>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary, #0d9488)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary, #0d9488)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <motion.path
                d={areaPath}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.path
                d={trendLinePath}
                fill="none"
                stroke="var(--color-primary, #0d9488)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />
              {trendLine.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="var(--color-primary, #0d9488)"
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
