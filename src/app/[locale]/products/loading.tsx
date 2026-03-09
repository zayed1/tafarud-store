import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-border/30 rounded-full shimmer" />
        <div className="h-9 bg-border/30 rounded-lg shimmer w-48" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
