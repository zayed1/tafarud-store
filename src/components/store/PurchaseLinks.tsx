"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
      <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        {t("purchaseOptions")}
      </h3>
      {enabledLinks.map((link, index) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className="text-2xl w-10 h-10 flex items-center justify-center bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">{getCountryFlag(link.country_code)}</span>
          <span className="flex-1 font-medium text-dark group-hover:text-primary transition-colors">
            {tCommon("buyFrom")} {link.platform_name}
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <svg
              className="w-4 h-4 text-muted group-hover:text-primary transition-all rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
