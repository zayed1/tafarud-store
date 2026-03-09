"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

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

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("image")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("nameAr")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("price")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("category")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("featured")}</th>
                <th className="px-4 py-3 text-end text-sm font-medium text-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background/50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-16 relative bg-background rounded overflow-hidden">
                      {product.image_url ? (
                        <Image src={product.image_url} alt="" fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-dark">
                    {getLocalizedField(product, "name", locale)}
                  </td>
                  <td className="px-4 py-3 text-primary font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.category
                      ? getLocalizedField(product.category, "name", locale)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">{t("edit")}</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>{t("products")} - 0</p>
          </div>
        )}
      </div>
    </div>
  );
}
