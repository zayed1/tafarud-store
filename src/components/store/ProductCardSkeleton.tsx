export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[3/4] bg-background" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-border/50 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-border/50 rounded" />
          <div className="h-4 w-2/3 bg-border/50 rounded" />
        </div>
        <div className="h-3 w-20 bg-border/50 rounded" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-border/50 rounded" />
          <div className="h-5 w-5 bg-border/50 rounded" />
        </div>
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
