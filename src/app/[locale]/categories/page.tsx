export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import CategoryCard from "@/components/store/CategoryCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";
import EmptyState from "@/components/ui/EmptyState";
import type { Category } from "@/types";

async function getCategoriesWithCounts(): Promise<(Category & { product_count: number })[]> {
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!categories || categories.length === 0) return [];

    const { data: products } = await supabase
      .from("products")
      .select("category_id");

    const countMap = new Map<string, number>();
    (products || []).forEach((p) => {
      if (p.category_id) {
        countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
      }
    });

    return categories.map((c) => ({
      ...c,
      product_count: countMap.get(c.id) || 0,
    }));
  } catch {
    return [];
  }
}

function CategoriesContent({ categories, locale }: { categories: (Category & { product_count: number })[]; locale: string }) {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[
        { name: t("home"), url: `/${locale}` },
        { name: t("allCategories") },
      ]} />
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("allCategories") },
        ]}
      />

      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("allCategories")}</h1>
        <span className="text-sm text-muted bg-border/30 px-3 py-1 rounded-full">
          {categories.length}
        </span>
      </div>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} productCount={category.product_count} />
          ))}
        </div>
      ) : (
        <EmptyState icon="category" message={t("noResults")} />
      )}
    </div>
  );
}

export default async function CategoriesPage() {
  const [categories, locale] = await Promise.all([getCategoriesWithCounts(), getLocale()]);
  return <CategoriesContent categories={categories} locale={locale} />;
}
