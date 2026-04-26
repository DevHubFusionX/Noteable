"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RuledBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-blue-300/25" style={{ top: `${36 + i * 30}px` }} />
    ))}
    <div className="absolute left-[56px] top-0 bottom-0 w-px bg-red-400/30" />
  </div>
);

const HolePunches = () => (
  <div className="absolute left-0 top-0 bottom-0 w-[56px] flex flex-col justify-around py-10 pointer-events-none z-10">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="mx-auto w-4 h-4 rounded-full bg-background border border-slate-200 shadow-inner" />
    ))}
  </div>
);

export const FinalCTA = () => {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setTimeout(() => { setJoined(false); setEmail(""); }, 5000);
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-36">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-main/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Headline ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-main/70 mb-5 block">
            — Start for free, think forever
          </span>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="font-serif italic text-slate-800">Your best </span>
            <br />
            <span className="font-serif italic text-slate-800">thinking </span>
            <span className="font-mono font-normal text-slate-400 text-3xl md:text-5xl align-middle relative top-1">starts </span>
            <br />
            <span className="relative inline-block font-serif italic font-extrabold">
              <span className="text-transparent" style={{ WebkitTextStroke: "2px #0d0d12" }}>here.</span>
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-main" viewBox="0 0 160 16" fill="none" preserveAspectRatio="none">
                <motion.path
                  d="M2 12 C40 4, 100 14, 158 8"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
                <motion.path
                  d="M2 14 C60 10, 110 16, 158 12"
                  stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.35"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.75, ease: "easeOut" }}
                />
              </svg>
            </span>
          </h2>

          <p className="text-slate-500 text-base leading-relaxed max-w-sm font-medium mt-8">
            Join thousands of thinkers capturing ideas with AI that never leaves their device.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-10">
            {[["10k+", "thinkers"], ["100%", "private"], ["0", "cloud sync"]].map(([num, label]) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 font-serif">{num}</span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Notebook card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          {/* Shadow stack */}
          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-slate-200/60 -z-10" />
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-slate-100/40 -z-20" />

          <div className="relative rounded-2xl bg-white border border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            <RuledBg />
            <HolePunches />

            {/* Tape strip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-yellow-100/80 border-x border-b border-yellow-200/60 z-20" />

            <div className="relative z-10 pl-20 pr-8 pt-10 pb-8">

              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-1">New entry</p>
              <h3 className="text-xl font-bold text-slate-800 font-serif italic mb-6">Get early access</h3>

              {/* Sign here arrow */}
              <div className="flex items-center gap-2 mb-2">
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="text-main/50 shrink-0">
                  <path d="M2 9 C6 4, 14 14, 22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path d="M19 6 L23 9 L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] font-mono text-slate-400 italic">sign here</span>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all font-medium"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {joined ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[13px] font-mono text-green-700">You're on the list — we'll be in touch.</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="btn"
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden w-full bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl text-[14px] flex items-center justify-center gap-2 group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-main"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                      <span className="relative z-10">Join the waitlist</span>
                      <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">or download</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* OS buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { os: "macOS", icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" />, sub: "Apple Silicon & Intel" },
                  { os: "Windows", icon: <path d="M3 5.5L10.5 4.5V11.5H3V5.5ZM11.5 4.35L21 3V11.5H11.5V4.35ZM3 12.5H10.5V19.5L3 18.5V12.5ZM11.5 12.5H21V21L11.5 19.65V12.5Z" fill="currentColor" />, sub: "Windows 10 / 11" },
                ].map(({ os, icon, sub }) => (
                  <button key={os} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-colors group text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500 shrink-0">{icon}</svg>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-700">{os}</p>
                      <p className="text-[10px] font-mono text-slate-400">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Fine print */}
              <p className="text-[10px] font-mono text-slate-300 uppercase tracking-widest text-center mt-5">
                Free forever · No credit card · Private by default
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
