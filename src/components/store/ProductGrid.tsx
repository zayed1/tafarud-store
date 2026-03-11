"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export default function ProductGrid({ products, onQuickView }: ProductGridProps) {
  return (
    <LayoutGroup>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
