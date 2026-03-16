"use client";

import { useEffect, useState, useOptimistic, useCallback } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import Button from "@/components/ui/Button";
import SortableProductList from "@/components/admin/SortableProductList";
import CSVImportExport from "@/components/admin/CSVImportExport";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("admin");

  const [optimisticProducts, removeOptimistic] = useOptimistic(
    products,
    (state, deletedId: string) => state.filter((p) => p.id !== deletedId)
  );

  const loadProducts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    // Optimistic removal
    removeOptimistic(id);

    try {
      const supabase = createClient();
      await supabase.from("purchase_links").delete().eq("product_id", id);
      await supabase.from("products").delete().eq("id", id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // Revert on failure by reloading
      loadProducts();
    }
  }, [t, removeOptimistic, loadProducts]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div className="h-9 w-32 bg-border/40 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-border/40 rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl animate-pulse">
            <div className="w-10 h-14 bg-border/40 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-border/40 rounded w-2/3" />
              <div className="h-3 bg-border/40 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("products")}</h1>
        <div className="flex items-center gap-3">
          <CSVImportExport products={products} onImportComplete={loadProducts} />
          <Link href={`/${locale}/admin/products/new`}>
            <Button>+ {t("addProduct")}</Button>
          </Link>
        </div>
      </div>

      <SortableProductList products={optimisticProducts} onDelete={deleteProduct} />
    </div>
  );
}
