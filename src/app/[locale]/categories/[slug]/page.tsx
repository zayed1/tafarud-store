export const revalidate = 120;

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import ProductGrid from "@/components/store/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";
import { BASE_URL } from "@/lib/config";
import type { Product, Category } from "@/types";

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: locale === "ar" ? "التصنيفات" : "Categories", item: `${BASE_URL}/${locale}/categories` },
      { "@type": "ListItem", position: 3, name: name },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
        <EmptyState icon="book" message={t("noResults")} />
      )}
    </div>
  );
}
