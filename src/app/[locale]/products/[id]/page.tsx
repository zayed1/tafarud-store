import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import PurchaseLinks from "@/components/store/PurchaseLinks";
import Badge from "@/components/ui/Badge";
import { Product, PurchaseLink } from "@/types";

async function getProduct(id: string) {
  try {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .single();

    if (!product) return null;

    const { data: links } = await supabase
      .from("purchase_links")
      .select("*")
      .eq("product_id", id)
      .order("sort_order", { ascending: true });

    return { ...product, purchase_links: links || [] } as Product & {
      purchase_links: PurchaseLink[];
    };
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const locale = await getLocale();

  if (!product) {
    notFound();
  }

  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale);
  const categoryName = product.category
    ? getLocalizedField(product.category, "name", locale)
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-[3/4] relative bg-background rounded-2xl overflow-hidden border border-border">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {categoryName && <Badge variant="accent">{categoryName}</Badge>}
          <h1 className="text-3xl sm:text-4xl font-bold text-dark">{name}</h1>
          <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>

          {description && (
            <div className="prose max-w-none">
              <p className="text-dark-light text-lg leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            </div>
          )}

          {/* Purchase Links */}
          <div className="pt-4 border-t border-border">
            <PurchaseLinks links={product.purchase_links || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
