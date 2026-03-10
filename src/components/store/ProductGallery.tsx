"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-[3/4] relative bg-background rounded-2xl overflow-hidden border border-border shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[selectedIndex]}
              alt={`${name} - ${selectedIndex + 1}`}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={selectedIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
              index === selectedIndex
                ? "border-primary shadow-md"
                : "border-border hover:border-muted opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${name} - ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
