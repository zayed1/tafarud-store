import { createClient } from "@/lib/supabase/server";
import { BASE_URL } from "@/lib/config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id, created_at"),
    supabase.from("categories").select("slug, created_at"),
  ]);

  const locales = ["ar", "en"];

  // Static pages
  const staticPages = locales.flatMap((locale) =>
    ["", "/products", "/categories", "/about"].map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }))
  );

  // Product pages
  const productPages = (products || []).flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      lastModified: new Date(product.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  // Category pages
  const categoryPages = (categories || []).flatMap((category) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/categories/${category.slug}`,
      lastModified: new Date(category.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...productPages, ...categoryPages];
}
