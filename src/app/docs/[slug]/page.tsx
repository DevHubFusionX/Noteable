"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

// ── Doc content map ────────────────────────────────────────────────────────

const DOCS: Record<string, {
  title: string;
  group: string;
  readTime: string;
  updated: string;
  content: { type: "h2" | "h3" | "p" | "ul" | "callout" | "code"; text?: string; items?: string[]; variant?: "info" | "warning" | "tip" }[];
}> = {
  introduction: {
    title: "Introduction",
    group: "Getting Started",
    readTime: "3 min",
    updated: "Jun 2025",
    content: [
      { type: "p", text: "Noteable is a privacy-first AI workspace that lives entirely on your device. No cloud, no subscriptions, no data leaving your machine — just you, your notes, and an AI that thinks with you." },
      { type: "h2", text: "What makes Noteable different?" },
      { type: "ul", items: ["All AI processing happens on-device using local models", "Your notes are encrypted and never transmitted", "Works fully offline — no internet required after setup", "Connects ideas across your notes automatically"] },
      { type: "h2", text: "Core philosophy" },
      { type: "p", text: "Most note-taking apps treat your thoughts as data to be stored. Noteable treats them as ideas to be connected. The AI doesn't just summarise — it finds patterns, surfaces forgotten insights, and helps you think more clearly." },
      { type: "callout", variant: "tip", text: "New to Noteable? Start with the Quick Start guide to get your first notes set up in under 5 minutes." },
    ],
  },
  "quick-start": {
    title: "Quick Start",
    group: "Getting Started",
    readTime: "5 min",
    updated: "Jun 2025",
    content: [
      { type: "p", text: "Get Noteable running in under 5 minutes. This guide walks you through installation, your first note, and activating the AI." },
      { type: "h2", text: "Step 1 — Download" },
      { type: "p", text: "Download the latest version for your platform from the downloads page. Noteable supports macOS (Apple Silicon & Intel) and Windows 10/11." },
      { type: "h2", text: "Step 2 — Create your first note" },
      { type: "p", text: "Open Noteable and press ⌘N (macOS) or Ctrl+N (Windows) to create a new note. Start typing — no formatting required." },
      { type: "h2", text: "Step 3 — Activate Note Buddy AI" },
      { type: "p", text: "Click the sparkle icon in the top-right of any note to open Note Buddy. Ask it anything about your notes." },
      { type: "callout", variant: "info", text: "The AI model downloads on first launch (~2GB). Make sure you have a stable connection for the initial setup." },
      { type: "h2", text: "Keyboard shortcuts" },
      { type: "ul", items: ["⌘N / Ctrl+N — New note", "⌘K / Ctrl+K — Command palette", "⌘F / Ctrl+F — Semantic search", "⌘⇧V / Ctrl+Shift+V — Voice capture", "⌘⇧B / Ctrl+Shift+B — Open Note Buddy"] },
    ],
  },
  "note-buddy": {
    title: "Note Buddy AI",
    group: "Core Features",
    readTime: "8 min",
    updated: "May 2025",
    content: [
      { type: "p", text: "Note Buddy is your on-device AI companion. It reads your notes, understands context, and helps you think — without ever sending your data to a server." },
      { type: "h2", text: "What can Note Buddy do?" },
      { type: "ul", items: ["Answer questions about your notes", "Find connections between ideas across different notes", "Summarise long notes into key points", "Suggest related notes you might have forgotten", "Help you draft new content based on your existing notes"] },
      { type: "h2", text: "How to use it" },
      { type: "p", text: "Open any note and click the sparkle icon, or press ⌘⇧B. Type your question in natural language — Note Buddy understands context, so you don't need to be precise." },
      { type: "callout", variant: "tip", text: "Try asking 'What are the common themes across my notes from last week?' — Note Buddy will surface patterns you might have missed." },
      { type: "h2", text: "Privacy" },
      { type: "p", text: "Note Buddy runs entirely on your device using a quantised local language model. Your notes are never sent to any server. The model processes everything in memory and discards context after each session." },
    ],
  },
  "on-device-ai": {
    title: "On-Device AI & Privacy",
    group: "Privacy & Security",
    readTime: "7 min",
    updated: "May 2025",
    content: [
      { type: "p", text: "Noteable's core promise is simple: your thoughts never leave your device. Here's exactly how that works." },
      { type: "h2", text: "The local AI model" },
      { type: "p", text: "Noteable uses a quantised 7B parameter language model that runs entirely in RAM. It's optimised for note-taking tasks — summarisation, connection-finding, and Q&A — and requires no internet connection after the initial download." },
      { type: "h2", text: "What data is stored?" },
      { type: "ul", items: ["Notes are stored in an encrypted SQLite database on your device", "Voice recordings are transcribed locally and the audio is discarded", "Search embeddings are computed locally and stored alongside your notes", "No telemetry, no analytics, no crash reports are sent anywhere"] },
      { type: "callout", variant: "warning", text: "Noteable does not have a recovery mechanism for lost encryption keys. Back up your vault regularly." },
      { type: "h2", text: "Encryption" },
      { type: "p", text: "Your note vault is encrypted with AES-256-GCM. The encryption key is derived from your device's secure enclave and never stored in plaintext." },
    ],
  },
};

// Flat list for prev/next navigation
const ALL_SLUGS = [
  "introduction", "installation", "quick-start", "key-concepts",
  "note-buddy", "voice-capture", "auto-summarizer", "semantic-search", "thought-groups",
  "on-device-ai", "data-storage", "encryption",
  "import-export", "markdown", "api",
  "shortcuts", "customization", "troubleshooting", "changelog",
];

const SIDEBAR_GROUPS = [
  { group: "Getting Started", items: ["introduction", "installation", "quick-start", "key-concepts"] },
  { group: "Core Features",   items: ["note-buddy", "voice-capture", "auto-summarizer", "semantic-search", "thought-groups"] },
  { group: "Privacy & Security", items: ["on-device-ai", "data-storage", "encryption"] },
  { group: "Integrations",    items: ["import-export", "markdown", "api"] },
  { group: "Advanced",        items: ["shortcuts", "customization", "troubleshooting", "changelog"] },
];

const TITLES: Record<string, string> = {
  introduction: "Introduction", installation: "Installation", "quick-start": "Quick Start",
  "key-concepts": "Key Concepts", "note-buddy": "Note Buddy AI", "voice-capture": "Voice Capture",
  "auto-summarizer": "Auto-Summarizer", "semantic-search": "Semantic Search", "thought-groups": "Thought Groups",
  "on-device-ai": "On-Device AI", "data-storage": "Data Storage", encryption: "Encryption",
  "import-export": "Import & Export", markdown: "Markdown Support", api: "API Reference",
  shortcuts: "Keyboard Shortcuts", customization: "Customization", troubleshooting: "Troubleshooting",
  changelog: "Changelog",
};

// ── Content renderer ───────────────────────────────────────────────────────

const calloutStyles = {
  info:    { bg: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.25)",  color: "#0ea5e9",  label: "Note"    },
  warning: { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  color: "#f59e0b",  label: "Warning" },
  tip:     { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",  color: "#10b981",  label: "Tip"     },
};

const DocContent = ({ slug }: { slug: string }) => {
  const doc = DOCS[slug];

  if (!doc) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="text-6xl mb-4">📄</div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--lp-text-1)" }}>Coming soon</h2>
      <p className="text-[15px]" style={{ color: "var(--lp-text-2)" }}>This article is being written. Check back soon.</p>
      <Link href="/docs" className="mt-6 text-main text-[13px] font-semibold hover:underline">← Back to docs</Link>
    </div>
  );

  const idx = ALL_SLUGS.indexOf(slug);
  const prev = idx > 0 ? ALL_SLUGS[idx - 1] : null;
  const next = idx < ALL_SLUGS.length - 1 ? ALL_SLUGS[idx + 1] : null;

  return (
    <article className="flex-1 min-w-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-[12px] font-mono" style={{ color: "var(--lp-text-3)" }}>
        <Link href="/docs" className="hover:text-main transition-colors">Docs</Link>
        <span>/</span>
        <span>{doc.group}</span>
        <span>/</span>
        <span style={{ color: "var(--lp-text-1)" }}>{doc.title}</span>
      </div>

      {/* Header */}
      <div className="mb-10 pb-8" style={{ borderBottom: "1px solid var(--lp-border)" }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
            {doc.group}
          </span>
          <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>{doc.readTime} read · Updated {doc.updated}</span>
        </div>
        <h1 className="text-[clamp(28px,4vw,48px)] font-bold tracking-tight leading-tight" style={{ color: "var(--lp-text-1)" }}>
          {doc.title}
        </h1>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 max-w-2xl">
        {doc.content.map((block, i) => {
          if (block.type === "h2") return (
            <h2 key={i} className="text-[22px] font-bold mt-4" style={{ color: "var(--lp-text-1)" }}>{block.text}</h2>
          );
          if (block.type === "h3") return (
            <h3 key={i} className="text-[17px] font-semibold mt-2" style={{ color: "var(--lp-text-1)" }}>{block.text}</h3>
          );
          if (block.type === "p") return (
            <p key={i} className="text-[15px] leading-relaxed" style={{ color: "var(--lp-text-2)" }}>{block.text}</p>
          );
          if (block.type === "ul") return (
            <ul key={i} className="flex flex-col gap-2 pl-1">
              {block.items?.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-[15px]" style={{ color: "var(--lp-text-2)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-main shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          );
          if (block.type === "callout" && block.variant) {
            const s = calloutStyles[block.variant];
            return (
              <div key={i} className="flex gap-3 rounded-xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <div className="shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: s.border, color: s.color }}>!</div>
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold block mb-1" style={{ color: s.color }}>{s.label}</span>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--lp-text-2)" }}>{block.text}</p>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Prev / Next */}
      <div className="mt-16 pt-8 grid grid-cols-2 gap-4" style={{ borderTop: "1px solid var(--lp-border)" }}>
        {prev ? (
          <Link href={`/docs/${prev}`} className="group flex flex-col gap-1 p-4 rounded-xl transition-all" style={{ background: "var(--lp-card-bg-solid)", border: "1px solid var(--lp-border)" }}>
            <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>← Previous</span>
            <span className="text-[14px] font-semibold group-hover:text-main transition-colors" style={{ color: "var(--lp-text-1)" }}>{TITLES[prev]}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/docs/${next}`} className="group flex flex-col gap-1 p-4 rounded-xl text-right transition-all" style={{ background: "var(--lp-card-bg-solid)", border: "1px solid var(--lp-border)" }}>
            <span className="text-[11px] font-mono" style={{ color: "var(--lp-text-3)" }}>Next →</span>
            <span className="text-[14px] font-semibold group-hover:text-main transition-colors" style={{ color: "var(--lp-text-1)" }}>{TITLES[next]}</span>
          </Link>
        ) : <div />}
      </div>
    </article>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────

const Sidebar = ({ active }: { active: string }) => (
  <aside
    className="hidden lg:flex flex-col w-56 shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2"
    style={{ scrollbarWidth: "none" }}
  >
    <Link href="/docs" className="flex items-center gap-2 mb-6 text-[12px] font-mono transition-colors hover:text-main" style={{ color: "var(--lp-text-3)" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
      All docs
    </Link>
    <nav className="flex flex-col gap-1">
      {SIDEBAR_GROUPS.map((section) => (
        <div key={section.group} className="mb-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] px-3 py-1.5 mb-1" style={{ color: "var(--lp-text-3)" }}>{section.group}</p>
          {section.items.map((slug) => (
            <Link
              key={slug}
              href={`/docs/${slug}`}
              className="flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
              style={{
                background: active === slug ? "rgba(139,92,246,0.12)" : "transparent",
                color: active === slug ? "#8b5cf6" : "var(--lp-text-2)",
                borderLeft: active === slug ? "2px solid #8b5cf6" : "2px solid transparent",
              }}
            >
              {TITLES[slug]}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  </aside>
);

// ── Page ───────────────────────────────────────────────────────────────────

export default function DocSlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "introduction";

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--lp-bg)", color: "var(--lp-text-1)" }}>
      <Header />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 flex gap-10">
        <Sidebar active={slug} />
        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-0"
        >
          <DocContent slug={slug} />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
