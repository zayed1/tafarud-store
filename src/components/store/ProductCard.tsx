import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/types";
import { getLocalizedField, formatPrice } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const name = getLocalizedField(product, "name", locale);

  return (
    <Card hover>
      <Link href={`/${locale}/products/${product.id}`}>
        <div className="aspect-[3/4] relative bg-background">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 start-3">
              <Badge variant="accent">{t("featuredProducts")}</Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-dark text-lg line-clamp-2">{name}</h3>
          <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
          <p className="text-sm text-accent font-medium">{t("viewDetails")} &larr;</p>
        </div>
      </Link>
    </Card>
  );
}
