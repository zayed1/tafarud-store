"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface Announcement {
  id: string;
  text_ar: string;
  text_en: string;
  link: string | null;
  bg_color: string | null;
  text_color: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [textAr, setTextAr] = useState("");
  const [textEn, setTextEn] = useState("");
  const [link, setLink] = useState("");
  const [bgColor, setBgColor] = useState("#047857");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [isActive, setIsActive] = useState(true);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);

  const t = useTranslations("admin");
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      setAnnouncements(data || []);
    } catch {
      // Table might not exist
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    setTextAr("");
    setTextEn("");
    setLink("");
    setBgColor("#047857");
    setTextColor("#FFFFFF");
    setIsActive(true);
    setStartsAt("");
    setEndsAt("");
    setShowModal(true);
  }

  function openEdit(a: Announcement) {
    setEditing(a);
    setTextAr(a.text_ar);
    setTextEn(a.text_en);
    setLink(a.link || "");
    setBgColor(a.bg_color || "#047857");
    setTextColor(a.text_color || "#FFFFFF");
    setIsActive(a.is_active);
    setStartsAt(a.starts_at ? a.starts_at.slice(0, 16) : "");
    setEndsAt(a.ends_at ? a.ends_at.slice(0, 16) : "");
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const data = {
      text_ar: textAr,
      text_en: textEn,
      link: link || null,
      bg_color: bgColor,
      text_color: textColor,
      is_active: isActive,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    };

    if (editing) {
      await supabase.from("announcements").update(data).eq("id", editing.id);
    } else {
      await supabase.from("announcements").insert(data);
    }

    setSaving(false);
    setShowModal(false);
    toast.showToast(t("announcementSaved"), "success");
    load();
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("announcements").delete().eq("id", id);
    toast.showToast(t("delete"), "success");
    load();
  }

  async function toggleActive(a: Announcement) {
    const supabase = createClient();
    await supabase
      .from("announcements")
      .update({ is_active: !a.is_active })
      .eq("id", a.id);
    load();
  }

  if (loading) {
    return <div className="text-center py-12 text-muted">...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("announcements")}</h1>
        <Button onClick={openAdd}>+ {t("addAnnouncement")}</Button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4"
          >
            {/* Color preview */}
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0 border border-border"
              style={{ backgroundColor: a.bg_color || "#047857" }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark truncate">{a.text_ar}</p>
              <p className="text-sm text-muted truncate" dir="ltr">{a.text_en}</p>
              {a.link && (
                <p className="text-xs text-primary truncate mt-1" dir="ltr">{a.link}</p>
              )}
              {(a.starts_at || a.ends_at) && (
                <p className="text-xs text-muted mt-1" dir="ltr">
                  {a.starts_at && `${t("startsAt")}: ${new Date(a.starts_at).toLocaleDateString()}`}
                  {a.starts_at && a.ends_at && " — "}
                  {a.ends_at && `${t("endsAt")}: ${new Date(a.ends_at).toLocaleDateString()}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(a)}
                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                  a.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {a.is_active ? t("activate") : t("inactive")}
              </button>
              <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                {t("edit")}
              </Button>
              <Button variant="danger" size="sm" onClick={() => deleteAnnouncement(a.id)}>
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>{t("noAnnouncements")}</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? t("editAnnouncement") : t("addAnnouncement")}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label={t("announcementTextAr")}
            value={textAr}
            onChange={(e) => setTextAr(e.target.value)}
            required
          />
          <Input
            label={t("announcementTextEn")}
            value={textEn}
            onChange={(e) => setTextEn(e.target.value)}
            dir="ltr"
          />
          <Input
            label={t("bannerLink")}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            dir="ltr"
            placeholder="https://..."
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">{t("bgColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <span className="text-sm text-muted" dir="ltr">{bgColor}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">{t("textColor")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <span className="text-sm text-muted" dir="ltr">{textColor}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">{t("startsAt")}</label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">{t("endsAt")}</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-dark">{t("preview")}</label>
            <div
              className="rounded-lg px-4 py-2 text-center text-sm font-medium"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {textAr || "..."}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="font-medium text-dark">{t("activate")}</span>
          </label>

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
