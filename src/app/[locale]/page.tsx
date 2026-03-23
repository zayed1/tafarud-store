export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import HeroSection from "@/components/store/HeroSection";
import FeaturedSlider from "@/components/store/FeaturedSlider";
import CategoryCard from "@/components/store/CategoryCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import ProductCard from "@/components/store/ProductCard";
import type { Product, Category, Banner } from "@/types";
import { getLocalizedField } from "@/lib/utils";
import { BASE_URL } from "@/lib/config";
import Link from "next/link";
import type { Metadata } from "next";
import ParallaxSection from "@/components/store/ParallaxSection";
import StatsCounters from "@/components/store/StatsCounters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar"
      ? "متجر التفرّد | إصدارات إبداعية ومنتجات ثقافية"
      : "Tafarud Store | Creative Publications & Cultural Products",
    description: locale === "ar"
      ? "نُقدّم عبر المتجر باقة متميزة من الكتب والإصدارات الإبداعية والمنتجات الثقافية"
      : "A distinguished collection of books, creative publications, and cultural products",
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        ar: `${BASE_URL}/ar`,
        en: `${BASE_URL}/en`,
      },
    },
  };
}

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "متجر التفرّد | Tafarud Store",
  description: "نُقدّم عبر المتجر باقة متميزة من الكتب والإصدارات الإبداعية والمنتجات الثقافية",
  url: BASE_URL,
  brand: {
    "@type": "Brand",
    name: "مجموعة التفرّد",
  },
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), author:authors(*)")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);
    return data || [];
  } catch (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
}

async function getBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

async function getCategoriesWithCounts(): Promise<(Category & { product_count: number })[]> {
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!categories || categories.length === 0) return [];

    const { data: products } = await supabase
      .from("products")
      .select("category_id");

    const countMap = new Map<string, number>();
    (products || []).forEach((p) => {
      if (p.category_id) {
        countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
      }
    });

    return categories.map((c) => ({
      ...c,
      product_count: countMap.get(c.id) || 0,
    }));
  } catch (error) {
    console.error("[getCategoriesWithCounts]", error);
    return [];
  }
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), author:authors(*)")
      .order("created_at", { ascending: false })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

async function getAuthorsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase.from("authors").select("id", { count: "exact", head: true });
    return count || 0;
  } catch {
    return 0;
  }
}

async function getProductsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
    return count || 0;
  } catch {
    return 0;
  }
}

function HomeContent({
  featuredProducts,
  categories,
  banners,
  locale,
  productsCount,
  authorsCount,
  newArrivals,
}: {
  featuredProducts: Product[];
  categories: (Category & { product_count: number })[];
  banners: Banner[];
  locale: string;
  productsCount: number;
  authorsCount: number;
  newArrivals: Product[];
}) {
  const t = useTranslations("common");
  const tAbout = useTranslations("about");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "متجر التفرّد | Tafarud Store",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/${locale}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const itemListJsonLd = featuredProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featuredProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: getLocalizedField(product, "name", locale),
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      image: product.image_url || undefined,
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <HeroSection banners={banners} />

      {/* Stats Counters */}
      <StatsCounters
        productsCount={productsCount}
        categoriesCount={categories.length}
        authorsCount={authorsCount}
      />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
                <h2 className="text-3xl sm:text-4xl font-bold text-dark">{t("allCategories")}</h2>
              </div>
              <Link
                href={`/${locale}/categories`}
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1 transition-colors"
              >
                {t("viewAll")}
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard category={category} productCount={category.product_count} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full" />
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-dark">{t("newArrivals")}</h2>
                  <p className="text-muted text-sm mt-1">{t("newArrivalsDesc")}</p>
                </div>
              </div>
              <Link
                href={`/${locale}/products`}
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1 transition-colors"
              >
                {t("viewAll")}
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Featured Products Slider */}
      {featuredProducts.length > 0 && (
        <FeaturedSlider products={featuredProducts} />
      )}

      {/* About Snippet with Parallax */}
      <ParallaxSection>
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-accent/[0.03]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-primary text-sm font-medium">{tAbout("title")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">{tAbout("title")}</h2>
            <p className="text-dark-light text-lg leading-relaxed mb-8">
              {tAbout("content2")}
            </p>
            <p className="text-primary font-semibold text-xl italic">
              &ldquo;{tAbout("tagline")}&rdquo;
            </p>
            <div className="mt-8">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
              >
                {t("about")}
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </ParallaxSection>
    </>
  );
}

export default async function HomePage() {
  const [featuredProducts, categories, banners, locale, productsCount, authorsCount, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithCounts(),
    getBanners(),
    getLocale(),
    getProductsCount(),
    getAuthorsCount(),
    getNewArrivals(),
  ]);

  return (
    <HomeContent
      featuredProducts={featuredProducts}
      categories={categories}
      banners={banners}
      locale={locale}
      productsCount={productsCount}
      authorsCount={authorsCount}
      newArrivals={newArrivals}
    />
  );
}
