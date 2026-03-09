"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

interface RelatedProductsProps {
  categoryId: string | null;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const t = useTranslations("product");
  const locale = useLocale();

  useEffect(() => {
    if (!categoryId) return;

    const fetchRelated = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("category_id", categoryId)
        .neq("id", currentProductId)
        .limit(4);

      setProducts(data || []);
    };

    fetchRelated();
  }, [categoryId, currentProductId]);

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
