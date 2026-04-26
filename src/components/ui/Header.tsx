"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";

const FEATURES = [
  { title: "Note Buddy AI",   desc: "Chat with your notes",       icon: "M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07", href: "/docs/note-buddy" },
  { title: "Voice Capture",   desc: "Voice → structured text",    icon: "M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3", href: "/docs/voice-capture" },
  { title: "Auto-Summarizer", desc: "Distill long notes instantly",icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", href: "/docs/auto-summarizer" },
  { title: "Semantic Search", desc: "Find by meaning, not keyword",icon: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z", href: "/docs/semantic-search" },
  { title: "Thought Groups",  desc: "Organise by context",        icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z", href: "/docs/thought-groups" },
  { title: "Local Privacy",   desc: "Zero cloud, 100% on-device", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", href: "/docs/on-device-ai" },
];

const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/resources" },
  { label: "Docs",      href: "/docs"      },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 pointer-events-none"
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Pill navbar ── */}
      <div
        className="pointer-events-auto flex items-center justify-between gap-8 px-5 py-3 rounded-2xl transition-all duration-300 w-[92%] max-w-5xl"
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--lp-surface) 96%, transparent)"
            : "color-mix(in srgb, var(--lp-surface) 80%, transparent)",
          border: "1px solid var(--lp-border-2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.18), 0 1px 0 var(--lp-border)"
            : "0 2px 16px rgba(0,0,0,0.10)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-[16px] tracking-tight" style={{ color: "var(--lp-text-1)" }}>Noteable</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors"
            style={{ color: open ? "var(--lp-text-1)" : "var(--lp-text-2)" }}
            onMouseEnter={() => setOpen(true)}
          >
            Platform
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </button>

          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors"
              style={{ color: "var(--lp-text-2)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: "var(--lp-text-2)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>

          {/* CTA */}
          <button
            onClick={() => setAuthOpen(true)}
            className="group relative overflow-hidden shrink-0 rounded-xl px-5 py-2.5 text-[13px] font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
            style={{ background: "var(--lp-text-1)", color: "var(--lp-bg)" }}
          >
            <span className="relative z-10">Get Access</span>
            <motion.div
              className="absolute inset-0 bg-main"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mt-2 w-[92%] max-w-5xl rounded-2xl overflow-hidden md:hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <div className="flex flex-col p-3 gap-1">
              <button
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors text-left"
                style={{ color: "var(--lp-text-2)" }}
              >
                Platform
              </button>
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                  style={{ color: "var(--lp-text-2)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto mt-2 w-[92%] max-w-5xl rounded-2xl overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
            onMouseEnter={() => setOpen(true)}
          >
            {/* Ruled texture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-px" style={{ background: "var(--lp-ruled)", top: `${i * 36 + 20}px` }} />
              ))}
              <div className="absolute left-[48px] top-0 bottom-0 w-px" style={{ background: "var(--lp-margin)" }} />
            </div>

            <div className="relative grid grid-cols-[1fr_280px]">
              {/* Features grid */}
              <div className="p-7" style={{ background: "transparent" }}>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] mb-5" style={{ color: "var(--lp-text-3)" }}>
                  Product Capabilities
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {FEATURES.map((f, i) => (
                    <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
                      <Link
                        href={f.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-xl transition-colors"
                        style={{ color: "var(--lp-text-1)" }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d={f.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold leading-tight group-hover:text-main transition-colors" style={{ color: "var(--lp-text-1)" }}>{f.title}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--lp-text-3)" }}>{f.desc}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div
                className="p-7 flex flex-col justify-between"
                style={{ borderLeft: "1px solid var(--border)", background: "transparent" }}
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--lp-text-3)" }}>Why Noteable</p>
                  <h4 className="text-[15px] font-bold leading-snug mb-2" style={{ color: "var(--lp-text-1)" }}>
                    Built for privacy, designed for thought.
                  </h4>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--lp-text-2)" }}>
                    Your notes never touch a server. On-device AI means your thinking stays yours — always.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  {["Zero cloud storage", "On-device AI only", "No account required"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[12px] font-medium" style={{ color: "var(--lp-text-2)" }}>{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/docs"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex items-center gap-1.5 text-[12px] font-semibold text-main hover:gap-2.5 transition-all"
                >
                  Read the docs
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </motion.div>
  );
};
