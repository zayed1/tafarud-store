"use client";

import { useTranslations } from "next-intl";
import { PurchaseLink } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface PurchaseLinkEditorProps {
  links: Partial<PurchaseLink>[];
  onChange: (links: Partial<PurchaseLink>[]) => void;
}

const defaultCountryCodes = [
  { code: "AE", label: "UAE 🇦🇪" },
  { code: "SA", label: "KSA 🇸🇦" },
  { code: "KW", label: "KW 🇰🇼" },
  { code: "BH", label: "BH 🇧🇭" },
  { code: "QA", label: "QA 🇶🇦" },
  { code: "OM", label: "OM 🇴🇲" },
  { code: "EG", label: "EG 🇪🇬" },
  { code: "GLOBAL", label: "Global 🌐" },
];

export default function PurchaseLinkEditor({
  links,
  onChange,
}: PurchaseLinkEditorProps) {
  const t = useTranslations("admin");

  const addLink = () => {
    onChange([
      ...links,
      {
        platform_name: "",
        url: "",
        country_code: "AE",
        is_enabled: true,
        sort_order: links.length,
      },
    ]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: string, value: string | boolean | number) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark">{t("purchaseLinks")}</h3>
        <Button type="button" variant="outline" size="sm" onClick={addLink}>
          + {t("addLink")}
        </Button>
      </div>

      {links.map((link, index) => (
        <div
          key={index}
          className="bg-background p-4 rounded-xl space-y-3 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">
              #{index + 1}
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={link.is_enabled !== false}
                  onChange={(e) => updateLink(index, "is_enabled", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-dark">{t("enabled")}</span>
              </label>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeLink(index)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t("platformName")}
              value={link.platform_name || ""}
              onChange={(e) => updateLink(index, "platform_name", e.target.value)}
              placeholder="Amazon UAE"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-dark">
                {t("countryCode")}
              </label>
              <select
                value={link.country_code || "AE"}
                onChange={(e) => updateLink(index, "country_code", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {defaultCountryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label={t("url")}
            value={link.url || ""}
            onChange={(e) => updateLink(index, "url", e.target.value)}
            placeholder="https://www.amazon.ae/dp/..."
            dir="ltr"
          />

          <Input
            label={t("sortOrder")}
            type="number"
            value={link.sort_order?.toString() || "0"}
            onChange={(e) => updateLink(index, "sort_order", parseInt(e.target.value) || 0)}
          />
        </div>
      ))}

      {links.length === 0 && (
        <div className="text-center py-6 text-muted border-2 border-dashed border-border rounded-xl">
          <p className="text-sm">{t("purchaseLinks")} - 0</p>
          <Button type="button" variant="ghost" size="sm" onClick={addLink} className="mt-2">
            + {t("addLink")}
          </Button>
        </div>
      )}
    </div>
  );
}
