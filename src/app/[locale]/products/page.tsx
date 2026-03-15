export const revalidate = 60;

import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";
import type { Product, Category } from "@/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductsPageClient from "./ProductsPageClient";

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    return data || [];
  } catch (error) {
    console.error("[getProducts]", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  } catch (error) {
    console.error("[getCategories]", error);
    return [];
  }
}

export default async function ProductsPage() {
  const [products, categories, locale] = await Promise.all([
    getProducts(),
    getCategories(),
    getLocale(),
  ]);

  return <ProductsPageClient products={products} categories={categories} locale={locale} />;
}
