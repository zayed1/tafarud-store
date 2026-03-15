import { FiltersSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 bg-border/30 rounded w-16 shimmer" />
        <div className="h-4 w-1 bg-border/30 rounded shimmer" />
        <div className="h-4 bg-border/30 rounded w-24 shimmer" />
      </div>

      {/* Title + view toggle skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-border/30 rounded-full shimmer" />
          <div className="h-9 bg-border/30 rounded-lg shimmer w-48" />
        </div>
        <div className="h-10 w-24 bg-border/30 rounded-xl shimmer" />
      </div>

      {/* Filters skeleton */}
      <FiltersSkeleton />

      {/* Products grid skeleton */}
      <ProductGridSkeleton count={12} />
    </div>
  );
}
