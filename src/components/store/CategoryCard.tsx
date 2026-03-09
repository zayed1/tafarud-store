import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Category } from "@/types";
import { getLocalizedField } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const locale = useLocale();
  const name = getLocalizedField(category, "name", locale);

  return (
    <Card hover>
      <Link href={`/${locale}/categories/${category.slug}`}>
        <div className="aspect-square relative bg-gradient-to-br from-primary/10 to-secondary/10">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
          <div className="absolute bottom-0 start-0 end-0 p-4">
            <h3 className="text-white font-bold text-lg">{name}</h3>
          </div>
        </div>
      </Link>
    </Card>
  );
}
