"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

interface Notification {
  type: "warning" | "info";
  message: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const t = useTranslations("admin");

  useEffect(() => {
    async function checkNotifications() {
      const supabase = createClient();
      const alerts: Notification[] = [];

      // Check expiring coupons (within 7 days)
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const { data: expiringCoupons } = await supabase
        .from("coupons")
        .select("code, expires_at")
        .eq("is_active", true)
        .not("expires_at", "is", null)
        .lt("expires_at", weekFromNow.toISOString())
        .gt("expires_at", new Date().toISOString());

      if (expiringCoupons && expiringCoupons.length > 0) {
        expiringCoupons.forEach((coupon) => {
          const days = Math.ceil((new Date(coupon.expires_at!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          alerts.push({
            type: "warning",
            message: `${t("expiringCoupons")}: ${coupon.code} (${days} ${days === 1 ? "day" : "days"})`,
          });
        });
      }

      // Check low stock products (stock <= 3)
      const { data: lowStockProducts } = await supabase
        .from("products")
        .select("name_ar, stock")
        .not("stock", "is", null)
        .lte("stock", 3);

      if (lowStockProducts && lowStockProducts.length > 0) {
        lowStockProducts.forEach((p) => {
          alerts.push({
            type: p.stock <= 0 ? "warning" : "info",
            message: `${t("lowStock")}: ${p.name_ar} (${p.stock <= 0 ? t("outOfStock") : p.stock})`,
          });
        });
      }

      setNotifications(alerts);
    }
    checkNotifications();
  }, [t]);

  if (notifications.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {notifications.map((n, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            n.type === "warning"
              ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-300"
              : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-300"
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.27 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm">{n.message}</span>
        </div>
      ))}
    </div>
  );
}
