import { createClient } from "@/lib/supabase/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import ExportCSVButton from "@/components/admin/ExportCSVButton";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import BackupRestore from "@/components/admin/BackupRestore";
import PDFExport from "@/components/admin/PDFExport";
import ExcelExport from "@/components/admin/ExcelExport";
import AdminNotifications from "@/components/admin/AdminNotifications";

async function getStats() {
  try {
    const supabase = await createClient();
    const [
      { count: productCount },
      { count: categoryCount },
      { count: featuredCount },
      { count: linksCount },
      { data: recentProducts },
      { data: allProducts },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
      supabase.from("purchase_links").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("products")
        .select("id, name_ar, name_en, price, image_url, created_at, category_id, category:categories(id, name_ar, name_en)")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    return {
      productCount: productCount || 0,
      categoryCount: categoryCount || 0,
      featuredCount: featuredCount || 0,
      linksCount: linksCount || 0,
      recentProducts: (recentProducts || []) as Product[],
      allProducts: (allProducts || []) as unknown as Product[],
    };
  } catch {
    return { productCount: 0, categoryCount: 0, featuredCount: 0, linksCount: 0, recentProducts: [], allProducts: [] };
  }
}

function DashboardContent({
  stats,
  locale,
}: {
  stats: {
    productCount: number;
    categoryCount: number;
    featuredCount: number;
    linksCount: number;
    recentProducts: Product[];
    allProducts: Product[];
  };
  locale: string;
}) {
  const t = useTranslations("admin");

  const statCards = [
    {
      label: t("totalProducts"),
      count: stats.productCount,
      href: `/${locale}/admin/products`,
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bg: "bg-primary/10",
    },
    {
      label: t("totalCategories"),
      count: stats.categoryCount,
      href: `/${locale}/admin/categories`,
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bg: "bg-secondary/10",
    },
    {
      label: t("featuredCount"),
      count: stats.featuredCount,
      href: `/${locale}/admin/products`,
      icon: (
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bg: "bg-accent/10",
    },
    {
      label: t("purchaseLinksCount"),
      count: stats.linksCount,
      href: `/${locale}/admin/products`,
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      bg: "bg-primary/10",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("dashboard")}</h1>
        <div className="flex items-center gap-2">
          <PDFExport products={stats.allProducts} />
          <ExcelExport />
          <ExportCSVButton products={stats.allProducts} />
        </div>
      </div>

      {/* Notifications */}
      <AdminNotifications />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-surface border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{card.count}</p>
            <p className="text-sm text-muted mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Analytics */}
      <AnalyticsSection products={stats.allProducts} />

      {/* Backup & Restore */}
      <div className="mt-8">
        <BackupRestore />
      </div>

      {/* Recent Products */}
      {stats.recentProducts.length > 0 && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden mt-8">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark">{t("recentProducts")}</h2>
            <Link
              href={`/${locale}/admin/products`}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              {t("products")} &rarr;
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stats.recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/admin/products/${product.id}/edit`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-background/50 transition-colors"
              >
                <div className="w-10 h-14 relative bg-background rounded overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <Image src={product.image_url} alt="" fill className="object-cover" sizes="40px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark truncate">
                    {getLocalizedField(product, "name", locale)}
                  </p>
                  <p className="text-sm text-muted">
                    {product.category ? getLocalizedField(product.category, "name", locale) : "-"}
                  </p>
                </div>
                <p className="text-primary font-medium text-sm flex-shrink-0">
                  {formatPrice(product.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const locale = await getLocale();
  return <DashboardContent stats={stats} locale={locale} />;
}
