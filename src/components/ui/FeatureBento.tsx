"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Shared paper textures ──────────────────────────────────────────────────

const GraphPaperBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="graph-sm" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#8b5cf6" strokeWidth="0.5" />
      </pattern>
      <pattern id="graph-lg" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#graph-sm)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#8b5cf6" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#graph-lg)" />
  </svg>
);

const RuledBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(16)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-blue-300/30" style={{ top: `${32 + i * 28}px` }} />
    ))}
    <div className="absolute left-[52px] top-0 bottom-0 w-px bg-red-400/40" />
  </div>
);

const DotGridBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1" fill="#6b7280" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

// ── Card 1: Note Buddy AI — Graph paper ───────────────────────────────────

const CHAT = [
  { role: "ai", text: "What connections do you see in your last 3 entries?" },
  { role: "user", text: "They all circle back to focus and distraction..." },
  { role: "ai", text: "Interesting — want me to surface related notes?" },
];

const NoteBuddyCard = () => {
  const [visible, setVisible] = useState(1);

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col"
      style={{ fontFamily: "Georgia, serif" }}
      onMouseEnter={() => setVisible(3)}
      onMouseLeave={() => setVisible(1)}
    >
      <GraphPaperBg />

      {/* Tape strip */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-yellow-100/80 border-x border-b border-yellow-200/60 z-20" />

      <div className="relative z-10 flex flex-col h-full p-7 pt-9">
        <div className="mb-5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Feature 01</span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1 font-sans">Note Buddy AI</h3>
          <p className="text-sm text-slate-500 mt-1 font-sans">Chat with your notes. Uncover hidden connections.</p>
        </div>

        <div className="flex-1 flex flex-col justify-end gap-3">
          <AnimatePresence>
            {CHAT.slice(0, visible).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className={`flex gap-2.5 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${msg.role === "ai" ? "bg-[#8b5cf6]/15 text-[#8b5cf6]" : "bg-slate-100 text-slate-500"}`}>
                  {msg.role === "ai" ? "N" : "Y"}
                </div>
                <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[13px] leading-snug font-sans ${msg.role === "ai" ? "bg-[#8b5cf6]/10 text-slate-700 rounded-bl-sm" : "bg-slate-100 text-slate-600 rounded-br-sm"}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-2 bg-white/70 border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-[12px] text-slate-300 flex-1 font-sans">Ask anything about your notes…</span>
            <div className="w-6 h-6 rounded-lg bg-[#8b5cf6] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Card 2: Voice Capture — Ruled notebook page ───────────────────────────

const BARS = [3, 7, 5, 9, 4, 8, 6, 10, 3, 7, 5, 9, 4, 8];

const VoiceCard = () => {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden bg-[#fdfcf7] border border-slate-200 shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col cursor-pointer"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <RuledBg />

      {/* Spiral holes */}
      <div className="absolute left-0 top-0 bottom-0 w-[52px] flex flex-col justify-around py-8 z-10 pointer-events-none">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="mx-auto w-4 h-4 rounded-full bg-[#fdfcf7] border border-slate-300 shadow-inner" />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full pl-16 pr-6 py-7">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Feature 02</span>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">Fluid Capture</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Speak freely. Your voice becomes perfectly structured notes instantly.
        </p>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 mt-4">
          {/* Mic button */}
          <motion.div
            animate={{ scale: active ? 1.1 : 1, boxShadow: active ? "0 0 0 12px rgba(139,92,246,0.12), 0 0 0 24px rgba(139,92,246,0.06)" : "0 0 0 0px rgba(139,92,246,0)" }}
            transition={{ duration: 0.4 }}
            className="w-14 h-14 rounded-full bg-[#8b5cf6] flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </motion.div>

          {/* Waveform */}
          <div className="flex items-center gap-1 h-12">
            {BARS.map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-[#8b5cf6]"
                animate={{ height: active ? `${h * 4}px` : "6px", opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: "easeInOut", repeat: active ? Infinity : 0, repeatType: "reverse" }}
              />
            ))}
          </div>

          <motion.p
            animate={{ opacity: active ? 1 : 0 }}
            className="text-[11px] font-mono text-[#8b5cf6] uppercase tracking-widest"
          >
            Listening…
          </motion.p>
        </div>
      </div>
    </div>
  );
};

// ── Card 3: Auto-Summarizer — Index card ──────────────────────────────────

const LINES = [
  { w: "100%", highlight: false },
  { w: "88%", highlight: false },
  { w: "94%", highlight: true },
  { w: "76%", highlight: false },
  { w: "82%", highlight: false },
  { w: "60%", highlight: true },
];

const SummarizerCard = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden bg-[#fef9ec] border border-amber-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DotGridBg />

      {/* Corner fold */}
      <div className="absolute bottom-0 right-0 w-10 h-10 z-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-amber-200/60" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[38px] border-l-transparent border-b-[38px] border-b-[#fef9ec]" />
      </div>

      {/* Index card header stripe */}
      <div className="h-8 bg-red-400/15 border-b border-red-300/30 flex items-center px-5 gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-red-400/50" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400/70">Auto-Summarizer</span>
      </div>

      <div className="relative z-10 flex flex-col h-full p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-1">Smart Summaries</h3>
        <p className="text-[12px] text-slate-500 mb-4 leading-relaxed">Distill long notes into sharp bullet points instantly.</p>

        <div className="flex flex-col gap-2 relative">
          {/* Scan line */}
          <motion.div
            animate={{ top: hovered ? "100%" : "-4px", opacity: hovered ? [0, 1, 1, 0] : 0 }}
            transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-[#8b5cf6] shadow-[0_0_8px_2px_rgba(139,92,246,0.6)] z-10 pointer-events-none"
          />
          {LINES.map((line, i) => (
            <motion.div
              key={i}
              animate={{ backgroundColor: hovered && line.highlight ? "rgba(139,92,246,0.15)" : "rgba(0,0,0,0.06)" }}
              transition={{ delay: i * 0.1 }}
              className="h-2.5 rounded-full"
              style={{ width: line.width }}
            />
          ))}
        </div>

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-4 flex flex-col gap-1.5"
        >
          {["Key insight extracted", "Action item identified"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-[#8b5cf6] font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ── Card 4: Privacy — Sticky note ─────────────────────────────────────────

const PrivacyCard = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative h-full rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.08)] flex flex-col cursor-default"
      style={{ background: "linear-gradient(160deg, #fef08a 0%, #fde047 100%)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tape strip top */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-6 bg-yellow-100/60 border border-yellow-200/40 z-20 rotate-1" />

      {/* Ruled lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 h-px bg-yellow-400/40" style={{ top: `${48 + i * 26}px` }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 pt-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-700/60">Feature 04</span>
        <h3 className="text-xl font-bold text-yellow-900 mt-1" style={{ fontFamily: "Georgia, serif" }}>
          Private by Design
        </h3>
        <p className="text-[12px] text-yellow-800/70 mt-2 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
          Your thoughts never leave your device. Local-first AI, zero cloud exposure.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: hovered ? [0, -8, 8, -4, 0] : 0, scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-900/10 border-2 border-yellow-900/20 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <motion.div
              animate={{ scale: hovered ? [1, 1.4, 1] : 1, opacity: hovered ? [0.6, 0, 0.6] : 0 }}
              transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
              className="absolute inset-0 rounded-2xl border-2 border-yellow-900/30"
            />
          </motion.div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          <span className="text-[11px] font-mono text-yellow-900/60 uppercase tracking-wider">On-device only</span>
        </div>
      </div>
    </div>
  );
};

// ── Section heading ────────────────────────────────────────────────────────

const Heading = () => (
  <motion.div
    initial={{ opacity: 0, y: -24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="mb-14"
  >
    <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 mb-4 leading-[1.1]">
      {/* "Notes" — serif italic, normal color */}
      <span className="font-serif italic text-slate-800">Notes </span>
      {/* "that" — small, light, mono, offset down */}
      <span className="font-mono font-normal text-slate-400 text-2xl md:text-4xl align-middle relative top-1">that </span>
      {/* "think" — bold sans, purple */}
      <span className="font-sans font-black text-main">think </span>
      {/* line break */}
      <br />
      {/* "back" — huge, outlined/ghost text with pen underline */}
      <span className="relative inline-block font-serif italic font-extrabold">
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: "2px #0d0d12" }}
        >
          back.
        </span>
        {/* Pen underline */}
        <svg
          className="absolute -bottom-2 left-0 w-full h-4 text-main"
          viewBox="0 0 200 16"
          fill="none"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M2 12 C40 4, 100 14, 198 8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M2 14 C60 10, 120 16, 198 12"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.75, ease: "easeOut" }}
          />
        </svg>
      </span>
    </h2>
    <p className="mt-6 text-base text-slate-400 max-w-sm font-mono tracking-wide">
      — powered by AI that stays on your device
    </p>
  </motion.div>
);

// ── Main export ────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

export const FeatureBento = () => (
  <section className="relative w-full max-w-6xl mx-auto px-4 z-10">
    <Heading />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:auto-rows-[300px]">
      <motion.div className="md:col-span-2 h-[300px] md:h-full" {...fadeUp(0)}>
        <NoteBuddyCard />
      </motion.div>
      <motion.div className="md:col-span-1 md:row-span-2 h-[300px] md:h-full" {...fadeUp(0.1)}>
        <VoiceCard />
      </motion.div>
      <motion.div className="md:col-span-1 h-[300px] md:h-full" {...fadeUp(0.2)}>
        <SummarizerCard />
      </motion.div>
      <motion.div className="md:col-span-1 h-[300px] md:h-full" {...fadeUp(0.3)}>
        <PrivacyCard />
      </motion.div>
    </div>
  </section>
);
