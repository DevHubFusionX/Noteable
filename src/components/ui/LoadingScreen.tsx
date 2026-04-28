"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "NOTEABLE".split("");

export const LoadingScreen = () => {
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("loaded")) {
      setShow(false);
      return;
    }
    sessionStorage.setItem("loaded", "1");

    // Reduced from 5200ms → 2000ms for much faster time-to-interactive
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* ── Ruled lines — reduced from 16 to 6, animated as a group ── */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ top: `${i * 80 + 60}px`, originX: 0 }}
                className="absolute left-0 right-0 h-px bg-white/[0.04]"
              />
            ))}
          </div>

          {/* ── Red margin line ── */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0 }}
            className="absolute left-16 top-0 bottom-0 w-[1.5px] bg-red-500/40 pointer-events-none"
          />

          {/* ── Center content ── */}
          <div className="flex flex-col items-center gap-6 relative z-10">

            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12M4.92893 4.92893L19.0711 19.0711M19.0711 4.92893L4.92893 19.0711"
                  stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            {/* NOTEABLE letter by letter — faster stagger */}
            <div className="flex items-end gap-[2px] md:gap-1">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + i * 0.06,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="text-[clamp(40px,10vw,96px)] font-bold tracking-tighter leading-none select-none"
                  style={{ color: i % 2 === 0 ? "var(--text-1)" : "var(--main-color)" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/30"
            >
              Your mind, organised.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#8b5cf6]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.1, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* ── Exit overlay wipe ── */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: done ? 1 : 0 }}
            style={{ originY: 0 }}
            className="absolute inset-0 bg-background z-20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
