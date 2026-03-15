"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function BackupRestore() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const t = useTranslations("admin");
  const toast = useToast();

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const supabase = createClient();
      const [
        { data: products },
        { data: categories },
        { data: purchaseLinks },
        { data: banners },
        { data: settings },
      ] = await Promise.all([
        supabase.from("products").select("*").order("created_at"),
        supabase.from("categories").select("*").order("created_at"),
        supabase.from("purchase_links").select("*").order("sort_order"),
        supabase.from("banners").select("*").order("sort_order"),
        supabase.from("store_settings").select("*"),
      ]);

      const backup = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        data: {
          categories: categories || [],
          products: products || [],
          purchase_links: purchaseLinks || [],
          banners: banners || [],
          store_settings: settings || [],
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tafarud-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.showToast(t("backupSuccess"), "success");
    } catch {
      toast.showToast(t("backupError"), "error");
    } finally {
      setExporting(false);
    }
  }, [t, toast]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.version || !backup.data) {
        toast.showToast(t("invalidBackup"), "error");
        setImporting(false);
        return;
      }

      const supabase = createClient();
      const { data: { categories, products, purchase_links, banners } } = backup;

      // Import categories first (products depend on them)
      if (categories?.length > 0) {
        for (const cat of categories) {
          await supabase.from("categories").upsert(cat, { onConflict: "id" });
        }
      }

      // Import products
      if (products?.length > 0) {
        for (const prod of products) {
          await supabase.from("products").upsert(prod, { onConflict: "id" });
        }
      }

      // Import purchase links
      if (purchase_links?.length > 0) {
        for (const link of purchase_links) {
          await supabase.from("purchase_links").upsert(link, { onConflict: "id" });
        }
      }

      // Import banners
      if (banners?.length > 0) {
        for (const banner of banners) {
          await supabase.from("banners").upsert(banner, { onConflict: "id" });
        }
      }

      toast.showToast(t("restoreSuccess"), "success");
    } catch {
      toast.showToast(t("restoreError"), "error");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }, [t, toast]);

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="font-semibold text-dark mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        {t("backup")}
      </h3>
      <p className="text-sm text-muted mb-4">{t("backupDesc")}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleExport} disabled={exporting}>
          {exporting ? "..." : t("exportBackup")}
        </Button>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            disabled={importing}
          />
          <span className="inline-flex items-center px-4 py-2.5 bg-background border border-border rounded-lg text-dark font-medium text-sm hover:bg-border/30 transition-colors">
            {importing ? "..." : t("importBackup")}
          </span>
        </label>
      </div>
    </div>
  );
}
