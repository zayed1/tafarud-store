"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import type { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const t = useTranslations("admin");
  const toast = useToast();

  const loadCoupons = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCoupons();
  }, [loadCoupons]);

  const resetForm = useCallback(() => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinOrderAmount("");
    setMaxUses("");
    setExpiresAt("");
    setIsActive(true);
    setEditingCoupon(null);
  }, []);

  const openEdit = useCallback((coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discount_type);
    setDiscountValue(String(coupon.discount_value));
    setMinOrderAmount(coupon.min_order_amount ? String(coupon.min_order_amount) : "");
    setMaxUses(coupon.max_uses ? String(coupon.max_uses) : "");
    setExpiresAt(coupon.expires_at ? coupon.expires_at.split("T")[0] : "");
    setIsActive(coupon.is_active);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!code || !discountValue) return;
    setSaving(true);

    const supabase = createClient();
    const couponData = {
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      max_uses: maxUses ? parseInt(maxUses) : null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      is_active: isActive,
    };

    if (editingCoupon) {
      await supabase.from("coupons").update(couponData).eq("id", editingCoupon.id);
    } else {
      await supabase.from("coupons").insert(couponData);
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      action: editingCoupon ? "updated" : "added",
      entity_type: "coupon",
      entity_name: code.toUpperCase(),
    });

    toast.showToast(t("couponSaved"), "success");
    setIsModalOpen(false);
    resetForm();
    loadCoupons();
    setSaving(false);
  }, [code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive, editingCoupon, t, toast, resetForm, loadCoupons]);

  const deleteCoupon = useCallback(async (id: string, couponCode: string) => {
    if (!confirm(t("confirmDelete"))) return;

    const supabase = createClient();
    await supabase.from("coupons").delete().eq("id", id);
    await supabase.from("activity_logs").insert({
      action: "deleted",
      entity_type: "coupon",
      entity_name: couponCode,
    });

    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.showToast(t("couponDeleted"), "success");
  }, [t, toast]);

  const toggleActive = useCallback(async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from("coupons").update({ is_active: !active }).eq("id", id);
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !active } : c));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-40 bg-border/40 rounded-lg animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-border/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("coupons")}</h1>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          + {t("addCoupon")}
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <svg className="w-16 h-16 mx-auto mb-4 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p>{t("noCoupons")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
            return (
              <div
                key={coupon.id}
                className={`bg-surface border rounded-xl p-4 flex items-center gap-4 ${
                  !coupon.is_active || isExpired ? "border-border opacity-60" : "border-primary/20"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-dark text-lg font-mono" dir="ltr">{coupon.code}</span>
                    {isExpired && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{t("expired")}</span>}
                    {!coupon.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t("inactive")}</span>}
                  </div>
                  <p className="text-sm text-muted">
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}%`
                      : `${coupon.discount_value} AED`}
                    {coupon.min_order_amount ? ` · ${t("minOrder")}: ${coupon.min_order_amount} AED` : ""}
                    {coupon.max_uses ? ` · ${t("maxUses")}: ${coupon.used_count}/${coupon.max_uses}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(coupon.id, coupon.is_active)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      coupon.is_active ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={coupon.is_active ? t("deactivate") : t("activate")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={coupon.is_active ? "M5 13l4 4L19 7" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} />
                    </svg>
                  </button>
                  <button
                    onClick={() => openEdit(coupon)}
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon.id, coupon.code)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingCoupon ? t("editCoupon") : t("addCoupon")}>
        <div className="space-y-4">
          <Input
            label={t("couponCode")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SALE20"
            dir="ltr"
            className="uppercase"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">{t("discountType")}</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">{t("percentage")}</option>
                <option value="fixed">{t("fixedAmount")}</option>
              </select>
            </div>
            <Input
              label={t("discountValue")}
              type="number"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              dir="ltr"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("minOrder")}
              type="number"
              step="0.01"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              dir="ltr"
            />
            <Input
              label={t("maxUses")}
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              dir="ltr"
            />
          </div>
          <Input
            label={t("expiresAt")}
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            dir="ltr"
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="font-medium text-dark">{t("couponActive")}</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving || !code || !discountValue}>
              {saving ? "..." : t("save")}
            </Button>
            <Button variant="ghost" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
