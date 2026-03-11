"use client";

import { motion } from "framer-motion";

function Shimmer({ className }: { className: string }) {
  return (
    <motion.div
      className={`bg-border/30 shimmer ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <Shimmer className="aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-5 rounded-lg w-3/4" />
        <Shimmer className="h-5 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden">
      <Shimmer className="aspect-[4/3]" />
    </div>
  );
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <CategoryCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <motion.div
      className="space-y-4 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 rounded w-20" />
        <Shimmer className="h-8 rounded-lg w-32" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Shimmer key={i} className="h-9 rounded-full w-20 flex-shrink-0" />
        ))}
      </div>
    </motion.div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center gap-2 mb-8">
        <Shimmer className="h-4 rounded w-16" />
        <Shimmer className="h-4 w-4 rounded-full" />
        <Shimmer className="h-4 rounded w-20" />
        <Shimmer className="h-4 w-4 rounded-full" />
        <Shimmer className="h-4 rounded w-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Shimmer className="aspect-[3/4] rounded-2xl" />
        <div className="space-y-6">
          <Shimmer className="h-6 rounded-full w-24" />
          <Shimmer className="h-10 rounded-lg w-3/4" />
          <Shimmer className="h-12 rounded-xl w-40" />
          <div className="space-y-3 pt-4 border-t border-border">
            <Shimmer className="h-4 rounded w-full" />
            <Shimmer className="h-4 rounded w-5/6" />
            <Shimmer className="h-4 rounded w-4/6" />
          </div>
          <Shimmer className="h-14 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
