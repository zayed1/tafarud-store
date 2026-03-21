"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const STORAGE_KEY = "tafarud_loaded";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const loaded = sessionStorage.getItem(STORAGE_KEY);
    if (!loaded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
      const timer = setTimeout(() => setShow(false), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-gradient-to-br from-primary-dark via-primary to-secondary flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 start-1/4 w-64 h-64 bg-accent rounded-full blur-3xl opacity-15" />
            <div className="absolute bottom-1/4 end-1/4 w-80 h-80 bg-white rounded-full blur-3xl opacity-5" />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Logo with pulse */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/main/iconn.png"
                  alt="Tafarud"
                  width={80}
                  height={80}
                  className="drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Store name */}
            <motion.p
              className="text-white/90 text-xl font-bold mt-5 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              متجر التفرّد
            </motion.p>

            {/* Loading dots */}
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 bg-white/50 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
