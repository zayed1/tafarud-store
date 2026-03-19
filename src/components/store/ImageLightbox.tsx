"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

export default function ImageLightbox({ images, initialIndex, isOpen, onClose, name }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-10 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 start-4 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute start-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute end-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
