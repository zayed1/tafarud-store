"use client";

import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence, LayoutGroup, useInView } from "framer-motion";
import { useRef } from "react";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

function ProductGridItem({ product, index, onQuickView }: { product: Product; index: number; onQuickView?: (product: Product) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index % 4 * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProductCard product={product} onQuickView={onQuickView} />
    </motion.div>
  );
}

export default function ProductGrid({ products, onQuickView }: ProductGridProps) {
  return (
    <LayoutGroup>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <ProductGridItem key={product.id} product={product} index={index} onQuickView={onQuickView} />
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
