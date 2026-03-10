"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface SortableProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function SortableProductList({ products, onDelete }: SortableProductListProps) {
  const [items, setItems] = useState(products);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const dragItem = useRef<number | null>(null);

  const locale = useLocale();
  const t = useTranslations("admin");
  const toast = useToast();

  function handleDragStart(index: number) {
    dragItem.current = index;
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    setOverIndex(index);

    const newItems = [...items];
    const dragged = newItems[dragItem.current];
    newItems.splice(dragItem.current, 1);
    newItems.splice(index, 0, dragged);
    dragItem.current = index;
    setItems(newItems);
    setHasChanges(true);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
    dragItem.current = null;
  }

  async function saveOrder() {
    setSaving(true);
    const supabase = createClient();

    const updates = items.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    let hasError = false;
    for (const update of updates) {
      const { error } = await supabase
        .from("products")
        .update({ sort_order: update.sort_order })
        .eq("id", update.id);
      if (error) {
        hasError = true;
        break;
      }
    }

    setSaving(false);
    if (hasError) {
      toast.showToast("sort_order column missing — add it in Supabase", "error");
    } else {
      setHasChanges(false);
      toast.showToast(t("orderSaved"), "success");
    }
  }

  return (
    <div>
      {hasChanges && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-primary font-medium flex-1">{t("dragToReorder")}</p>
          <Button size="sm" onClick={saveOrder} disabled={saving}>
            {saving ? "..." : t("save")}
          </Button>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted w-10"></th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("image")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("nameAr")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("price")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("category")}</th>
                <th className="px-4 py-3 text-start text-sm font-medium text-muted">{t("featured")}</th>
                <th className="px-4 py-3 text-end text-sm font-medium text-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((product, index) => (
                <tr
                  key={product.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`hover:bg-background/50 transition-colors ${
                    dragIndex === index ? "opacity-50" : ""
                  } ${overIndex === index ? "border-t-2 border-t-primary" : ""}`}
                >
                  <td className="px-4 py-3 cursor-grab active:cursor-grabbing">
                    <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </td>
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
                        onClick={() => onDelete(product.id)}
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
        {items.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>{t("products")} - 0</p>
          </div>
        )}
      </div>
    </div>
  );
}
