"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// ── Data ───────────────────────────────────────────────────────────────────

const SOLUTIONS = [
  {
    id: "students",
    label: "Students",
    emoji: "🎓",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    headline: "Study smarter,\nnot harder.",
    sub: "Noteable turns your lecture notes, voice memos, and scattered ideas into a connected knowledge base — automatically.",
    perks: ["Auto-summarise lecture notes", "Link concepts across subjects", "Voice capture in class", "Revision flashcards from notes"],
    note: "\"Finally passed my finals because Noteable connected my notes from 3 different subjects 😭\"",
    noteAuthor: "— Maya, Computer Science",
    stat: "3×",
    statLabel: "faster revision",
  },
  {
    id: "writers",
    label: "Writers",
    emoji: "✍️",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    headline: "Every idea,\ncaptured.",
    sub: "From shower thoughts to full drafts — Noteable keeps your creative flow uninterrupted and your ideas connected.",
    perks: ["Capture ideas before they vanish", "AI writing companion", "Link characters, plots & research", "Distraction-free writing mode"],
    note: "\"I wrote my entire novel outline in Noteable. The AI connections blew my mind.\"",
    noteAuthor: "— James, Fiction Author",
    stat: "10k+",
    statLabel: "words captured daily",
  },
  {
    id: "founders",
    label: "Founders",
    emoji: "🚀",
    color: "#f59e0b",
    bg: "#fffbeb",
    headline: "Think at the\nspeed of build.",
    sub: "Strategy, meeting notes, product ideas — all connected. Noteable is the second brain every founder needs.",
    perks: ["Meeting notes → action items", "Strategy docs linked to tasks", "Investor pitch research hub", "Team knowledge base"],
    note: "\"Noteable replaced 4 different tools for me. My thinking is finally organised.\"",
    noteAuthor: "— Priya, YC Founder",
    stat: "4×",
    statLabel: "tools replaced",
  },
  {
    id: "researchers",
    label: "Researchers",
    emoji: "🔬",
    color: "#10b981",
    bg: "#f0fdf4",
    headline: "Connect the\ndots faster.",
    sub: "Noteable finds patterns across your research papers, field notes, and hypotheses — so you can focus on discovery.",
    perks: ["Semantic search across papers", "Auto-link related findings", "Citation management", "Private — zero data leaks"],
    note: "\"The semantic search found a connection I'd been missing for 6 months.\"",
    noteAuthor: "— Dr. Chen, Neuroscience",
    stat: "6mo",
    statLabel: "of research connected",
  },
];

const USE_CASES = [
  { icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z", title: "Daily Journaling", desc: "Build a private habit. Your thoughts, your device." },
  { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", title: "Team Knowledge", desc: "Shared notes that stay on your team's devices." },
  { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", title: "Project Planning", desc: "Link ideas to tasks. See the full picture." },
  { icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", title: "Meeting Notes", desc: "Voice capture → structured notes in seconds." },
  { icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22", title: "Open Source", desc: "Contribute to Noteable. Build in public." },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Privacy First", desc: "Zero cloud. Your data never leaves your device." },
];

// ── Components ─────────────────────────────────────────────────────────────

const RuledLines = ({ count = 12, opacity = 0.04 }: { count?: number; opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-slate-900" style={{ top: `${i * 56 + 40}px`, opacity }} />
    ))}
    <div className="absolute left-[72px] top-0 bottom-0 w-px bg-red-400" style={{ opacity: opacity * 6 }} />
  </div>
);

// ── Hero ───────────────────────────────────────────────────────────────────

const SolutionsHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div ref={ref} className="relative w-full min-h-[70vh] bg-background overflow-hidden flex items-end pb-20">
      <RuledLines count={14} />
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-main/[0.06] rounded-full blur-[120px]" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-main animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400">Solutions</span>
        </motion.div>

        <h1 className="text-[clamp(48px,8vw,110px)] font-bold leading-[0.88] tracking-tight mb-8">
          <span className="block overflow-hidden">
            <motion.span className="block text-slate-900" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              Built for every
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block font-serif italic text-main" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}>
              kind of thinker.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-[17px] text-slate-400 max-w-lg leading-relaxed"
        >
          Whether you're a student, founder, writer, or researcher — Noteable adapts to how <span className="text-slate-700 font-semibold">you</span> think.
        </motion.p>
      </div>
    </div>
  );
};

// ── Solution tabs ──────────────────────────────────────────────────────────

const SolutionTabs = () => {
  const [active, setActive] = useState(0);
  const sol = SOLUTIONS[active];

  return (
    <section className="w-full bg-background py-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">

        {/* Tab pills */}
        <div className="flex items-center gap-2 flex-wrap mb-16">
          {SOLUTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${active === i ? "text-white" : "text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200"}`}
            >
              {active === i && (
                <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-full" style={{ backgroundColor: sol.color }} />
              )}
              <span className="relative z-10">{s.emoji} {s.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left */}
            <div>
              <h2 className="text-[clamp(36px,5vw,64px)] font-bold leading-[0.92] tracking-tight text-slate-900 mb-6 whitespace-pre-line">
                {sol.headline}
              </h2>
              <p className="text-[16px] text-slate-500 leading-relaxed mb-10 max-w-md">{sol.sub}</p>

              <div className="flex flex-col gap-3 mb-10">
                {sol.perks.map((p, i) => (
                  <motion.div
                    key={p}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${sol.color}20` }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={sol.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-[14px] text-slate-700 font-medium">{p}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[40px] font-black tracking-tight" style={{ color: sol.color }}>{sol.stat}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{sol.statLabel}</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <button
                  className="group relative overflow-hidden rounded-full px-7 py-3 text-[13px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: sol.color }}
                >
                  Get started free →
                </button>
              </div>
            </div>

            {/* Right — notebook card */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-72 h-72 rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: `${sol.color}18` }} />

              {/* Stacked paper */}
              <div className="absolute inset-4 translate-x-3 translate-y-3 rounded-2xl border border-slate-200 bg-slate-50" />
              <div className="absolute inset-4 translate-x-1.5 translate-y-1.5 rounded-2xl border border-slate-200 bg-white" />

              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-sm">
                {/* Ruled lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute left-0 right-0 h-px bg-blue-100/60" style={{ top: `${52 + i * 30}px` }} />
                  ))}
                  <div className="absolute left-[40px] top-0 bottom-0 w-px bg-red-300/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">{sol.label} · Noteable</span>
                  <div className="w-10" />
                </div>

                <div className="p-5 pl-12">
                  {/* Sticky note quote */}
                  <div
                    className="mb-5 p-4 rounded-sm shadow-[2px_3px_12px_rgba(0,0,0,0.08)] rotate-[-1deg]"
                    style={{ backgroundColor: `${sol.color}18`, borderLeft: `3px solid ${sol.color}` }}
                  >
                    <p className="text-[12px] leading-relaxed text-slate-700 italic" style={{ fontFamily: "Georgia, serif" }}>{sol.note}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-2">{sol.noteAuthor}</p>
                  </div>

                  {/* Fake note lines */}
                  {[100, 85, 92, 70].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-slate-100 mb-2.5" style={{ width: `${w}%` }} />
                  ))}

                  {/* AI chip */}
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${sol.color}12`, border: `1px solid ${sol.color}25` }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke={sol.color} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[11px] font-medium" style={{ color: sol.color }}>AI found 3 related notes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ── Use cases grid ─────────────────────────────────────────────────────────

const UseCasesGrid = () => (
  <section className="w-full bg-slate-900 py-24 relative overflow-hidden">
    <RuledLines count={14} opacity={0.06} />
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-main/10 rounded-full blur-[100px]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
      <div className="mb-14">
        <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/30 block mb-4">Use cases</span>
        <h2 className="text-[clamp(32px,5vw,60px)] font-bold text-white leading-tight tracking-tight">
          One tool,{" "}
          <span className="font-serif italic text-main">infinite</span> uses.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {USE_CASES.map((uc, i) => (
          <motion.div
            key={uc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="group relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-main/10 border border-main/20 flex items-center justify-center mb-4 group-hover:bg-main/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={uc.icon} />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-white mb-1.5">{uc.title}</h3>
            <p className="text-[13px] text-white/40 leading-relaxed">{uc.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── Comparison table ───────────────────────────────────────────────────────

const COMPARE_ROWS = [
  { feature: "On-device AI", noteable: true, notion: false, obsidian: "partial", notes: false },
  { feature: "Voice capture", noteable: true, notion: false, obsidian: false, notes: true },
  { feature: "Auto-summarise", noteable: true, notion: true, obsidian: false, notes: false },
  { feature: "Semantic search", noteable: true, notion: false, obsidian: "partial", notes: false },
  { feature: "Zero cloud", noteable: true, notion: false, obsidian: true, notes: false },
  { feature: "Free forever", noteable: true, notion: false, obsidian: true, notes: true },
  { feature: "AI note linking", noteable: true, notion: false, obsidian: "partial", notes: false },
];

const Cell = ({ val }: { val: boolean | string }) => {
  if (val === true) return <div className="w-5 h-5 rounded-full bg-main/15 flex items-center justify-center mx-auto"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>;
  if (val === "partial") return <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mx-auto"><div className="w-2 h-0.5 bg-amber-400 rounded-full" /></div>;
  return <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mx-auto"><div className="w-2 h-0.5 bg-slate-300 rounded-full rotate-45" /></div>;
};

const CompareTable = () => (
  <section className="w-full bg-background py-24">
    <div className="max-w-5xl mx-auto px-8 md:px-16">
      <div className="mb-14 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400 block mb-4">Why Noteable</span>
        <h2 className="text-[clamp(28px,4vw,52px)] font-bold text-slate-900 tracking-tight">
          See how we <span className="font-serif italic text-main">stack up.</span>
        </h2>
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-200">
          <div className="p-4 text-[12px] font-mono uppercase tracking-widest text-slate-400">Feature</div>
          {["Noteable", "Notion", "Obsidian", "Apple Notes"].map((app, i) => (
            <div key={app} className={`p-4 text-center text-[13px] font-bold ${i === 0 ? "text-main" : "text-slate-500"}`}>{app}</div>
          ))}
        </div>

        {COMPARE_ROWS.map((row, i) => (
          <motion.div
            key={row.feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`grid grid-cols-5 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
          >
            <div className="p-4 text-[13px] font-medium text-slate-700">{row.feature}</div>
            <div className="p-4 flex items-center justify-center"><Cell val={row.noteable} /></div>
            <div className="p-4 flex items-center justify-center"><Cell val={row.notion} /></div>
            <div className="p-4 flex items-center justify-center"><Cell val={row.obsidian} /></div>
            <div className="p-4 flex items-center justify-center"><Cell val={row.notes} /></div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA banner ─────────────────────────────────────────────────────────────

const SolutionsCTA = () => (
  <section className="w-full bg-background py-24">
    <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-slate-900 overflow-hidden p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
      >
        <RuledLines count={10} opacity={0.06} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-main/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/30 mb-4">Ready to start?</p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-bold text-white leading-tight tracking-tight mb-3">
            Your thinking deserves<br />
            <span className="font-serif italic text-main">better tools.</span>
          </h2>
          <p className="text-[15px] text-white/40 max-w-sm leading-relaxed">
            Free forever. No credit card. No cloud. Just you and your thoughts.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3 shrink-0">
          <button className="group relative overflow-hidden rounded-full bg-main text-white px-10 py-4 text-[14px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-[0_8px_32px_rgba(139,92,246,0.4)]">
            Get Early Access — Free
          </button>
          <p className="text-[11px] font-mono text-white/25 text-center uppercase tracking-widest">No credit card required</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ── Page ───────────────────────────────────────────────────────────────────

export default function SolutionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <SolutionsHero />
      <SolutionTabs />
      <UseCasesGrid />
      <CompareTable />
      <SolutionsCTA />
      <Footer />
    </div>
  );
}
