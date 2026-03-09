"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const t = useTranslations("admin");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    setCategories(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditingCategory(null);
    setNameAr("");
    setNameEn("");
    setSlug("");
    setImageFile(null);
    setShowModal(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setNameAr(category.name_ar);
    setNameEn(category.name_en);
    setSlug(category.slug);
    setImageFile(null);
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    let imageUrl = editingCategory?.image_url || null;

    if (imageFile) {
      const fileName = `categories/${Date.now()}-${imageFile.name}`;
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

    const categoryData = {
      name_ar: nameAr,
      name_en: nameEn,
      slug: slug || nameEn.toLowerCase().replace(/\s+/g, "-"),
      image_url: imageUrl,
    };

    if (editingCategory) {
      await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editingCategory.id);
    } else {
      await supabase.from("categories").insert(categoryData);
    }

    setSaving(false);
    setShowModal(false);
    loadCategories();
  }

  async function deleteCategory(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    setCategories(categories.filter((c) => c.id !== id));
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("categories")}</h1>
        <Button onClick={openAdd}>+ {t("addCategory")}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-dark">{category.name_ar}</h3>
              <p className="text-sm text-muted">{category.name_en}</p>
              <p className="text-xs text-muted mt-1" dir="ltr">
                /{category.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>
                {t("edit")}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteCategory(category.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-muted">
          <p>{t("categories")} - 0</p>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? t("editCategory") : t("addCategory")}
      >
        <form onSubmit={handleSave} className="space-y-4">
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
          <Input
            label={t("slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            dir="ltr"
            placeholder="category-slug"
          />
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
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "..." : t("save")}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
