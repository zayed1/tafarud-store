import { useTranslations } from "next-intl";
import { PurchaseLink } from "@/types";
import { getCountryFlag } from "@/lib/utils";

interface PurchaseLinksProps {
  links: PurchaseLink[];
}

export default function PurchaseLinks({ links }: PurchaseLinksProps) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");

  const enabledLinks = links
    .filter((link) => link.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (enabledLinks.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        <p>{t("noLinks")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-dark mb-4">{t("purchaseOptions")}</h3>
      {enabledLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:shadow-md transition-all group"
        >
          <span className="text-2xl">{getCountryFlag(link.country_code)}</span>
          <span className="flex-1 font-medium text-dark group-hover:text-primary transition-colors">
            {tCommon("buyFrom")} {link.platform_name}
          </span>
          <svg
            className="w-5 h-5 text-muted group-hover:text-primary transition-colors rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
}
