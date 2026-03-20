"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function escapeCSV(val: unknown): string {
  const str = val === null || val === undefined ? "" : String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExcelExport() {
  const [exporting, setExporting] = useState(false);
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
        { data: coupons },
        { data: settings },
      ] = await Promise.all([
        supabase.from("products").select("*, category:categories(name_ar, name_en)").order("created_at"),
        supabase.from("categories").select("*").order("created_at"),
        supabase.from("purchase_links").select("*").order("sort_order"),
        supabase.from("banners").select("*").order("sort_order"),
        supabase.from("coupons").select("*").order("created_at"),
        supabase.from("store_settings").select("*"),
      ]);

      const date = new Date().toISOString().split("T")[0];

      // Sheet 1: Products
      const productHeaders = [
        "ID", "الاسم (عربي)", "الاسم (إنجليزي)", "الوصف (عربي)", "الوصف (إنجليزي)",
        "السعر", "التصنيف (عربي)", "التصنيف (إنجليزي)", "مميز", "رابط الصورة", "تاريخ الإضافة"
      ];
      const productRows = (products || []).map((p) => [
        p.id,
        p.name_ar,
        p.name_en,
        p.description_ar,
        p.description_en,
        String(p.price || 0),
        p.category?.name_ar || "",
        p.category?.name_en || "",
        p.featured ? "نعم" : "لا",
        p.image_url || "",
        p.created_at || "",
      ]);

      // Sheet 2: Categories
      const categoryHeaders = ["ID", "الاسم (عربي)", "الاسم (إنجليزي)", "الرابط المختصر", "رابط الصورة", "تاريخ الإضافة"];
      const categoryRows = (categories || []).map((c) => [
        c.id, c.name_ar, c.name_en, c.slug, c.image_url || "", c.created_at || "",
      ]);

      // Sheet 3: Purchase Links
      const linkHeaders = ["ID", "معرّف المنتج", "المنصة", "الرابط", "رمز الدولة", "مفعّل", "الترتيب"];
      const linkRows = (purchaseLinks || []).map((l) => [
        l.id, l.product_id, l.platform_name, l.url, l.country_code, l.is_enabled ? "نعم" : "لا", String(l.sort_order),
      ]);

      // Sheet 4: Banners
      const bannerHeaders = ["ID", "العنوان (عربي)", "العنوان (إنجليزي)", "العنوان الفرعي (عربي)", "العنوان الفرعي (إنجليزي)", "الرابط", "مفعّل", "الترتيب"];
      const bannerRows = (banners || []).map((b) => [
        b.id, b.title_ar, b.title_en, b.subtitle_ar, b.subtitle_en, b.link, b.is_active ? "نعم" : "لا", String(b.sort_order),
      ]);

      // Sheet 5: Coupons
      const couponHeaders = ["ID", "الكود", "نوع الخصم", "القيمة", "الحد الأدنى", "الحد الأقصى للاستخدام", "عدد الاستخدام", "مفعّل", "تاريخ الانتهاء"];
      const couponRows = (coupons || []).map((c) => [
        c.id, c.code, c.discount_type === "percentage" ? "نسبة" : "مبلغ", String(c.discount_value),
        c.min_order_amount ? String(c.min_order_amount) : "", c.max_uses ? String(c.max_uses) : "",
        String(c.used_count || 0), c.is_active ? "نعم" : "لا", c.expires_at || "",
      ]);

      // Sheet 6: Settings
      const settingHeaders = ["المفتاح", "القيمة"];
      const settingRows = (settings || []).map((s) => [
        s.key || s.id, typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value || ""),
      ]);

      // Build multi-sheet CSV (separate files in a combined download approach)
      // Since true .xlsx requires a library, we'll create a multi-section CSV
      const sections = [
        { name: "=== المنتجات ===", headers: productHeaders, rows: productRows },
        { name: "=== التصنيفات ===", headers: categoryHeaders, rows: categoryRows },
        { name: "=== روابط الشراء ===", headers: linkHeaders, rows: linkRows },
        { name: "=== البانرات ===", headers: bannerHeaders, rows: bannerRows },
        { name: "=== الكوبونات ===", headers: couponHeaders, rows: couponRows },
        { name: "=== الإعدادات ===", headers: settingHeaders, rows: settingRows },
      ];

      const bom = "\uFEFF";
      let fullCSV = bom;
      for (const section of sections) {
        fullCSV += section.name + "\r\n";
        fullCSV += section.headers.map(escapeCSV).join(",") + "\r\n";
        for (const row of section.rows) {
          fullCSV += row.map(escapeCSV).join(",") + "\r\n";
        }
        fullCSV += "\r\n";
      }

      downloadFile(fullCSV, `tafarud-backup-${date}.csv`, "text/csv;charset=utf-8;");
      toast.showToast(t("excelExportSuccess"), "success");
    } catch {
      toast.showToast(t("backupError"), "error");
    } finally {
      setExporting(false);
    }
  }, [t, toast]);

  return (
    <Button variant="ghost" onClick={handleExport} disabled={exporting}>
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {exporting ? "..." : t("excelExport")}
      </span>
    </Button>
  );
}
