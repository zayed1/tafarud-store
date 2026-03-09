import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getLocale } from "next-intl/server";

async function getStats() {
  try {
    const supabase = await createClient();
    const [{ count: productCount }, { count: categoryCount }] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);
    return { productCount: productCount || 0, categoryCount: categoryCount || 0 };
  } catch {
    return { productCount: 0, categoryCount: 0 };
  }
}

function DashboardContent({
  stats,
  locale,
}: {
  stats: { productCount: number; categoryCount: number };
  locale: string;
}) {
  const t = useTranslations("admin");

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark mb-8">{t("dashboard")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Link
          href={`/${locale}/admin/products`}
          className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-dark">{stats.productCount}</p>
              <p className="text-muted">{t("totalProducts")}</p>
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/admin/categories`}
          className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-dark">{stats.categoryCount}</p>
              <p className="text-muted">{t("totalCategories")}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const locale = await getLocale();
  return <DashboardContent stats={stats} locale={locale} />;
}
