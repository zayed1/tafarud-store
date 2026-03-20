"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Author } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import Image from "next/image";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [bioAr, setBioAr] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const locale = useLocale();
  const t = useTranslations("admin");
  const toast = useToast();

  async function loadAuthors() {
    const supabase = createClient();
    const { data } = await supabase.from("authors").select("*").order("created_at", { ascending: false });
    setAuthors(data || []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAuthors();
  }, []);

  function resetForm() {
    setNameAr("");
    setNameEn("");
    setSlug("");
    setBioAr("");
    setBioEn("");
    setImageFile(null);
    setCurrentImageUrl(null);
    setSocialLinks([]);
    setEditingId(null);
    setShowForm(false);
  }

  function editAuthor(author: Author) {
    setEditingId(author.id);
    setNameAr(author.name_ar);
    setNameEn(author.name_en);
    setSlug(author.slug);
    setBioAr(author.bio_ar);
    setBioEn(author.bio_en);
    setCurrentImageUrl(author.image_url);
    setSocialLinks(author.social_links || []);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    let imageUrl = currentImageUrl;
    if (imageFile) {
      const fileName = `authors/${Date.now()}-${imageFile.name}`;
      const { data: uploadData } = await supabase.storage.from("product-images").upload(fileName, imageFile);
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }

    const authorData = {
      name_ar: nameAr,
      name_en: nameEn,
      slug: slug || slugify(nameEn || nameAr),
      bio_ar: bioAr,
      bio_en: bioEn,
      image_url: imageUrl,
      social_links: socialLinks.length > 0 ? socialLinks : null,
    };

    if (editingId) {
      await supabase.from("authors").update(authorData).eq("id", editingId);
    } else {
      await supabase.from("authors").insert(authorData);
    }

    toast.showToast(t("authorSaved"), "success");
    resetForm();
    setSaving(false);
    loadAuthors();
  }

  async function deleteAuthor(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("authors").delete().eq("id", id);
    toast.showToast(t("authorDeleted"), "success");
    loadAuthors();
  }

  if (loading) return <div className="text-center py-12 text-muted">...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("authors")}</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>{t("addAuthor")}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mb-12 p-6 bg-surface rounded-2xl border border-border">
          <h2 className="text-xl font-bold text-dark">{editingId ? t("editAuthor") : t("addAuthor")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t("nameAr")} value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
            <Input label={t("nameEn")} value={nameEn} onChange={(e) => setNameEn(e.target.value)} dir="ltr" />
          </div>
          <Input
            label={t("slug")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            dir="ltr"
            placeholder={slugify(nameEn || nameAr) || "author-slug"}
          />
          <Textarea label={t("bioAr")} value={bioAr} onChange={(e) => setBioAr(e.target.value)} />
          <Textarea label={t("bioEn")} value={bioEn} onChange={(e) => setBioEn(e.target.value)} dir="ltr" />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark">{t("image")}</label>
            {currentImageUrl && (
              <div className="w-20 h-20 relative rounded-full overflow-hidden mb-2">
                <Image src={currentImageUrl} alt="" fill className="object-cover" sizes="80px" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark file:me-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-dark">{t("socialLinks")}</label>
            {socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={link.platform}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...updated[i], platform: e.target.value };
                    setSocialLinks(updated);
                  }}
                  placeholder={t("platform")}
                  dir="ltr"
                />
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...updated[i], url: e.target.value };
                    setSocialLinks(updated);
                  }}
                  placeholder={t("url")}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))}
                  className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" onClick={() => setSocialLinks([...socialLinks, { platform: "", url: "" }])}>
              {t("addSocialLink")}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>{saving ? "..." : t("save")}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>{t("cancel")}</Button>
          </div>
        </form>
      )}

      {authors.length === 0 ? (
        <p className="text-muted text-center py-12">{t("noAuthors")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map((author) => (
            <div key={author.id} className="bg-surface rounded-2xl border border-border p-4 flex items-start gap-4">
              {author.image_url ? (
                <div className="w-16 h-16 relative rounded-full overflow-hidden flex-shrink-0">
                  <Image src={author.image_url} alt={author.name_ar} fill className="object-cover" sizes="64px" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark">{locale === "ar" ? author.name_ar : author.name_en || author.name_ar}</h3>
                <p className="text-sm text-muted line-clamp-2 mt-1">
                  {locale === "ar" ? author.bio_ar : author.bio_en || author.bio_ar}
                </p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => editAuthor(author)} className="text-primary text-sm hover:underline cursor-pointer">{t("edit")}</button>
                  <button onClick={() => deleteAuthor(author.id)} className="text-red-500 text-sm hover:underline cursor-pointer">{t("delete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
