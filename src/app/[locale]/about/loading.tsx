export default function AboutLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 animate-pulse">
      <div className="h-4 w-32 bg-border/50 rounded mb-8" />
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-border/50 rounded-full" />
        <div className="h-8 w-48 bg-border/50 rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-5 bg-border/50 rounded w-full" />
        <div className="h-5 bg-border/50 rounded w-5/6" />
        <div className="h-5 bg-border/50 rounded w-4/6" />
        <div className="h-20 bg-border/30 rounded-xl mt-8" />
        <div className="h-5 bg-border/50 rounded w-full mt-6" />
        <div className="h-5 bg-border/50 rounded w-3/4" />
      </div>
      <div className="mt-12 p-8 bg-border/20 rounded-2xl">
        <div className="h-6 w-40 bg-border/50 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-border/30 rounded-xl" />
          <div className="h-10 bg-border/30 rounded-xl" />
          <div className="h-10 bg-border/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
