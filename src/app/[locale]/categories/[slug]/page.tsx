import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import ProductGrid from "@/components/store/ProductGrid";
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

  if (!result) {
    notFound();
  }

  const { category, products } = result;
  const name = getLocalizedField(category, "name", locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-dark mb-8">{name}</h1>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">لا توجد منتجات في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
}
