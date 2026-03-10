export const revalidate = 60;

import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import CategoryCard from "@/components/store/CategoryCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Category } from "@/types";

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

function CategoriesContent({ categories, locale }: { categories: Category[]; locale: string }) {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("allCategories") },
        ]}
      />

      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("allCategories")}</h1>
      </div>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <div className="w-20 h-20 mx-auto mb-4 bg-border/30 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-lg">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}

export default async function CategoriesPage() {
  const [categories, locale] = await Promise.all([getCategories(), getLocale()]);
  return <CategoriesContent categories={categories} locale={locale} />;
}
