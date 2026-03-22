import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/store/ProductCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Author, Product } from "@/types";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

const getAuthor = cache(async (slug: string) => {
  try {
    const supabase = await createClient();
    const { data: author } = await supabase.from("authors").select("*").eq("slug", slug).single();
    if (!author) return null;

    const { data: products } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("author_id", author.id)
      .order("created_at", { ascending: false });

    return { author: author as Author, products: (products || []) as Product[] };
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getAuthor(slug);
  if (!result) return {};
  const name = locale === "ar" ? result.author.name_ar : result.author.name_en || result.author.name_ar;
  const bio = locale === "ar" ? result.author.bio_ar : result.author.bio_en || result.author.bio_ar;
  return {
    title: `${name} | متجر التفرّد`,
    description: bio?.slice(0, 160) || name,
    alternates: { canonical: `${BASE_URL}/${locale}/authors/${slug}` },
    openGraph: {
      title: name,
      description: bio?.slice(0, 160) || name,
      images: result.author.image_url ? [{ url: result.author.image_url }] : [],
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getAuthor(slug);
  const locale = await getLocale();
  const t = await getTranslations("common");

  if (!result) notFound();

  const { author, products } = result;
  const name = getLocalizedField(author, "name", locale);
  const bio = getLocalizedField(author, "bio", locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("authors"), href: `/${locale}/authors` },
          { label: name },
        ]}
      />

      <AnimatedSection>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 bg-surface rounded-2xl border border-border p-6 sm:p-8">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden relative flex-shrink-0 ring-4 ring-primary/10">
            {author.image_url ? (
              <Image src={author.image_url} alt={name} fill className="object-cover" sizes="128px" priority />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-center sm:text-start flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-3">{name}</h1>
            {bio && <p className="text-dark-light text-lg leading-relaxed">{bio}</p>}
            {author.social_links && author.social_links.length > 0 && (
              <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                {author.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary-dark font-medium bg-primary/5 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Author's Products */}
      {products.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-dark">{t("authorBooks")}</h2>
            <span className="text-muted text-sm">({products.length})</span>
          </div>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">{t("noResults")}</p>
          <Link href={`/${locale}/products`} className="text-primary hover:underline mt-2 inline-block">
            {t("allProducts")}
          </Link>
        </div>
      )}
    </div>
  );
}
