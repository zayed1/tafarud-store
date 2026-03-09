import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import CategoryCard from "@/components/store/CategoryCard";
import { Category } from "@/types";

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

function CategoriesContent({ categories }: { categories: Category[] }) {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-dark mb-8">{t("allCategories")}</h1>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoriesContent categories={categories} />;
}
