import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import HeroSection from "@/components/store/HeroSection";
import ProductGrid from "@/components/store/ProductGrid";
import FeaturedSlider from "@/components/store/FeaturedSlider";
import CategoryCard from "@/components/store/CategoryCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { Product, Category } from "@/types";
import Link from "next/link";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);
    return data || [];
  } catch {
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
  } catch {
    return [];
  }
}

function HomeContent({
  featuredProducts,
  categories,
  locale,
}: {
  featuredProducts: Product[];
  categories: Category[];
  locale: string;
}) {
  const t = useTranslations("common");
  const tAbout = useTranslations("about");

  return (
    <>
      <HeroSection />

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
                <CategoryCard category={category} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Featured Products Slider */}
      {featuredProducts.length > 0 && (
        <FeaturedSlider products={featuredProducts} />
      )}

      {/* About Snippet */}
      <AnimatedSection>
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
      </AnimatedSection>
    </>
  );
}

export default async function HomePage() {
  const [featuredProducts, categories, locale] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getLocale(),
  ]);

  return <HomeContent featuredProducts={featuredProducts} categories={categories} locale={locale} />;
}
