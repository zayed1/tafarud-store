import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import PurchaseLinks from "@/components/store/PurchaseLinks";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import ShareButton from "@/components/store/ShareButton";
import QRCodeShare from "@/components/store/QRCodeShare";
import ProductGallery from "@/components/store/ProductGallery";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductViewTracker from "@/components/store/ProductViewTracker";
import type { Product, PurchaseLink as PurchaseLinkType } from "@/types";
import { BASE_URL } from "@/lib/config";
import type { Metadata } from "next";
import RelatedProducts from "@/components/store/RelatedProducts";
import AuthorBooks from "@/components/store/AuthorBooks";
import ProductTabs from "@/components/store/ProductTabs";

const RecentlyViewed = dynamic(() => import("@/components/store/RecentlyViewed"));

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(20);
    return (data || []).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

const getProduct = cache(async function getProduct(id: string) {
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("*, category:categories(*), author:authors(*)")
      .eq("id", id)
      .single();

    if (!product) return null;

    const { data: links } = await supabase
      .from("purchase_links")
      .select("*")
      .eq("product_id", id)
      .order("sort_order", { ascending: true });

    return { ...product, purchase_links: links || [] } as Product & {
      purchase_links: PurchaseLinkType[];
    };
  } catch (error) {
    console.error("[getProduct]", id, error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const product = await getProduct(id);

  if (!product) return {};

  const name = locale === "ar" ? product.name_ar : product.name_en;
  const description = locale === "ar" ? product.description_ar : product.description_en;
  const categoryName = product.category
    ? (locale === "ar" ? product.category.name_ar : product.category.name_en)
    : "";
  const metaDescription = `${name} - ${formatPrice(product.price)}${categoryName ? ` | ${categoryName}` : ""} - ${(description || "").slice(0, 120)}`;

  return {
    title: `${name} | متجر التفرّد`,
    description: metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${locale}/products/${id}`,
      languages: {
        ar: `${BASE_URL}/ar/products/${id}`,
        en: `${BASE_URL}/en/products/${id}`,
      },
    },
    openGraph: {
      title: name,
      description: metaDescription,
      images: product.image_url ? [{ url: product.image_url, width: 600, height: 800 }] : [],
      type: "website",
      siteName: "متجر التفرّد | Tafarud Store",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: metaDescription,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const locale = await getLocale();
  const t = await getTranslations("common");

  if (!product) {
    notFound();
  }

  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale);
  const categoryName = product.category
    ? getLocalizedField(product.category, "name", locale)
    : "";
  const authorName = product.author
    ? getLocalizedField(product.author, "name", locale)
    : "";

  const images = product.gallery_urls?.length
    ? [product.image_url, ...product.gallery_urls].filter(Boolean) as string[]
    : product.image_url
    ? [product.image_url]
    : [];

  let priceValidUntil: string | undefined;
  try {
    const d = new Date(product.created_at);
    d.setFullYear(d.getFullYear() + 2);
    priceValidUntil = d.toISOString().split("T")[0];
  } catch {
    priceValidUntil = undefined;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description || "",
    image: images.length > 0 ? images : product.image_url || "",
    url: `${BASE_URL}/${locale}/products/${product.id}`,
    category: categoryName || undefined,
    datePublished: product.created_at,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${locale}/products/${product.id}`,
      seller: {
        "@type": "Organization",
        name: "متجر التفرّد",
        url: BASE_URL,
      },
      priceValidUntil,
    },
    brand: {
      "@type": "Brand",
      name: "مجموعة التفرّد",
    },
    publisher: {
      "@type": "Organization",
      name: "مجموعة التفرّد",
      url: "https://altafarud.com",
    },
    inLanguage: locale === "ar" ? "ar" : "en",
    isAccessibleForFree: false,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${BASE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "المنتجات", item: `${BASE_URL}/${locale}/products` },
      { "@type": "ListItem", position: 3, name: name },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: t("home"), href: `/${locale}` },
          { label: t("products"), href: `/${locale}/products` },
          { label: name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image / Gallery */}
        {images.length > 1 ? (
          <ProductGallery images={images} name={name} />
        ) : (
          <div className="aspect-[3/4] relative bg-background rounded-2xl overflow-hidden border border-border shadow-sm group">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={name}
                fill
                className="object-contain transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjBGNEYzIi8+PC9zdmc+"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                <svg className="w-24 h-24 text-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-4 start-4">
                <Badge variant="accent">{t("featuredProducts")}</Badge>
              </div>
            )}
          </div>
        )}

        {/* Product Info */}
        <div className="space-y-6 lg:py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {categoryName && (
                <Link href={`/${locale}/categories/${product.category?.slug}`}>
                  <Badge variant="accent" className="hover:opacity-80 transition-opacity cursor-pointer">{categoryName}</Badge>
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-dark leading-tight">{name}</h1>
              {product.author && authorName && (
                <div className="space-y-1.5">
                  <Link
                    href={`/${locale}/authors/${product.author.slug}`}
                    className="inline-flex items-center gap-2.5 group/author"
                  >
                    {product.author.image_url ? (
                      <div className="w-7 h-7 relative rounded-full overflow-hidden ring-1 ring-border group-hover/author:ring-primary transition-colors">
                        <Image src={product.author.image_url} alt={authorName} fill className="object-cover" sizes="28px" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm text-muted group-hover/author:text-primary transition-colors">
                      {t("by")} {authorName}
                    </span>
                  </Link>
                  {getLocalizedField(product.author, "bio", locale) && (
                    <p className="text-xs text-muted/80 line-clamp-2 ps-9">
                      {getLocalizedField(product.author, "bio", locale)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <QRCodeShare title={name} />
              <ShareButton title={name} />
            </div>
          </div>

          <div className="flex items-baseline gap-3 bg-primary/5 px-5 py-3 rounded-xl">
            <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
          </div>

          {/* WhatsApp Order */}
          <WhatsAppButton productName={name} />
        </div>
      </div>

      {/* Tabbed Content */}
      <ProductTabs
        description={description}
        purchaseLinksSlot={<PurchaseLinks links={product.purchase_links || []} />}
        relatedProductsSlot={<RelatedProducts categoryId={product.category_id} currentProductId={product.id} />}
        hasPurchaseLinks={(product.purchase_links || []).filter(l => l.is_enabled).length > 0}
      />

      {/* Author's Other Books */}
      {product.author && (
        <AuthorBooks author={product.author} currentProductId={product.id} />
      )}

      {/* Recently Viewed */}
      <RecentlyViewed excludeProductId={product.id} />

      {/* Track view */}
      <ProductViewTracker
        product={{
          id: product.id,
          name_ar: product.name_ar,
          name_en: product.name_en,
          price: product.price,
          image_url: product.image_url,
        }}
      />
    </div>
  );
}
