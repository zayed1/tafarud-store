"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("admin");
  const toast = useToast();

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .single();
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

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

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? "..." : t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
