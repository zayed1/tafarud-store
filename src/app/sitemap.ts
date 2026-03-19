import { createClient } from "@/lib/supabase/server";
import { BASE_URL } from "@/lib/config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, { data: authors }] = await Promise.all([
    supabase.from("products").select("id, created_at, image_url, name_ar, name_en, featured"),
    supabase.from("categories").select("slug, created_at, image_url"),
    supabase.from("authors").select("slug, created_at, image_url"),
  ]);

  const locales = ["ar", "en"];

  // Static pages with differentiated priorities
  const staticPages = locales.flatMap((locale) =>
    [
      { path: "", priority: 1.0, changeFrequency: "daily" as const },
      { path: "/products", priority: 0.9, changeFrequency: "daily" as const },
      { path: "/categories", priority: 0.8, changeFrequency: "weekly" as const },
      { path: "/authors", priority: 0.7, changeFrequency: "weekly" as const },
      { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
      { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
      { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    ].map((page) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.path === "" ? {
        images: [`${BASE_URL}/main/iconn.png`],
      } : {}),
    }))
  );

  // Product pages with images and dynamic priority
  const productPages = (products || []).flatMap((product) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      lastModified: new Date(product.created_at),
      changeFrequency: "weekly" as const,
      priority: product.featured ? 0.95 : 0.8,
      ...(product.image_url ? {
        images: [product.image_url],
      } : {}),
    }))
  );

  // Category pages with images
  const categoryPages = (categories || []).flatMap((category) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/categories/${category.slug}`,
      lastModified: new Date(category.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(category.image_url ? {
        images: [category.image_url],
      } : {}),
    }))
  );

  // Author pages
  const authorPages = (authors || []).flatMap((author) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/authors/${author.slug}`,
      lastModified: new Date(author.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      ...(author.image_url ? { images: [author.image_url] } : {}),
    }))
  );

  return [...staticPages, ...productPages, ...categoryPages, ...authorPages];
}
