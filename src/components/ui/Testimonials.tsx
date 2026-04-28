"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote: "Love Noteable! Using it for a couple months. The Note Buddy mode and local transcription feels like magic.",
    name: "Eric Buess",
    role: "AI Engineer",
    accent: "#8b5cf6",
    index: "01",
  },
  {
    id: 2,
    quote: "Noteable has truly opened up Dialogue as an interface. No more frustration.",
    name: "Christian J. Ward",
    role: "Author",
    accent: "#f59e0b",
    index: "02",
  },
  {
    id: 3,
    quote: "Fantastic tool. Bossing around Note Buddy while bouncing a newborn is a lifesaver.",
    name: "Nat Eliason",
    role: "Entrepreneur",
    accent: "#10b981",
    index: "03",
  },
];

/* ── Infinite ticker — CSS-only for zero React overhead ── */
const Ticker = () => {
  const items = ["Note Buddy", "Voice Capture", "On-Device AI", "Smart Summaries", "Auto-Linking", "Private by Design"];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-3 mb-20">
      <div className="ticker-track flex gap-0 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-6 text-[11px] font-mono uppercase tracking-[0.25em] text-white/25">
            {item}
            <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Big pull-quote card (first testimonial) ── */
const HeroCard = ({ t }: { t: typeof testimonials[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative col-span-1 lg:col-span-7 bg-[#1e0f4e] border border-white/[0.1] rounded-2xl p-10 md:p-14 overflow-hidden group"
    >
      {/* Ruled lines — static divs instead of animated (3% opacity doesn't need animation) */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{ top: `${60 + i * 80}px` }}
          className="absolute left-0 right-0 h-px bg-white/[0.03]"
        />
      ))}

      {/* Giant quote mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="absolute top-6 right-8 text-[140px] leading-none font-serif select-none pointer-events-none"
        style={{ color: t.accent, opacity: 0.08 }}
      >
        "
      </motion.div>

      {/* Accent glow */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[40px] pointer-events-none transition-opacity duration-700"
        style={{ backgroundColor: t.accent, opacity: 0.06 }} />

      {/* Index */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: t.accent }}>{t.index}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Quote */}
      <p className="text-[26px] md:text-[32px] font-serif text-white/90 leading-[1.2] tracking-tight mb-12 relative z-10">
        "{t.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-[#1a1a1a]">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=1a1a1a`} alt={t.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white">{t.name}</div>
          <div className="text-[11px] font-mono uppercase tracking-widest mt-0.5" style={{ color: t.accent }}>{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Smaller stacked cards ── */
const SmallCard = ({ t, delay }: { t: typeof testimonials[0]; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className="relative bg-[#1e0f4e] border border-white/[0.1] rounded-2xl p-8 overflow-hidden group flex flex-col justify-between"
  >
    {/* Top border accent on hover */}
    <motion.div
      className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl"
      style={{ backgroundColor: t.accent }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
    />

    <div className="flex items-start justify-between mb-6">
      <span className="text-[11px] font-mono uppercase tracking-[0.3em]" style={{ color: t.accent }}>{t.index}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-20">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>

    <p className="text-[17px] font-serif text-white/75 leading-[1.4] tracking-tight mb-8 flex-1">
      "{t.quote}"
    </p>

    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-[#1a1a1a]">
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=1a1a1a`} alt={t.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-white">{t.name}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: t.accent }}>{t.role}</div>
      </div>
    </div>
  </motion.div>
);

/* ── Heading with per-word reveal ── */
const Heading = () => {
  const words = ["What", "people", "are", "saying"];
  return (
    <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-white tracking-tight leading-[1] mb-4">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.2em]">
          <motion.span
            className={`inline-block ${i === 1 ? "font-serif italic text-[#8b5cf6]" : ""}`}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
};

export const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section ref={ref} className="relative w-full bg-[#2d1b69] overflow-hidden py-16 md:py-20">

      {/* Parallax ambient */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#8b5cf6]/[0.03] rounded-full blur-[50px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[40px]" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/30">Testimonials</span>
            </motion.div>
            <Heading />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[14px] text-white/30 max-w-xs font-medium leading-relaxed md:text-right"
          >
            Real words from real people who use Noteable every day.
          </motion.p>
        </div>

        {/* ── Ticker ── */}
        <Ticker />

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <HeroCard t={testimonials[0]} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-5">
            <SmallCard t={testimonials[1]} delay={0.15} />
            <SmallCard t={testimonials[2]} delay={0.3} />
          </div>
        </div>

        {/* ── Bottom stat bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-6"
        >
          {[
            { value: "2,400+", label: "On the waitlist" },
            { value: "4.9★", label: "Average rating" },
            { value: "100%", label: "On-device privacy" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="text-[28px] font-bold text-white tracking-tight leading-none">{s.value}</span>
              <span className="text-[11px] font-mono text-white/25 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
