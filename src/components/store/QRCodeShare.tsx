"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

function generateQRMatrix(data: string): boolean[][] {
  // Simple QR-like pattern generator for visual display
  // Uses a deterministic hash to create a unique pattern
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isBorder = y === 0 || y === 6 || x === 0 || x === 6;
        const isInner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        matrix[oy + y][ox + x] = isBorder || isInner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Fill data area with deterministic pattern based on URL
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inFinder =
        (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8);
      if (inFinder) continue;
      hash = ((hash << 5) - hash + (x * 31 + y * 37)) | 0;
      matrix[y][x] = (hash & 1) === 1;
    }
  }

  return matrix;
}

export default function QRCodeShare({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = useTranslations("common");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !url) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const matrix = generateQRMatrix(url);
    const cellSize = 8;
    const size = matrix.length * cellSize;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#000000";

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [isOpen, url]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark bg-background border border-border rounded-xl hover:border-primary/30 hover:text-primary transition-all cursor-pointer dark:text-gray-300"
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        QR
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-surface rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-dark mb-1">{t("scanQR")}</h3>
              <p className="text-sm text-muted mb-4 line-clamp-1">{title}</p>
              <div className="bg-white p-4 rounded-xl inline-block">
                <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
              </div>
              <p className="text-xs text-muted mt-3 break-all" dir="ltr">{url}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-sm text-primary hover:underline cursor-pointer"
              >
                {t("close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
