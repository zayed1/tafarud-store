"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Category, PurchaseLink } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import PurchaseLinkEditor from "@/components/admin/PurchaseLinkEditor";
import ProductPreview from "@/components/admin/ProductPreview";

export default function NewProductPage() {
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [purchaseLinks, setPurchaseLinks] = useState<Partial<PurchaseLink>[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin");

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*").order("name_ar");
      setCategories(data || []);
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    let imageUrl = null;

    // Upload image
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }

    // Create product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name_ar: nameAr,
        name_en: nameEn,
        description_ar: descAr,
        description_en: descEn,
        price: parseFloat(price) || 0,
        category_id: categoryId || null,
        featured,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error || !product) {
      setSaving(false);
      return;
    }

    // Create purchase links
    if (purchaseLinks.length > 0) {
      const linksToInsert = purchaseLinks.map((link) => ({
        product_id: product.id,
        platform_name: link.platform_name || "",
        url: link.url || "",
        country_code: link.country_code || "AE",
        is_enabled: link.is_enabled !== false,
        sort_order: link.sort_order || 0,
      }));
      await supabase.from("purchase_links").insert(linksToInsert);
    }

    router.push(`/${locale}/admin/products`);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">{t("addProduct")}</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("nameAr")}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            required
          />
          <Input
            label={t("nameEn")}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            dir="ltr"
          />
        </div>

        <Textarea
          label={t("descriptionAr")}
          value={descAr}
          onChange={(e) => setDescAr(e.target.value)}
        />
        <Textarea
          label={t("descriptionEn")}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
          dir="ltr"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("price")}
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            dir="ltr"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark">
              {t("category")}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_ar}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-dark">
            {t("image")}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark file:me-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-5 h-5 accent-primary"
          />
          <span className="font-medium text-dark">{t("featured")}</span>
        </label>

        <div className="border-t border-border pt-6">
          <PurchaseLinkEditor links={purchaseLinks} onChange={setPurchaseLinks} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "..." : t("save")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPreview(true)}
          >
            {t("preview")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/${locale}/admin/products`)}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>

      <ProductPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        product={{
          nameAr,
          nameEn,
          descAr,
          descEn,
          price,
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
          featured,
          purchaseLinks,
        }}
      />
    </div>
  );
}
