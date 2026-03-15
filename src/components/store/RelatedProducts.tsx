import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

interface RelatedProductsProps {
  categoryId: string | null;
  currentProductId: string;
}

async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .neq("id", excludeId)
      .limit(4);
    return (data || []) as Product[];
  } catch (error) {
    console.error("[getRelatedProducts]", error);
    return [];
  }
}

export default async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  if (!categoryId) return null;

  const [products, t] = await Promise.all([
    getRelatedProducts(categoryId, currentProductId),
    getTranslations("product"),
  ]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h2 className="text-2xl sm:text-3xl font-bold text-dark">{t("relatedProducts")}</h2>
      </div>
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
