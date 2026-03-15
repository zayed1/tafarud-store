"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { ActivityLog } from "@/types";

const actionIcons: Record<string, { icon: string; color: string }> = {
  added: { icon: "M12 4v16m8-8H4", color: "text-green-500 bg-green-500/10" },
  updated: { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "text-blue-500 bg-blue-500/10" },
  deleted: { icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", color: "text-red-500 bg-red-500/10" },
};

export default function ActivityLogPage() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setLogs(data || []);
        setLoading(false);
      });
  }, []);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return locale === "ar" ? "الآن" : "Just now";
    if (minutes < 60) return locale === "ar" ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    if (hours < 24) return locale === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`;
    if (days < 7) return locale === "ar" ? `منذ ${days} يوم` : `${days}d ago`;
    return date.toLocaleDateString(locale === "ar" ? "ar" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getActionLabel(action: string) {
    switch (action) {
      case "added": return locale === "ar" ? "أضاف" : "Added";
      case "updated": return locale === "ar" ? "عدّل" : "Updated";
      case "deleted": return locale === "ar" ? "حذف" : "Deleted";
      default: return action;
    }
  }

  function getEntityLabel(type: string) {
    switch (type) {
      case "product": return locale === "ar" ? "منتج" : "product";
      case "category": return locale === "ar" ? "تصنيف" : "category";
      case "banner": return locale === "ar" ? "بانر" : "banner";
      case "settings": return locale === "ar" ? "إعدادات" : "settings";
      default: return type;
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-border/50 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border/50 rounded w-2/3" />
              <div className="h-3 bg-border/30 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">{t("activityLog")}</h1>

      {logs.length > 0 ? (
        <div className="space-y-2">
          {logs.map((log) => {
            const { icon, color } = actionIcons[log.action] || actionIcons.updated;
            return (
              <div
                key={log.id}
                className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-primary/10 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark">
                    <span className="font-medium">{getActionLabel(log.action)}</span>
                    {" "}
                    <span className="text-muted">{getEntityLabel(log.entity_type)}:</span>
                    {" "}
                    <span className="font-medium">{log.entity_name}</span>
                  </p>
                </div>
                <span className="text-xs text-muted flex-shrink-0">{formatDate(log.created_at)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <div className="w-16 h-16 mx-auto mb-4 bg-border/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>{t("noActivity")}</p>
        </div>
      )}
    </div>
  );
}
