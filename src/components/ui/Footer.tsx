"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINKS_PRODUCT   = ["Download for macOS", "Download for Windows", "iOS (Waitlist)", "Changelog"];
const LINKS_COMPANY   = ["About", "Blog", "Careers", "Press"];
const LINKS_RESOURCES = ["Documentation", "Tutorials", "Community", "Support"];
const LINKS_LEGAL     = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute left-0 right-0 h-px bg-white/[0.05]"
        style={{ top: `${60 + i * 52}px` }}
      />
    ))}
  </div>
);

const SpiralBinding = () => (
  <div
    className="absolute left-0 top-0 w-10 sm:w-14 bg-[#050505] border-r border-white/[0.06] z-10 flex flex-col justify-around py-8 pointer-events-none"
    style={{ height: "calc(100% - 340px)" }}
  >
    {[...Array(14)].map((_, i) => (
      <div key={i} className="flex items-center justify-center">
        <div className="w-5 h-2.5 rounded-full border border-white/10" />
      </div>
    ))}
  </div>
);

const HolePunches = () => (
  <div
    className="absolute left-2 sm:left-7 top-0 flex flex-col justify-around py-12 pointer-events-none z-20"
    style={{ height: "calc(100% - 340px)" }}
  >
    {[...Array(6)].map((_, i) => (
      <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#050505] border border-white/10 shadow-inner" />
    ))}
  </div>
);

const BigText = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full pt-2 pb-1 relative z-30">
      <h2
        className="flex flex-nowrap whitespace-nowrap leading-[0.85] tracking-tighter uppercase select-none"
        style={{ fontSize: "clamp(56px, 16vw, 260px)" }}
      >
        {"Noteable".split("").map((char, i) => (
          <span key={i} className="inline-block" style={{ overflow: "hidden", lineHeight: 1 }}>
            <motion.span
              className="inline-block font-bold cursor-default"
              animate={triggered ? { y: 0 } : { y: "110%" }}
              initial={{ y: "110%" }}
              transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                color: i % 2 === 0 ? "rgba(255,255,255,0.88)" : "transparent",
                WebkitTextStroke: i % 2 !== 0 ? "1.5px rgba(255,255,255,0.22)" : undefined,
                display: "inline-block",
              }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </h2>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="relative w-full bg-[#050505] text-white overflow-hidden">
      <RuledLines />
      <SpiralBinding />
      <HolePunches />

      {/* Red margin line — stops before big text */}
      <div
        className="absolute left-[60px] sm:left-[88px] top-0 w-px bg-red-500/25 pointer-events-none z-10"
        style={{ height: "calc(100% - 340px)" }}
      />

      {/* Top content */}
      <div className="relative z-10 pl-14 sm:pl-24 pr-4 sm:pr-12 lg:pr-20 pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 mb-16 border-b border-white/[0.06] pb-16">

          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M2 12L22 12M4.92893 4.92893L19.0711 19.0711M19.0711 4.92893L4.92893 19.0711" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-lg tracking-tight">Noteable</span>
              <span className="text-[10px] font-mono border border-white/10 rounded-full px-2 py-0.5 text-white/30 uppercase tracking-widest">Beta</span>
            </div>
            <p className="text-[14px] text-white/40 leading-relaxed font-medium">
              The privacy-first AI workspace. Your thoughts stay on your device — always.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
                "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
              ].map((d, i) => (
                <button key={i} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
            {[
              { heading: "Product",   links: LINKS_PRODUCT,   hrefs: ["/", "/", "/", "/docs/changelog"] },
              { heading: "Company",   links: LINKS_COMPANY,   hrefs: ["/", "/resources", "/", "/"] },
              { heading: "Resources", links: LINKS_RESOURCES, hrefs: ["/docs", "/resources", "/", "/"] },
              { heading: "Legal",     links: LINKS_LEGAL,     hrefs: ["/", "/", "/"] },
            ].map(({ heading, links, hrefs }) => (
              <div key={heading} className="flex flex-col gap-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 mb-1">{heading}</div>
                {links.map((l, i) => (
                  <a key={l} href={hrefs[i] ?? "#"} className="text-[13px] text-white/50 hover:text-white transition-colors font-medium w-fit">{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Big text */}
      <BigText />

      {/* Copyright */}
      <div className="relative z-30 px-4 sm:px-8 py-5 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">
          © {new Date().getFullYear()} Noteable Inc. All rights reserved.
        </span>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          />
          <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">All systems operational</span>
        </div>
      </div>
    </footer>
  );
};
