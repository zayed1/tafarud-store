"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Author, Category, PurchaseLink } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import PurchaseLinkEditor from "@/components/admin/PurchaseLinkEditor";
import ProductPreview from "@/components/admin/ProductPreview";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { useToast } from "@/components/ui/Toast";
import { compressImage } from "@/lib/compressImage";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorId, setAuthorId] = useState("");
  const [purchaseLinks, setPurchaseLinks] = useState<Partial<PurchaseLink>[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin");
  const toast = useToast();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      const [{ data: product }, { data: links }, { data: cats }, { data: auths }] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("purchase_links").select("*").eq("product_id", id).order("sort_order"),
        supabase.from("categories").select("*").order("name_ar"),
        supabase.from("authors").select("*").order("name_ar"),
      ]);

      if (product) {
        setNameAr(product.name_ar || "");
        setNameEn(product.name_en || "");
        setDescAr(product.description_ar || "");
        setDescEn(product.description_en || "");
        setPrice(product.price?.toString() || "");
        setCategoryId(product.category_id || "");
        setFeatured(product.featured || false);
        setStock(product.stock !== null && product.stock !== undefined ? product.stock.toString() : "");
        setCurrentImageUrl(product.image_url);
        setGalleryUrls(product.gallery_urls || []);
        setAuthorId(product.author_id || "");
      }

      setPurchaseLinks(links || []);
      setCategories(cats || []);
      setAuthors(auths || []);
      setLoading(false);
    }
    loadData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    let imageUrl = currentImageUrl;

    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const fileName = `${Date.now()}-${compressed.name}`;
      const { data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressed);

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }

    // Upload new gallery images (with compression)
    const uploadedGalleryUrls = [...galleryUrls];
    for (const file of galleryFiles) {
      const compressedGallery = await compressImage(file);
      const fileName = `gallery/${Date.now()}-${compressedGallery.name}`;
      const { data: uploadData } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressedGallery);
      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(uploadData.path);
        uploadedGalleryUrls.push(urlData.publicUrl);
      }
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name_ar: nameAr,
        name_en: nameEn,
        description_ar: descAr,
        description_en: descEn,
        price: parseFloat(price) || 0,
        category_id: categoryId || null,
        author_id: authorId || null,
        featured,
        stock: stock !== "" ? parseInt(stock) : null,
        image_url: imageUrl,
        gallery_urls: uploadedGalleryUrls.length > 0 ? uploadedGalleryUrls : null,
      })
      .eq("id", id);

    if (updateError) {
      toast.showToast(t("saveError"), "error");
      setSaving(false);
      return;
    }

    // Update purchase links: delete existing and re-insert
    await supabase.from("purchase_links").delete().eq("product_id", id);

    if (purchaseLinks.length > 0) {
      const linksToInsert = purchaseLinks.map((link) => ({
        product_id: id,
        platform_name: link.platform_name || "",
        url: link.url || "",
        country_code: link.country_code || "AE",
        is_enabled: link.is_enabled !== false,
        sort_order: link.sort_order || 0,
      }));
      await supabase.from("purchase_links").insert(linksToInsert);
    }

    toast.showToast(t("productSaved"), "success");
    setTimeout(() => router.push(`/${locale}/admin/products`), 1500);
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">{t("editProduct")}</h1>
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
          <label className="block text-sm font-medium text-dark">{t("author")}</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("selectAuthor")}</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name_ar}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-dark">
            {t("image")}
          </label>
          {currentImageUrl && (
            <p className="text-sm text-muted mb-2" dir="ltr">
              {t("image")}: {currentImageUrl.split("/").pop()}
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark file:me-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
          />
        </div>

        <MultiImageUpload
          existingUrls={galleryUrls}
          onChangeUrls={setGalleryUrls}
          onChangeFiles={setGalleryFiles}
          pendingFiles={galleryFiles}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("stock")}
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            dir="ltr"
            placeholder={t("stockUnlimited")}
          />
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-medium text-dark">{t("featured")}</span>
            </label>
          </div>
        </div>

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
          imageUrl: imageFile ? URL.createObjectURL(imageFile) : currentImageUrl,
          featured,
          purchaseLinks,
        }}
      />
    </div>
  );
}
