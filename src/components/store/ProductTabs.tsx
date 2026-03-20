"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import CopyDescriptionButton from "./CopyDescriptionButton";

interface ProductTabsProps {
  description: string;
  purchaseLinksSlot: React.ReactNode;
  relatedProductsSlot: React.ReactNode;
  hasPurchaseLinks: boolean;
}

export default function ProductTabs({
  description,
  purchaseLinksSlot,
  relatedProductsSlot,
  hasPurchaseLinks,
}: ProductTabsProps) {
  const t = useTranslations("common");
  const [activeTab, setActiveTab] = useState<"description" | "purchase" | "related">(
    description ? "description" : "purchase"
  );

  const tabs = [
    ...(description ? [{ id: "description" as const, label: t("description"), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }] : []),
    ...(hasPurchaseLinks ? [{ id: "purchase" as const, label: t("purchaseOptions"), icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" }] : []),
    { id: "related" as const, label: t("relatedProducts"), icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  ];

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted hover:text-dark"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="productTab"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="py-6"
        >
          {activeTab === "description" && description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-dark-light text-lg leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
              <div className="mt-4">
                <CopyDescriptionButton text={description} />
              </div>
            </div>
          )}
          {activeTab === "purchase" && purchaseLinksSlot}
          {activeTab === "related" && relatedProductsSlot}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
