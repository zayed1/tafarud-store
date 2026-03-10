export const revalidate = 60;

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import ProductGrid from "@/components/store/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Product, Category } from "@/types";

async function getCategoryWithProducts(slug: string) {
  try {
    const supabase = await createClient();

    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!category) return null;

    const { data: products } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });

    return { category: category as Category, products: (products || []) as Product[] };
  } catch {
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCategoryWithProducts(slug);
  const locale = await getLocale();
  const t = await getTranslations("common");

  if (!result) {
    notFound();
  }

  const { category, products } = result;
  const name = getLocalizedField(category, "name", locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("allCategories"), href: `/${locale}/categories` },
          { label: name },
        ]}
      />

      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">{name}</h1>
        <span className="text-sm text-muted bg-border/30 px-3 py-1 rounded-full">
          {t("productsCount", { count: products.length })}
        </span>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20 text-muted">
          <div className="w-20 h-20 mx-auto mb-4 bg-border/30 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}
