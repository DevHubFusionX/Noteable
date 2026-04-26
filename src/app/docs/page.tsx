"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// ── Data ───────────────────────────────────────────────────────────────────

const SIDEBAR = [
  {
    group: "Getting Started",
    icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7",
    items: [
      { slug: "introduction",    title: "Introduction",          badge: null },
      { slug: "installation",    title: "Installation",          badge: null },
      { slug: "quick-start",     title: "Quick Start",           badge: "New" },
      { slug: "key-concepts",    title: "Key Concepts",          badge: null },
    ],
  },
  {
    group: "Core Features",
    icon: "M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07",
    items: [
      { slug: "note-buddy",      title: "Note Buddy AI",         badge: null },
      { slug: "voice-capture",   title: "Voice Capture",         badge: null },
      { slug: "auto-summarizer", title: "Auto-Summarizer",       badge: null },
      { slug: "semantic-search", title: "Semantic Search",       badge: null },
      { slug: "thought-groups",  title: "Thought Groups",        badge: null },
    ],
  },
  {
    group: "Privacy & Security",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    items: [
      { slug: "on-device-ai",    title: "On-Device AI",          badge: null },
      { slug: "data-storage",    title: "Data Storage",          badge: null },
      { slug: "encryption",      title: "Encryption",            badge: null },
    ],
  },
  {
    group: "Integrations",
    icon: "M18 20V10 M12 20V4 M6 20v-6",
    items: [
      { slug: "import-export",   title: "Import & Export",       badge: null },
      { slug: "markdown",        title: "Markdown Support",      badge: null },
      { slug: "api",             title: "API Reference",         badge: "Beta" },
    ],
  },
  {
    group: "Advanced",
    icon: "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    items: [
      { slug: "shortcuts",       title: "Keyboard Shortcuts",    badge: null },
      { slug: "customization",   title: "Customization",         badge: null },
      { slug: "troubleshooting", title: "Troubleshooting",       badge: null },
      { slug: "changelog",       title: "Changelog",             badge: null },
    ],
  },
];

const FEATURED_DOCS = [
  {
    slug: "quick-start",
    title: "Quick Start Guide",
    desc: "Get up and running with Noteable in under 5 minutes. Install, create your first note, and let the AI do the rest.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "#8b5cf6",
    time: "5 min",
  },
  {
    slug: "note-buddy",
    title: "Note Buddy AI",
    desc: "Learn how to chat with your notes, surface hidden connections, and let the AI become your thinking partner.",
    icon: "M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07",
    color: "#0ea5e9",
    time: "8 min",
  },
  {
    slug: "voice-capture",
    title: "Voice Capture",
    desc: "Speak freely and watch your words become perfectly structured, linked notes — all processed on your device.",
    icon: "M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
    color: "#10b981",
    time: "6 min",
  },
  {
    slug: "on-device-ai",
    title: "On-Device AI & Privacy",
    desc: "Understand how Noteable keeps all your data local, what that means for your privacy, and how the AI model works.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    color: "#f59e0b",
    time: "7 min",
  },
  {
    slug: "semantic-search",
    title: "Semantic Search",
    desc: "Find notes by meaning, not just keywords. Learn how the vector search engine understands your intent.",
    icon: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
    color: "#ef4444",
    time: "5 min",
  },
  {
    slug: "api",
    title: "API Reference",
    desc: "Integrate Noteable into your own tools. Full REST API docs with examples, auth, and rate limits.",
    icon: "M18 20V10 M12 20V4 M6 20v-6",
    color: "#8b5cf6",
    time: "12 min",
  },
];

const POPULAR = [
  { slug: "shortcuts",       title: "Keyboard Shortcuts" },
  { slug: "import-export",   title: "Import & Export" },
  { slug: "thought-groups",  title: "Thought Groups" },
  { slug: "customization",   title: "Customization" },
  { slug: "troubleshooting", title: "Troubleshooting" },
];

// ── Sidebar ────────────────────────────────────────────────────────────────

const Sidebar = ({ active, setActive }: { active: string; setActive: (s: string) => void }) => {
  const [openGroups, setOpenGroups] = useState<string[]>(["Getting Started", "Core Features"]);

  const toggle = (group: string) =>
    setOpenGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--lp-text-3)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search docs…"
          className="w-full rounded-xl pl-9 pr-3 py-2 text-[13px] outline-none transition-all"
          style={{
            background: "var(--lp-card-bg-solid)",
            border: "1px solid var(--lp-border)",
            color: "var(--lp-text-1)",
          }}
        />
      </div>

      {/* Nav groups */}
      <nav className="flex flex-col gap-1">
        {SIDEBAR.map((section) => {
          const isOpen = openGroups.includes(section.group);
          return (
            <div key={section.group} className="mb-1">
              <button
                onClick={() => toggle(section.group)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] transition-colors"
                style={{ color: "var(--lp-text-3)" }}
              >
                <span>{section.group}</span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pl-3 pb-2">
                      {section.items.map((item) => {
                        const isActive = active === item.slug;
                        return (
                          <button
                            key={item.slug}
                            onClick={() => setActive(item.slug)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all"
                            style={{
                              background: isActive ? "rgba(139,92,246,0.12)" : "transparent",
                              color: isActive ? "#8b5cf6" : "var(--lp-text-2)",
                              borderLeft: isActive ? "2px solid #8b5cf6" : "2px solid transparent",
                            }}
                          >
                            <span>{item.title}</span>
                            {item.badge && (
                              <span
                                className="text-[9px] font-mono uppercase tracking-wider rounded-full px-1.5 py-0.5"
                                style={{
                                  background: item.badge === "New" ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.12)",
                                  color: item.badge === "New" ? "#10b981" : "#8b5cf6",
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

// ── Hero ───────────────────────────────────────────────────────────────────

const DocsHero = ({ search, setSearch }: { search: string; setSearch: (s: string) => void }) => (
  <div
    className="relative w-full overflow-hidden pt-36 pb-16 px-8 md:px-16 lg:px-24"
    style={{ background: "var(--lp-bg)" }}
  >
    {/* Ruled lines */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px" style={{ background: "var(--lp-ruled)", top: `${i * 56 + 40}px` }} />
      ))}
      <div className="absolute left-[72px] top-0 bottom-0 w-px" style={{ background: "var(--lp-margin)" }} />
    </div>

    {/* Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "var(--lp-glow)" }} />

    <div className="relative z-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-2 mb-6"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-main animate-pulse" />
        <span className="text-[11px] font-mono uppercase tracking-[0.28em]" style={{ color: "var(--lp-text-3)" }}>Documentation</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-[clamp(36px,6vw,72px)] font-bold tracking-tight leading-[1] mb-4"
        style={{ color: "var(--lp-text-1)" }}
      >
        How does{" "}
        <span className="font-serif italic text-main">Noteable</span>
        {" "}work?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[16px] leading-relaxed mb-10 max-w-xl mx-auto"
        style={{ color: "var(--lp-text-2)" }}
      >
        Everything you need to understand, set up, and get the most out of your AI-powered notebook.
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative max-w-lg mx-auto"
      >
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--lp-text-3)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documentation…"
          className="w-full rounded-2xl pl-12 pr-16 py-4 text-[14px] outline-none transition-all"
          style={{
            background: "var(--lp-card-bg-solid)",
            border: "1px solid var(--lp-border-2)",
            color: "var(--lp-text-1)",
            boxShadow: "var(--lp-card-shadow)",
          }}
        />
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono rounded-lg px-2 py-1"
          style={{ border: "1px solid var(--lp-border)", color: "var(--lp-text-3)" }}
        >
          ⌘K
        </div>
      </motion.div>

      {/* Popular links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex items-center justify-center gap-2 flex-wrap mt-5"
      >
        <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>Popular:</span>
        {POPULAR.map(p => (
          <Link
            key={p.slug}
            href={`/docs/${p.slug}`}
            className="text-[12px] font-medium px-3 py-1 rounded-full transition-all"
            style={{
              background: "var(--lp-card-bg-solid)",
              border: "1px solid var(--lp-border)",
              color: "var(--lp-text-2)",
            }}
          >
            {p.title}
          </Link>
        ))}
      </motion.div>
    </div>
  </div>
);

// ── Featured docs grid ─────────────────────────────────────────────────────

const FeaturedGrid = ({ search }: { search: string }) => {
  const filtered = search
    ? FEATURED_DOCS.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.desc.toLowerCase().includes(search.toLowerCase())
      )
    : FEATURED_DOCS;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[13px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--lp-text-3)" }}>
          {search ? `Results for "${search}"` : "Featured Articles"}
        </h2>
        <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>{filtered.length} articles</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={`/docs/${doc.slug}`}
                className="group flex flex-col h-full rounded-2xl p-6 transition-all"
                style={{
                  background: "var(--lp-card-bg-solid)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--lp-card-border)",
                  boxShadow: "var(--lp-card-shadow)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: `${doc.color}18`, border: `1px solid ${doc.color}28` }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={doc.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={doc.icon} />
                  </svg>
                </div>

                <h3
                  className="text-[15px] font-bold mb-2 leading-snug transition-colors group-hover:text-main"
                  style={{ color: "var(--lp-text-1)" }}
                >
                  {doc.title}
                </h3>
                <p className="text-[13px] leading-relaxed flex-1 mb-4" style={{ color: "var(--lp-text-2)" }}>
                  {doc.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>{doc.time} read</span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:bg-main group-hover:text-white"
                    style={{ background: "var(--lp-surface)", color: "var(--lp-text-3)" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* All docs list */}
      {!search && (
        <div className="mt-12">
          <h2 className="text-[13px] font-mono uppercase tracking-[0.2em] mb-6" style={{ color: "var(--lp-text-3)" }}>
            All Documentation
          </h2>
          <div className="flex flex-col gap-1">
            {SIDEBAR.map((section) => (
              <div key={section.group} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={section.icon} />
                  </svg>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--lp-text-1)" }}>{section.group}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-5">
                  {section.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/docs/${item.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all group"
                      style={{
                        background: "var(--lp-card-bg-solid)",
                        border: "1px solid var(--lp-border)",
                        color: "var(--lp-text-2)",
                      }}
                    >
                      <span className="group-hover:text-main transition-colors">{item.title}</span>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider rounded-full px-1.5 py-0.5"
                            style={{
                              background: item.badge === "New" ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.12)",
                              color: item.badge === "New" ? "#10b981" : "#8b5cf6",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--lp-text-3)" }}>
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [active, setActive] = useState("introduction");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--lp-bg)", color: "var(--lp-text-1)" }}>
      <Header />
      <DocsHero search={search} setSearch={setSearch} />

      {/* Divider */}
      <div className="w-full h-px" style={{ background: "var(--lp-border)" }} />

      {/* Main layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 flex gap-10">
        <Sidebar active={active} setActive={setActive} />
        <FeaturedGrid search={search} />
      </div>

      <Footer />
    </div>
  );
}
