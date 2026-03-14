import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="w-full h-[60vh] bg-border/30 shimmer rounded-b-3xl" />

      {/* Categories skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 bg-border/30 rounded-full shimmer" />
          <div className="h-9 bg-border/30 rounded-lg shimmer w-48" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-border/30 shimmer rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 bg-border/30 rounded-full shimmer" />
          <div className="h-9 bg-border/30 rounded-lg shimmer w-56" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
