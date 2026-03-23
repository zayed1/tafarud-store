"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md";
}

function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
}

function toggleWishlistItem(id: string): boolean {
  const list = getWishlist();
  const index = list.indexOf(id);
  if (index > -1) {
    list.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(list));
    return false;
  }
  list.push(id);
  localStorage.setItem("wishlist", JSON.stringify(list));
  return true;
}

export default function WishlistButton({ productId, size = "md" }: WishlistButtonProps) {
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    setIsWished(getWishlist().includes(productId));
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlistItem(productId);
    setIsWished(result);
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <motion.button
      onClick={handleToggle}
      className={`${btnSize} rounded-full flex items-center justify-center transition-all cursor-pointer ${
        isWished
          ? "bg-red-50 text-red-500 dark:bg-red-500/10"
          : "bg-surface/80 backdrop-blur-sm text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border border-border"
      }`}
      whileTap={{ scale: 0.85 }}
      animate={isWished ? { scale: [1, 1.3, 1] } : undefined}
      transition={{ duration: 0.3 }}
      aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg className={iconSize} viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </motion.button>
  );
}
