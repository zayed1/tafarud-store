"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import Button from "@/components/ui/Button";
import SortableProductList from "@/components/admin/SortableProductList";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations("admin");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("purchase_links").delete().eq("product_id", id);
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">{t("dashboard")}...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("products")}</h1>
        <Link href={`/${locale}/admin/products/new`}>
          <Button>+ {t("addProduct")}</Button>
        </Link>
      </div>

      <SortableProductList products={products} onDelete={deleteProduct} />
    </div>
  );
}
