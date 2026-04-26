"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AuthModal } from "./AuthModal";

const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(18)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        style={{ top: `${i * 60 + 60}px`, originX: 0 }}
        className="absolute left-0 right-0 h-px bg-slate-900/[0.04]"
      />
    ))}
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ originY: 0 }}
      className="absolute left-[80px] top-0 bottom-0 w-px bg-red-400/25"
    />
  </div>
);

const CursorGlow = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 50, damping: 20 });
  const sy = useSpring(y, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      className="absolute w-[700px] h-[700px] rounded-full bg-main/[0.04] blur-[140px] pointer-events-none z-0"
      style={{ left: useTransform(sx, v => v - 350), top: useTransform(sy, v => v - 350) }}
    />
  );
};

// ── The hero text SVG ──────────────────────────────────────────────────────
const HeroText = () => {
  const W = 1400;
  const H = 260;

  return (
    <div className="relative w-full select-none" style={{ height: "clamp(120px, 20vw, 260px)" }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* Clip to full word for water */}
          <clipPath id="full-clip">
            <text x="0" y="90%" fontFamily="Mulish, sans-serif" fontWeight="900" fontSize="240" letterSpacing="-8">
              NOTEABLE
            </text>
          </clipPath>

          {/* Clip to only "ABLE" for solid fill */}
          <clipPath id="able-clip">
            <text x="0" y="90%" fontFamily="Mulish, sans-serif" fontWeight="900" fontSize="240" letterSpacing="-8">
              NOTEABLE
            </text>
          </clipPath>

          {/* Water fill mask — animates upward */}
          <mask id="water-mask">
            <motion.rect
              x="0" width={W}
              initial={{ y: H, height: 0 }}
              animate={{ y: 0, height: H }}
              transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              fill="white"
            />
          </mask>
        </defs>

        {/* ── Layer 1: full outlined ghost ── */}
        <text
          x="0" y="90%"
          fontFamily="Mulish, sans-serif" fontWeight="900" fontSize="240" letterSpacing="-8"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        >
          NOTEABLE
        </text>

        {/* ── Layer 2: water waves clipped to text, masked to rise up ── */}
        <g clipPath="url(#full-clip)" mask="url(#water-mask)">
          {/* base */}
          <rect x="0" y="0" width={W} height={H} fill="#8b5cf6" opacity="0.15" />

          {/* wave 1 */}
          <motion.path
            fill="#8b5cf6" opacity="0.7"
            animate={{ x: [0, -W] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            d={`M0,130 Q${W*.125},100 ${W*.25},130 Q${W*.375},160 ${W*.5},130 Q${W*.625},100 ${W*.75},130 Q${W*.875},160 ${W},130 Q${W*1.125},100 ${W*1.25},130 Q${W*1.375},160 ${W*1.5},130 Q${W*1.625},100 ${W*1.75},130 Q${W*1.875},160 ${W*2},130 L${W*2},${H} L0,${H} Z`}
          />
          {/* wave 2 */}
          <motion.path
            fill="#7c3aed" opacity="0.45"
            animate={{ x: [-W * .5, -W * 1.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            d={`M0,148 Q${W*.125},120 ${W*.25},148 Q${W*.375},176 ${W*.5},148 Q${W*.625},120 ${W*.75},148 Q${W*.875},176 ${W},148 Q${W*1.125},120 ${W*1.25},148 Q${W*1.375},176 ${W*1.5},148 Q${W*1.625},120 ${W*1.75},148 Q${W*1.875},176 ${W*2},148 L${W*2},${H} L0,${H} Z`}
          />
          {/* wave 3 shimmer */}
          <motion.path
            fill="#a78bfa" opacity="0.3"
            animate={{ x: [0, -W] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
            d={`M0,115 Q${W*.125},88 ${W*.25},115 Q${W*.375},142 ${W*.5},115 Q${W*.625},88 ${W*.75},115 Q${W*.875},142 ${W},115 Q${W*1.125},88 ${W*1.25},115 Q${W*1.375},142 ${W*1.5},115 Q${W*1.625},88 ${W*1.75},115 Q${W*1.875},142 ${W*2},115 L${W*2},${H} L0,${H} Z`}
          />
        </g>

        {/* ── Layer 3: purple stroke on top of water ── */}
        <text
          x="0" y="90%"
          fontFamily="Mulish, sans-serif" fontWeight="900" fontSize="240" letterSpacing="-8"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2"
          opacity="0.5"
        >
          NOTEABLE
        </text>

        {/* ── Layer 4: "NOTE" solid dark, "ABLE" stays outlined ── */}
        <motion.text
          x="0" y="90%"
          fontFamily="Mulish, sans-serif" fontWeight="900" fontSize="240" letterSpacing="-8"
          fill="#0d0d12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          NOTE
        </motion.text>

        {/* Handwritten annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <path
            d="M 920 40 Q 960 20 990 50"
            stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"
          />
          <path d="M 985 44 L 990 50 L 983 53" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
          <text x="870" y="28" fontFamily="Georgia, serif" fontSize="16" fill="#8b5cf6" opacity="0.5" fontStyle="italic">
            AI-powered
          </text>
        </motion.g>
      </svg>

      {/* Wipe reveal */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
        style={{ originX: 0 }}
        className="absolute inset-0 bg-background z-10"
      />
    </div>
  );
};

export const Hero = () => {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col justify-center">
    <RuledLines />
    <CursorGlow />

    <div className="relative z-10 w-full px-5 md:px-16 lg:px-24 flex flex-col gap-8 pt-28 pb-20">

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2.5"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-main animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400">
          Privacy-first AI workspace
        </span>
      </motion.div>

      {/* Hero text */}
      <HeroText />

      {/* Sub + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.6 }}
        className="flex flex-col gap-8"
      >
        {/* Sub */}
        <div className="flex items-start gap-3 max-w-sm">
          <div className="w-px h-10 bg-main/40 shrink-0 mt-1" />
          <p className="text-[15px] text-slate-400 leading-relaxed font-medium">
            An AI notepad that{" "}
            <span className="text-slate-800 font-semibold">thinks with you.</span>
            {" "}Everything stays{" "}
            <span className="italic font-serif text-main">on your device.</span>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <button
            onClick={() => setAuthOpen(true)}
            className="group relative overflow-hidden rounded-full bg-slate-900 text-white px-8 py-3.5 text-[13px] font-bold uppercase tracking-widest shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="relative z-10">Get Early Access</span>
            <motion.div
              className="absolute inset-0 bg-main"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </button>

          <a
            href="#features"
            className="group flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
          >
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              ↓
            </motion.span>
            How it works
          </a>
        </div>
      </motion.div>

    </div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-8 rounded-full border border-slate-200 flex items-start justify-center pt-1.5"
      >
        <div className="w-1 h-1.5 rounded-full bg-slate-300" />
      </motion.div>
    </motion.div>
  </section>
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};
