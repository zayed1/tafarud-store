"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

interface FAQ {
  id: string;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionAr, setQuestionAr] = useState("");
  const [questionEn, setQuestionEn] = useState("");
  const [answerAr, setAnswerAr] = useState("");
  const [answerEn, setAnswerEn] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const t = useTranslations("admin");
  const toast = useToast();

  async function loadFaqs() {
    const supabase = createClient();
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    setFaqs(data || []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadFaqs(); }, []);

  function resetForm() {
    setQuestionAr(""); setQuestionEn(""); setAnswerAr(""); setAnswerEn("");
    setSortOrder(0); setEditingId(null); setShowForm(false);
  }

  function editFaq(faq: FAQ) {
    setEditingId(faq.id);
    setQuestionAr(faq.question_ar); setQuestionEn(faq.question_en);
    setAnswerAr(faq.answer_ar); setAnswerEn(faq.answer_en);
    setSortOrder(faq.sort_order); setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const data = { question_ar: questionAr, question_en: questionEn, answer_ar: answerAr, answer_en: answerEn, sort_order: sortOrder };

    if (editingId) {
      await supabase.from("faqs").update(data).eq("id", editingId);
    } else {
      await supabase.from("faqs").insert(data);
    }

    toast.showToast(t("faqSaved"), "success");
    resetForm(); setSaving(false); loadFaqs();
  }

  async function deleteFaq(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", id);
    toast.showToast(t("faqDeleted"), "success");
    loadFaqs();
  }

  async function toggleActive(faq: FAQ) {
    const supabase = createClient();
    await supabase.from("faqs").update({ is_active: !faq.is_active }).eq("id", faq.id);
    loadFaqs();
  }

  if (loading) return <div className="text-center py-12 text-muted">...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("faq")}</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>{t("addFaq")}</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 mb-12 p-6 bg-surface rounded-2xl border border-border">
          <Input label={t("questionAr")} value={questionAr} onChange={(e) => setQuestionAr(e.target.value)} required />
          <Input label={t("questionEn")} value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} dir="ltr" />
          <Textarea label={t("answerAr")} value={answerAr} onChange={(e) => setAnswerAr(e.target.value)} required />
          <Textarea label={t("answerEn")} value={answerEn} onChange={(e) => setAnswerEn(e.target.value)} dir="ltr" />
          <Input label={t("sortOrder")} type="number" value={sortOrder.toString()} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} dir="ltr" />
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>{saving ? "..." : t("save")}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>{t("cancel")}</Button>
          </div>
        </form>
      )}

      {faqs.length === 0 ? (
        <p className="text-muted text-center py-12">{t("noFaqs")}</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-dark">{faq.question_ar}</h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">{faq.answer_ar}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(faq)}
                    className={`text-xs px-2 py-1 rounded-full cursor-pointer ${faq.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {faq.is_active ? t("enabled") : t("inactive")}
                  </button>
                  <button onClick={() => editFaq(faq)} className="text-primary text-sm hover:underline cursor-pointer">{t("edit")}</button>
                  <button onClick={() => deleteFaq(faq.id)} className="text-red-500 text-sm hover:underline cursor-pointer">{t("delete")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
