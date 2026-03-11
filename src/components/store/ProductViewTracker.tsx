"use client";

import { useEffect } from "react";
import { trackProductView } from "./RecentlyViewed";

interface Props {
  product: {
    id: string;
    name_ar: string;
    name_en: string;
    price: number;
    image_url: string | null;
  };
}

export default function ProductViewTracker({ product }: Props) {
  useEffect(() => {
    trackProductView(product);
  }, [product]);

  return null;
}
