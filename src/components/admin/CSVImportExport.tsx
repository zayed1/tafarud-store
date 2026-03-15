"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/types";

interface CSVImportExportProps {
  products: Product[];
  onImportComplete?: () => void;
}

export default function CSVImportExport({ products, onImportComplete }: CSVImportExportProps) {
  const t = useTranslations("admin");
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  function exportCSV() {
    const headers = ["name_ar", "name_en", "description_ar", "description_en", "price", "featured", "category_id"];
    const rows = products.map((p) =>
      [
        `"${(p.name_ar || "").replace(/"/g, '""')}"`,
        `"${(p.name_en || "").replace(/"/g, '""')}"`,
        `"${(p.description_ar || "").replace(/"/g, '""')}"`,
        `"${(p.description_en || "").replace(/"/g, '""')}"`,
        p.price,
        p.featured,
        p.category_id || "",
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadTemplate() {
    const headers = "name_ar,name_en,description_ar,description_en,price,featured,category_id";
    const example = '"اسم المنتج","Product Name","وصف المنتج","Product Description",99.99,false,""';
    const csv = [headers, example].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        showToast("CSV file is empty", "error");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const rows = lines.slice(1).map((line) => {
        const values: string[] = [];
        let current = "";
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        const obj: Record<string, string | number | boolean> = {};
        headers.forEach((h, i) => {
          let val = values[i] || "";
          val = val.replace(/^"|"$/g, "");
          if (h === "price") obj[h] = parseFloat(val) || 0;
          else if (h === "featured") obj[h] = val === "true";
          else obj[h] = val;
        });
        return obj;
      });

      const supabase = createClient();
      const validRows = rows.filter((r) => r.name_ar || r.name_en);

      if (validRows.length === 0) {
        showToast("No valid products found", "error");
        return;
      }

      const { error } = await supabase.from("products").insert(
        validRows.map((r) => ({
          name_ar: r.name_ar as string,
          name_en: r.name_en as string,
          description_ar: (r.description_ar as string) || "",
          description_en: (r.description_en as string) || "",
          price: r.price as number,
          featured: r.featured as boolean,
          category_id: (r.category_id as string) || null,
        }))
      );

      if (error) {
        showToast(t("saveError"), "error");
      } else {
        showToast(`${t("importSuccess")} (${validRows.length})`, "success");
        await supabase.from("activity_logs").insert({
          action: "added",
          entity_type: "product",
          entity_name: `CSV import (${validRows.length} products)`,
        });
        onImportComplete?.();
      }
    } catch {
      showToast(t("saveError"), "error");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={downloadTemplate}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted hover:text-dark border border-border rounded-lg hover:bg-background transition-colors cursor-pointer"
        title={t("downloadTemplate")}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {t("downloadTemplate")}
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={importing}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {importing ? "..." : t("importCSV")}
      </button>
      <button
        onClick={exportCSV}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted hover:text-dark border border-border rounded-lg hover:bg-background transition-colors cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        CSV
      </button>
    </div>
  );
}
