"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// ── Data ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",       label: "All",       emoji: "✦",  count: 42 },
  { id: "docs",      label: "Docs",      emoji: "📄",  count: 12 },
  { id: "blog",      label: "Blog",      emoji: "✍️",  count: 9  },
  { id: "tutorials", label: "Tutorials", emoji: "🎬",  count: 8  },
  { id: "guides",    label: "Guides",    emoji: "🗺️",  count: 7  },
  { id: "videos",    label: "Videos",    emoji: "▶️",  count: 6  },
];

const FEATURED = [
  {
    cat: "docs",
    tag: "Docs",
    tagColor: "#8b5cf6",
    title: "Getting Started with Noteable",
    desc: "Everything you need to set up your workspace, import notes, and start thinking smarter in under 5 minutes.",
    readTime: "4 min read",
    date: "Jun 2025",
    hot: true,
  },
  {
    cat: "tutorials",
    tag: "Tutorial",
    tagColor: "#0ea5e9",
    title: "Build Your Second Brain in 7 Days",
    desc: "A step-by-step challenge to wire up your notes, link your ideas, and let the AI surface connections you'd never find manually.",
    readTime: "12 min read",
    date: "May 2025",
    hot: true,
  },
  {
    cat: "blog",
    tag: "Blog",
    tagColor: "#10b981",
    title: "Why On-Device AI Changes Everything",
    desc: "Cloud AI is fast. But on-device AI is private, instant, and yours. Here's why that matters more than you think.",
    readTime: "6 min read",
    date: "May 2025",
    hot: false,
  },
  {
    cat: "guides",
    tag: "Guide",
    tagColor: "#f59e0b",
    title: "The Ultimate Voice Capture Workflow",
    desc: "Capture ideas hands-free, auto-transcribe, and have Noteable structure them into linked notes — all without touching your keyboard.",
    readTime: "8 min read",
    date: "Apr 2025",
    hot: false,
  },
  {
    cat: "videos",
    tag: "Video",
    tagColor: "#ef4444",
    title: "Note Buddy AI — Full Walkthrough",
    desc: "Watch how Note Buddy connects your scattered thoughts, answers questions about your notes, and drafts summaries on demand.",
    readTime: "18 min watch",
    date: "Apr 2025",
    hot: true,
  },
  {
    cat: "docs",
    tag: "Docs",
    tagColor: "#8b5cf6",
    title: "Semantic Search: How It Works",
    desc: "Under the hood of Noteable's search engine — why keyword search fails and how meaning-based retrieval finds what you actually meant.",
    readTime: "5 min read",
    date: "Mar 2025",
    hot: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const RuledLines = ({ count = 12, opacity = 0.04 }: { count?: number; opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-slate-900" style={{ top: `${i * 56 + 40}px`, opacity }} />
    ))}
    <div className="absolute left-[72px] top-0 bottom-0 w-px bg-red-400" style={{ opacity: opacity * 6 }} />
  </div>
);

const catIcon: Record<string, string> = {
  docs:      "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  blog:      "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  tutorials: "M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z",
  guides:    "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  videos:    "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
};

// ── Hero ───────────────────────────────────────────────────────────────────

const ResourcesHero = ({ active, setActive }: { active: string; setActive: (id: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Floating ink blobs
  const blobs = [
    { w: 520, h: 520, x: "60%", top: "10%",  color: "#8b5cf6", opacity: 0.055, blur: 120 },
    { w: 320, h: 320, x: "15%", top: "40%",  color: "#0ea5e9", opacity: 0.04,  blur: 90  },
    { w: 260, h: 260, x: "80%", top: "55%",  color: "#10b981", opacity: 0.04,  blur: 80  },
  ];

  return (
    <div ref={ref} className="relative w-full min-h-[82vh] bg-background overflow-hidden flex items-end pb-0">
      <RuledLines count={16} />

      {/* Parallax blobs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w, height: b.h,
              left: b.x, top: b.top,
              backgroundColor: b.color,
              opacity: b.opacity,
              filter: `blur(${b.blur}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pt-44 pb-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-main animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400">Resources</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-[clamp(48px,8vw,108px)] font-bold leading-[0.88] tracking-tight mb-8">
          <span className="block overflow-hidden">
            <motion.span
              className="block text-slate-900"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Learn, explore,
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block font-serif italic text-main"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              get inspired.
            </motion.span>
          </span>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-[17px] text-slate-400 max-w-lg leading-relaxed mb-14"
        >
          Docs, tutorials, guides, videos & blog posts — everything you need to get the most out of{" "}
          <span className="text-slate-700 font-semibold">Noteable</span>.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="relative max-w-xl mb-14"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search docs, guides, tutorials…"
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-4 text-[14px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-slate-300 border border-slate-200 rounded-lg px-2 py-1">
            ⌘K
          </div>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                active === cat.id
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {active === cat.id && (
                <motion.div
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-slate-900"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.emoji} {cat.label}</span>
              <span className={`relative z-10 text-[10px] font-mono ${active === cat.id ? "text-white/50" : "text-slate-300"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ── Featured grid ──────────────────────────────────────────────────────────

const FeaturedGrid = ({ active }: { active: string }) => {
  const filtered = active === "all" ? FEATURED : FEATURED.filter(r => r.cat === active);

  return (
    <section className="w-full bg-background py-20">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400">
              {active === "all" ? "All resources" : CATEGORIES.find(c => c.id === active)?.label}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-[10px] font-mono bg-slate-100 text-slate-400 rounded-full px-2 py-0.5"
              >
                {filtered.length} items
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, scale: 0.92, y: 32 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all"
              >
                {/* Ruled lines texture */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="absolute left-0 right-0 h-px bg-blue-50" style={{ top: `${60 + j * 28}px` }} />
                  ))}
                  <div className="absolute left-[36px] top-0 bottom-0 w-px bg-red-200/40" />
                </div>

                {/* Card header */}
                <div className="relative p-6 pb-4">
                  {/* Icon + tag row */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${item.tagColor}15`, border: `1px solid ${item.tagColor}25` }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.tagColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={catIcon[item.cat] ?? catIcon.docs} />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.hot && (
                        <span className="text-[9px] font-mono uppercase tracking-widest bg-amber-50 text-amber-500 border border-amber-200 rounded-full px-2 py-0.5">
                          🔥 Hot
                        </span>
                      )}
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest rounded-full px-2.5 py-1"
                        style={{ backgroundColor: `${item.tagColor}12`, color: item.tagColor }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 leading-snug mb-2.5 group-hover:text-main transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Card footer */}
                <div className="relative px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-300">{item.date}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[11px] font-mono text-slate-300">{item.readTime}</span>
                  </div>
                  <motion.div
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-main group-hover:text-white transition-all"
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// ── Newsletter ─────────────────────────────────────────────────────────────

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="w-full bg-slate-50 border-y border-slate-200 py-20">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400 block mb-4">Stay in the loop</span>
          <h2 className="text-[clamp(28px,4vw,48px)] font-bold text-slate-900 tracking-tight leading-tight mb-3">
            New resources,{" "}
            <span className="font-serif italic text-main">every week.</span>
          </h2>
          <p className="text-[15px] text-slate-400 leading-relaxed mb-8">
            Tutorials, guides, and tips delivered straight to your inbox. No spam — unsubscribe anytime.
          </p>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-emerald-600 font-semibold text-[15px]"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                You&apos;re on the list!
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
                className="flex items-center gap-3 max-w-md"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-main/40 focus:ring-2 focus:ring-main/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-slate-900 text-white px-6 py-3 text-[13px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
                >
                  Subscribe
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// ── Resources CTA ──────────────────────────────────────────────────────────

const ResourcesCTA = () => (
  <section className="w-full bg-background py-24">
    <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl bg-slate-900 overflow-hidden p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
      >
        <RuledLines count={10} opacity={0.06} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-main/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/30 mb-4">Ready to build?</p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-bold text-white leading-tight tracking-tight mb-3">
            Stop reading,<br />
            <span className="font-serif italic text-main">start thinking.</span>
          </h2>
          <p className="text-[15px] text-white/40 max-w-sm leading-relaxed">
            Free forever. No credit card. No cloud. Just you and your thoughts.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3 shrink-0">
          <button className="rounded-full bg-main text-white px-10 py-4 text-[14px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-[0_8px_32px_rgba(139,92,246,0.4)]">
            Get Early Access — Free
          </button>
          <p className="text-[11px] font-mono text-white/25 text-center uppercase tracking-widest">No credit card required</p>
        </div>
      </motion.div>
    </div>
  </section>
);

// ── Page ───────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <ResourcesHero active={active} setActive={setActive} />
      <FeaturedGrid active={active} />
      <Newsletter />
      <ResourcesCTA />
      <Footer />
    </div>
  );
}
