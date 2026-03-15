"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { getLocalizedField } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import type { Banner } from "@/types";

export default function BannersPage() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    subtitle_ar: "",
    subtitle_en: "",
    link: "",
    image_url: "",
    is_active: true,
    sort_order: 0,
  });

  const supabase = createClient();

  const loadBanners = useCallback(async () => {
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    setBanners(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBanners();
  }, [loadBanners]);

  function openForm(banner?: Banner) {
    if (banner) {
      setEditing(banner);
      setForm({
        title_ar: banner.title_ar,
        title_en: banner.title_en,
        subtitle_ar: banner.subtitle_ar,
        subtitle_en: banner.subtitle_en,
        link: banner.link,
        image_url: banner.image_url || "",
        is_active: banner.is_active,
        sort_order: banner.sort_order,
      });
    } else {
      setEditing(null);
      setForm({
        title_ar: "",
        title_en: "",
        subtitle_ar: "",
        subtitle_en: "",
        link: "",
        image_url: "",
        is_active: true,
        sort_order: banners.length,
      });
    }
    setShowForm(true);
  }

  async function handleSave() {
    const payload = { ...form };
    if (editing) {
      await supabase.from("banners").update(payload).eq("id", editing.id);
      await logActivity("updated", "banner", form.title_ar || form.title_en);
    } else {
      await supabase.from("banners").insert(payload);
      await logActivity("added", "banner", form.title_ar || form.title_en);
    }
    showToast(t("bannerSaved"), "success");
    setShowForm(false);
    loadBanners();
  }

  async function handleDelete(banner: Banner) {
    if (!confirm(t("confirmDelete"))) return;
    await supabase.from("banners").delete().eq("id", banner.id);
    await logActivity("deleted", "banner", banner.title_ar || banner.title_en);
    loadBanners();
  }

  async function logActivity(action: string, entityType: string, entityName: string) {
    await supabase.from("activity_logs").insert({ action, entity_type: entityType, entity_name: entityName });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) return;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
            <div className="h-6 bg-border/50 rounded w-1/3 mb-2" />
            <div className="h-4 bg-border/30 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("banners")}</h1>
        <button
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("addBanner")}
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 hover:border-primary/20 transition-all"
          >
            <div className="w-16 h-10 relative bg-background rounded-lg overflow-hidden flex-shrink-0">
              {banner.image_url ? (
                <Image src={banner.image_url} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                  <svg className="w-5 h-5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark truncate">
                {getLocalizedField(banner, "title", locale) || "(No title)"}
              </p>
              <p className="text-sm text-muted truncate">
                {getLocalizedField(banner, "subtitle", locale)}
              </p>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${banner.is_active ? "bg-green-500/10 text-green-600" : "bg-border/50 text-muted"}`}>
              {banner.is_active ? "Active" : "Inactive"}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openForm(banner)}
                className="p-2 rounded-lg hover:bg-primary/5 text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(banner)}
                className="p-2 rounded-lg hover:bg-red-500/5 text-muted hover:text-red-500 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>{t("noActivity")}</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-dark mb-6">
              {editing ? t("editBanner") : t("addBanner")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("bannerTitleAr")}</label>
                <input
                  type="text"
                  value={form.title_ar}
                  onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-dark focus:outline-none focus:border-primary"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("bannerTitleEn")}</label>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-dark focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("bannerSubtitleAr")}</label>
                <input
                  type="text"
                  value={form.subtitle_ar}
                  onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-dark focus:outline-none focus:border-primary"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("bannerSubtitleEn")}</label>
                <input
                  type="text"
                  value={form.subtitle_en}
                  onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-dark focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("bannerLink")}</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-dark focus:outline-none focus:border-primary"
                  placeholder="/ar/products"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">{t("image")}</label>
                {form.image_url && (
                  <div className="w-full h-32 relative bg-background rounded-xl overflow-hidden mb-2">
                    <Image src={form.image_url} alt="" fill className="object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-dark">{t("bannerActive")}</span>
              </label>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
              >
                {t("save")}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-border text-dark rounded-xl hover:bg-background transition-colors cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
