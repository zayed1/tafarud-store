import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { Product, Author } from "@/types";

interface AuthorBooksProps {
  author: Author;
  currentProductId: string;
}

export default async function AuthorBooks({ author, currentProductId }: AuthorBooksProps) {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("common");

  const { data: products } = await supabase
    .from("products")
    .select("id, name_ar, name_en, price, image_url")
    .eq("author_id", author.id)
    .neq("id", currentProductId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!products || products.length === 0) return null;

  const authorName = getLocalizedField(author, "name", locale);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark">{t("authorBooks")}</h2>
            <Link
              href={`/${locale}/authors/${author.slug}`}
              className="text-sm text-primary hover:underline"
            >
              {t("by")} {authorName}
            </Link>
          </div>
        </div>
        <Link
          href={`/${locale}/authors/${author.slug}`}
          className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
        >
          {t("viewAll")}
          <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.map((product) => {
          const name = locale === "ar" ? product.name_ar : product.name_en || product.name_ar;
          return (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.id}`}
              className="group"
            >
              <div className="aspect-[3/4] relative bg-background rounded-xl overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    <svg className="w-8 h-8 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm font-medium text-dark line-clamp-2 group-hover:text-primary transition-colors">
                {name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
