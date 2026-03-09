import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import HeroSection from "@/components/store/HeroSection";
import ProductGrid from "@/components/store/ProductGrid";
import CategoryCard from "@/components/store/CategoryCard";
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-dark mb-8">{t("allCategories")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-3xl font-bold text-dark mb-8">{t("featuredProducts")}</h2>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* About Snippet */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-dark mb-6">{tAbout("title")}</h2>
          <p className="text-dark-light text-lg leading-relaxed mb-4">
            {tAbout("content2")}
          </p>
          <p className="text-primary font-semibold text-xl italic">
            {tAbout("tagline")}
          </p>
        </div>
      </section>
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
