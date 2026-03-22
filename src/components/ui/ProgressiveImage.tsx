"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

// Tiny SVG placeholder with blur
const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PC9zdmc+";

export default function ProgressiveImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Blur placeholder layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url(${BLUR_PLACEHOLDER})`,
          backgroundSize: "cover",
          filter: "blur(8px)",
          transform: "scale(1.05)",
        }}
      />
      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        sizes={sizes}
        onLoad={handleLoad}
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
      />
    </div>
  );
}
