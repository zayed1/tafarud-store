"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/utils";

interface PDFExportProps {
  products: Product[];
}

export default function PDFExport({ products }: PDFExportProps) {
  const [exporting, setExporting] = useState(false);
  const t = useTranslations("admin");
  const toast = useToast();

  const handleExport = useCallback(() => {
    setExporting(true);

    try {
      const rows = products.map((p, i) => {
        const name = p.name_ar || p.name_en;
        const category = p.category ? (p.category.name_ar || p.category.name_en) : "-";
        const featured = p.featured ? "★" : "";
        const date = p.created_at ? new Date(p.created_at).toLocaleDateString("ar-AE") : "-";
        return `
          <tr style="${i % 2 === 0 ? "background:#f8fafa;" : ""}">
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px;color:#666;">${i + 1}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;">${name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#047857;font-weight:600;">${formatPrice(p.price)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">${category}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;color:#f59e0b;">${featured}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#999;">${date}</td>
          </tr>`;
      }).join("");

      const totalPrice = products.reduce((s, p) => s + (p.price || 0), 0);
      const avgPrice = products.length > 0 ? totalPrice / products.length : 0;

      const html = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>منتجات متجر التفرّد</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #1a2e2a; margin: 0; padding: 0; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #047857;">
            <h1 style="font-size:24px;color:#047857;margin:0 0 5px;">متجر التفرّد</h1>
            <p style="font-size:14px;color:#666;margin:0;">قائمة المنتجات — ${new Date().toLocaleDateString("ar-AE")}</p>
          </div>

          <div style="display:flex;gap:20px;margin-bottom:25px;">
            <div style="flex:1;background:#f0faf8;padding:15px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#047857;">${products.length}</div>
              <div style="font-size:12px;color:#666;margin-top:4px;">${t("totalProducts")}</div>
            </div>
            <div style="flex:1;background:#f0faf8;padding:15px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#047857;">${formatPrice(totalPrice)}</div>
              <div style="font-size:12px;color:#666;margin-top:4px;">${t("totalRevenue")}</div>
            </div>
            <div style="flex:1;background:#f0faf8;padding:15px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#047857;">${formatPrice(avgPrice)}</div>
              <div style="font-size:12px;color:#666;margin-top:4px;">${t("avgPrice")}</div>
            </div>
          </div>

          <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;">
            <thead>
              <tr style="background:#047857;color:white;">
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:center;">#</th>
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:start;">${t("nameAr")}</th>
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:start;">${t("price")}</th>
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:start;">${t("category")}</th>
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:center;">${t("featured")}</th>
                <th style="padding:10px 12px;font-size:13px;font-weight:600;text-align:start;">التاريخ</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:30px;text-align:center;color:#999;font-size:11px;border-top:1px solid #e5e7eb;padding-top:15px;">
            متجر التفرّد — Tafarud Store — ${new Date().toISOString().split("T")[0]}
          </div>
        </body>
        </html>`;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast.showToast(t("exportPDFSuccess"), "success");
    } catch {
      toast.showToast(t("backupError"), "error");
    } finally {
      setExporting(false);
    }
  }, [products, t, toast]);

  return (
    <Button variant="ghost" onClick={handleExport} disabled={exporting}>
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        {exporting ? "..." : t("exportPDF")}
      </span>
    </Button>
  );
}
