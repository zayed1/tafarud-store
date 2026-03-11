"use client";

import { useTranslations } from "next-intl";
import { Product } from "@/types";

interface ExportCSVButtonProps {
  products: Product[];
}

export default function ExportCSVButton({ products }: ExportCSVButtonProps) {
  const t = useTranslations("common");

  function handleExport() {
    const headers = ["ID", "Name (AR)", "Name (EN)", "Price (AED)", "Category", "Featured", "Created At"];
    const rows = products.map((p) => [
      p.id,
      `"${p.name_ar.replace(/"/g, '""')}"`,
      `"${p.name_en.replace(/"/g, '""')}"`,
      p.price.toString(),
      `"${p.category?.name_ar || ""}"`,
      p.featured ? "Yes" : "No",
      p.created_at,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tafarud-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-dark hover:border-primary/30 hover:text-primary transition-all cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {t("exportCSV")}
    </button>
  );
}
