import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import ProductGrid from "@/components/store/ProductGrid";
import { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

function ProductsContent({ products }: { products: Product[] }) {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h1 className="text-3xl sm:text-4xl font-bold text-dark">{t("allProducts")}</h1>
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

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsContent products={products} />;
}
