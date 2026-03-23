"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

interface StoreSettings {
  id?: string;
  store_name_ar: string;
  store_name_en: string;
  whatsapp_number: string;
  email: string;
  instagram_url: string;
  twitter_url: string;
  facebook_url: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  store_name_ar: "متجر التفرّد",
  store_name_en: "Tafarud Store",
  whatsapp_number: "+971504677161",
  email: "",
  instagram_url: "",
  twitter_url: "",
  facebook_url: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [privacyAr, setPrivacyAr] = useState("");
  const [privacyEn, setPrivacyEn] = useState("");
  const [termsAr, setTermsAr] = useState("");
  const [termsEn, setTermsEn] = useState("");
  const [storeTheme, setStoreTheme] = useState("classic");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("admin");
  const toast = useToast();

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const [{ data }, { data: kvRows }] = await Promise.all([
        supabase.from("store_settings").select("*").limit(1).single(),
        supabase.from("store_settings").select("key, value").in("key", [
          "maintenance_mode", "privacy_ar", "privacy_en", "terms_ar", "terms_en", "store_theme"
        ]),
      ]);
      if (data) setSettings(data);

      const kv: Record<string, string> = {};
      (kvRows || []).forEach((r: { key: string; value: string }) => { kv[r.key] = r.value; });
      if (kv.maintenance_mode) setMaintenanceMode(kv.maintenance_mode === "true" || kv.maintenance_mode === true as unknown as string);
      if (kv.privacy_ar) setPrivacyAr(kv.privacy_ar as string);
      if (kv.privacy_en) setPrivacyEn(kv.privacy_en as string);
      if (kv.terms_ar) setTermsAr(kv.terms_ar as string);
      if (kv.terms_en) setTermsEn(kv.terms_en as string);
      if (kv.store_theme) setStoreTheme(kv.store_theme as string);

      setLoading(false);
    }
    loadSettings();
  }, []);

  async function upsertKV(supabase: ReturnType<typeof createClient>, key: string, value: unknown) {
    const { data: existing } = await supabase
      .from("store_settings")
      .select("id")
      .eq("key", key)
      .single();
    if (existing) {
      await supabase.from("store_settings").update({ value }).eq("key", key);
    } else {
      await supabase.from("store_settings").insert({ key, value });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();

    if (settings.id) {
      await supabase
        .from("store_settings")
        .update({
          store_name_ar: settings.store_name_ar,
          store_name_en: settings.store_name_en,
          whatsapp_number: settings.whatsapp_number,
          email: settings.email,
          instagram_url: settings.instagram_url,
          twitter_url: settings.twitter_url,
          facebook_url: settings.facebook_url,
        })
        .eq("id", settings.id);
    } else {
      const { data } = await supabase
        .from("store_settings")
        .insert({
          store_name_ar: settings.store_name_ar,
          store_name_en: settings.store_name_en,
          whatsapp_number: settings.whatsapp_number,
          email: settings.email,
          instagram_url: settings.instagram_url,
          twitter_url: settings.twitter_url,
          facebook_url: settings.facebook_url,
        })
        .select()
        .single();
      if (data) setSettings(data);
    }

    // Save key-value settings
    await Promise.all([
      upsertKV(supabase, "maintenance_mode", maintenanceMode),
      upsertKV(supabase, "privacy_ar", privacyAr),
      upsertKV(supabase, "privacy_en", privacyEn),
      upsertKV(supabase, "terms_ar", termsAr),
      upsertKV(supabase, "terms_en", termsEn),
      upsertKV(supabase, "store_theme", storeTheme),
    ]);

    toast.showToast(t("settingsSaved"), "success");
    setSaving(false);
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">{t("storeSettings")}</h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("nameAr")}
            value={settings.store_name_ar}
            onChange={(e) => setSettings({ ...settings, store_name_ar: e.target.value })}
          />
          <Input
            label={t("nameEn")}
            value={settings.store_name_en}
            onChange={(e) => setSettings({ ...settings, store_name_en: e.target.value })}
            dir="ltr"
          />
        </div>

        <Input
          label={t("whatsappNumber")}
          value={settings.whatsapp_number}
          onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
          dir="ltr"
        />

        <Input
          label={t("email")}
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
          dir="ltr"
        />

        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-dark mb-4">{t("socialLinks")}</h2>
          <div className="space-y-4">
            <Input
              label="Instagram"
              value={settings.instagram_url}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              dir="ltr"
            />
            <Input
              label="Twitter / X"
              value={settings.twitter_url}
              onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
              dir="ltr"
            />
            <Input
              label="Facebook"
              value={settings.facebook_url}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              dir="ltr"
            />
          </div>
        </div>

        {/* Privacy & Terms */}
        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-dark mb-2">{t("privacyTerms")}</h2>
          <p className="text-sm text-muted mb-4">{t("privacyTermsDesc")}</p>
          <div className="space-y-4">
            <Textarea
              label={t("privacyAr")}
              value={privacyAr}
              onChange={(e) => setPrivacyAr(e.target.value)}
              rows={6}
            />
            <Textarea
              label={t("privacyEn")}
              value={privacyEn}
              onChange={(e) => setPrivacyEn(e.target.value)}
              dir="ltr"
              rows={6}
            />
            <Textarea
              label={t("termsAr")}
              value={termsAr}
              onChange={(e) => setTermsAr(e.target.value)}
              rows={6}
            />
            <Textarea
              label={t("termsEn")}
              value={termsEn}
              onChange={(e) => setTermsEn(e.target.value)}
              dir="ltr"
              rows={6}
            />
          </div>
        </div>

        {/* Store Theme */}
        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-dark mb-2">{t("storeTheme")}</h2>
          <p className="text-sm text-muted mb-4">{t("storeThemeDesc")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "classic", color: "#047857", label: t("themeClassic") },
              { id: "ocean", color: "#1E6CB0", label: t("themeOcean") },
              { id: "sunset", color: "#C96830", label: t("themeSunset") },
              { id: "lavender", color: "#7C3AED", label: t("themeLavender") },
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setStoreTheme(theme.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                  storeTheme === theme.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: theme.color }}
                />
                <span className={`text-sm font-medium ${storeTheme === theme.id ? "text-primary" : "text-dark"}`}>
                  {theme.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-dark mb-2">{t("maintenance")}</h2>
          <p className="text-sm text-muted mb-4">{t("maintenanceDesc")}</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className={`font-medium ${maintenanceMode ? "text-red-500" : "text-dark"}`}>
              {t("maintenanceMode")}
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "..." : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
