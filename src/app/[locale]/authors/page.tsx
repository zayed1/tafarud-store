import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";
import type { Author } from "@/types";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "كُتابنا | متجر التفرّد" : "Our Authors | Tafarud Store",
    description: locale === "ar" ? "تعرّف على كتّاب ومؤلفي إصدارات مجموعة التفرّد" : "Meet the authors and writers of Tafarud Group publications",
    alternates: { canonical: `${BASE_URL}/${locale}/authors` },
  };
}

async function getAuthors(): Promise<Author[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("authors").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AuthorsPage() {
  const [authors, locale, t] = await Promise.all([
    getAuthors(),
    getLocale(),
    getTranslations("common"),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <BreadcrumbJsonLd items={[
        { name: locale === "ar" ? "الرئيسية" : "Home", url: `/${locale}` },
        { name: t("authors") },
      ]} />
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-primary text-sm font-medium">{t("authors")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-dark">{t("authors")}</h1>
        </div>
      </AnimatedSection>

      {authors.length === 0 ? (
        <p className="text-muted text-center py-12">{t("noAuthors")}</p>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => {
            const name = getLocalizedField(author, "name", locale);
            const bio = getLocalizedField(author, "bio", locale);
            return (
              <StaggerItem key={author.id}>
                <Link href={`/${locale}/authors/${author.slug}`} className="block group">
                  <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 p-6 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden relative mb-4 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      {author.image_url ? (
                        <Image src={author.image_url} alt={name} fill className="object-cover" sizes="96px" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">{name}</h2>
                    {bio && <p className="text-muted text-sm mt-2 line-clamp-3">{bio}</p>}
                    <div className="mt-4 text-primary text-sm font-medium flex items-center justify-center gap-1">
                      {t("viewDetails")}
                      <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}
