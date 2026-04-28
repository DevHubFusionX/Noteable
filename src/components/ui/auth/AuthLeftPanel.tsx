"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_PERKS } from "@/lib/authPerks";
import { AuthTab } from "./useAuthForm";

export const AuthLeftPanel = ({ tab }: { tab: AuthTab }) => {
  const [perkIndex, setPerkIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPerkIndex(i => (i + 1) % AUTH_PERKS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-[220px] md:w-[280px] shrink-0 bg-slate-900 rounded-l-2xl overflow-hidden flex flex-col justify-between p-6 md:p-8 self-stretch min-h-full">
      {/* Ruled lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 h-px bg-white/[0.04]" style={{ top: `${i * 36 + 20}px` }} />
        ))}
        <div className="absolute left-[44px] top-0 bottom-0 w-px bg-red-500/20" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-main/20 rounded-full blur-[70px] pointer-events-none" />

      {/* Logo + heading */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6 md:mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-[14px] md:text-[15px] tracking-tight text-white">Noteable</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-white font-serif italic text-[18px] md:text-[24px] font-bold leading-tight mb-2 md:mb-3">
              {tab === "signup" ? "Start thinking privately." : "Welcome back."}
            </h3>
            <p className="text-white/35 text-[11px] md:text-[12px] leading-relaxed">
              {tab === "signup" ? "Your notes, your device, your rules." : "Your thoughts are waiting for you."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cycling perk */}
      <div className="relative z-10 h-16 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={perkIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="flex items-start gap-2.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-main shrink-0 mt-1.5" />
            <span className="text-[12px] text-white/45 leading-relaxed">{AUTH_PERKS[perkIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ghost text */}
      <div
        className="absolute bottom-5 left-0 right-0 text-center select-none pointer-events-none"
        style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
      >
        NOTE
      </div>
    </div>
  );
};
