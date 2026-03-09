export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="aspect-[3/4] bg-border/30 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-border/30 rounded-lg shimmer w-3/4" />
        <div className="h-5 bg-border/30 rounded-lg shimmer w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="aspect-square bg-border/30 shimmer" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="h-4 bg-border/30 rounded shimmer w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-[3/4] bg-border/30 rounded-2xl shimmer" />
        <div className="space-y-6">
          <div className="h-6 bg-border/30 rounded-full shimmer w-24" />
          <div className="h-10 bg-border/30 rounded-lg shimmer w-3/4" />
          <div className="h-8 bg-border/30 rounded-lg shimmer w-1/3" />
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="h-4 bg-border/30 rounded shimmer w-full" />
            <div className="h-4 bg-border/30 rounded shimmer w-5/6" />
            <div className="h-4 bg-border/30 rounded shimmer w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
