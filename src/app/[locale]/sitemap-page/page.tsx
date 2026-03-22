import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "خريطة الموقع | متجر التفرّد" : "Sitemap | Tafarud Store",
    alternates: { canonical: `${BASE_URL}/${locale}/sitemap-page` },
  };
}

interface SitemapSection {
  title: string;
  icon: string;
  links: { label: string; href: string }[];
}

export default async function SitemapPage() {
  const supabase = await createClient();
  const [locale, t, { data: categories }, { data: authors }] = await Promise.all([
    getLocale(),
    getTranslations("common"),
    supabase.from("categories").select("slug, name_ar, name_en").order("created_at", { ascending: false }),
    supabase.from("authors").select("slug, name_ar, name_en").order("created_at", { ascending: false }),
  ]);

  const sections: SitemapSection[] = [
    {
      title: locale === "ar" ? "الصفحات الرئيسية" : "Main Pages",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      links: [
        { label: t("home"), href: `/${locale}` },
        { label: t("allProducts"), href: `/${locale}/products` },
        { label: t("allCategories"), href: `/${locale}/categories` },
        { label: t("authors"), href: `/${locale}/authors` },
        { label: t("about"), href: `/${locale}/about` },
      ],
    },
    {
      title: t("categories"),
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      links: (categories || []).map((cat) => ({
        label: getLocalizedField(cat, "name", locale),
        href: `/${locale}/categories/${cat.slug}`,
      })),
    },
    {
      title: t("authors"),
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      links: (authors || []).map((author) => ({
        label: getLocalizedField(author, "name", locale),
        href: `/${locale}/authors/${author.slug}`,
      })),
    },
    {
      title: locale === "ar" ? "صفحات أخرى" : "Other Pages",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      links: [
        { label: t("faq"), href: `/${locale}/faq` },
        { label: t("privacyTerms"), href: `/${locale}/privacy` },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[
        { name: t("home"), url: `/${locale}` },
        { name: locale === "ar" ? "خريطة الموقع" : "Sitemap" },
      ]} />

      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-medium">
              {locale === "ar" ? "خريطة الموقع" : "Sitemap"}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-dark">
            {locale === "ar" ? "خريطة الموقع" : "Sitemap"}
          </h1>
          <p className="text-muted mt-3">
            {locale === "ar" ? "جميع صفحات الموقع في مكان واحد" : "All site pages in one place"}
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-dark">{section.title}</h2>
              <span className="text-xs text-muted bg-border/30 px-2 py-0.5 rounded-full">
                {section.links.length}
              </span>
            </div>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors group py-1"
                  >
                    <span className="w-1 h-1 bg-border group-hover:bg-primary rounded-full transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
              {section.links.length === 0 && (
                <li className="text-sm text-muted/60 py-1">{t("noResults")}</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
