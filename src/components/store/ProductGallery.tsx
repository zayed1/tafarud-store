"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ImageLightbox from "./ImageLightbox";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const handleImageChange = (index: number) => {
    setSelectedIndex(index);
    setIsZooming(false);
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        ref={containerRef}
        className={`aspect-[3/4] relative bg-background rounded-2xl overflow-hidden border border-border shadow-sm ${isZooming ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsZooming(false)}
      >
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
              className="object-contain transition-transform duration-300"
              style={isZooming ? {
                transform: "scale(2.5)",
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              } : undefined}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={selectedIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        {/* Fullscreen button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="absolute top-3 end-3 z-10 bg-dark/50 hover:bg-dark/70 text-white p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Fullscreen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
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

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        name={name}
      />
    </div>
  );
}
