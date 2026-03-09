import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import HeroSection from "@/components/store/HeroSection";
import ProductGrid from "@/components/store/ProductGrid";
import CategoryCard from "@/components/store/CategoryCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { Product, Category } from "@/types";

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
}: {
  featuredProducts: Product[];
  categories: Category[];
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
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-bold text-dark">{t("allCategories")}</h2>
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

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-bold text-dark">{t("featuredProducts")}</h2>
            </div>
          </AnimatedSection>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* About Snippet */}
      <AnimatedSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-20">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">{tAbout("title")}</h2>
            <p className="text-dark-light text-lg leading-relaxed mb-6">
              {tAbout("content2")}
            </p>
            <p className="text-primary font-semibold text-xl italic">
              &ldquo;{tAbout("tagline")}&rdquo;
            </p>
          </div>
        </section>
      </AnimatedSection>
    </>
  );
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return <HomeContent featuredProducts={featuredProducts} categories={categories} />;
}
