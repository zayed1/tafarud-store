"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";

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

    async function renderQR() {
      if (!canvasRef.current) return;
      await QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });

      // Draw store logo in center
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const logoSize = 40;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      // White background for logo area
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(x - 4, y - 4, logoSize + 8, logoSize + 8, 6);
      ctx.fill();

      // Draw "ت" as store logo
      ctx.fillStyle = "#1a7a5e";
      ctx.beginPath();
      ctx.roundRect(x, y, logoSize, logoSize, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ت", x + logoSize / 2, y + logoSize / 2);
    }

    renderQR();
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
