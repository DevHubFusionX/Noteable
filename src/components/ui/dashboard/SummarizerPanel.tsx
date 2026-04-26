"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, FileText, Copy, Check, ChevronDown } from "lucide-react";
import { useNotes } from "@/lib/hooks";
import { useSummarize } from "@/lib/hooks/useSummarize";
import { useCreateNote } from "@/lib/hooks";
import { noteGroupName, noteGroupColor } from "@/lib/utils/noteGroup";

const SKELETON_WIDTHS = [100, 88, 94, 76, 60];

interface SummarizerPanelProps { open: boolean; onClose: () => void; }

export const SummarizerPanel = ({ open, onClose }: SummarizerPanelProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied,     setCopied]     = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);

  const { data: notes = [] }  = useNotes();
  const createNote            = useCreateNote();

  // Pick first note as default once loaded
  const effectiveId   = selectedId ?? notes[0]?.id ?? null;
  const selectedNote  = notes.find(n => n.id === effectiveId) ?? null;

  const { data: summary, isFetching, refetch } = useSummarize(effectiveId);

  const phase: "idle" | "loading" | "done" =
    isFetching ? "loading" : summary ? "done" : "idle";

  const handleClose = () => {
    onClose();
    setTimeout(() => { setSelectedId(null); setCopied(false); }, 300);
  };

  const handleCopy = () => {
    if (summary?.content) navigator.clipboard.writeText(summary.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!summary) return;
    createNote.mutate(
      { title: `Summary — ${selectedNote?.title ?? "Note"}`, content: summary.content, isPinned: false, isArchived: false },
      { onSuccess: handleClose },
    );
  };

  // Split summary content into bullet points for display
  const summaryPoints = summary?.content
    ? summary.content.split(/\n+/).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-[2px] z-40" style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={handleClose} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 flex flex-col"
            style={{ background: "var(--bg-2)", borderLeft: "1px solid var(--border-2)", boxShadow: "-32px 0 80px rgba(0,0,0,0.4)" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <p className="text-[14px] font-black" style={{ color: "var(--text-1)" }}>Summarizer</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-4)" }}>AI-powered</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ color: "var(--text-4)" }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-5 flex flex-col gap-5">

              {/* Note selector */}
              <div>
                <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: "var(--text-4)" }}>Select note</p>
                <div className="relative">
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    {selectedNote && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: noteGroupColor(selectedNote) }} />
                    )}
                    <span className="text-[13px] font-medium flex-1 text-left truncate" style={{ color: "var(--text-2)" }}>
                      {selectedNote?.title ?? "Select a note…"}
                    </span>
                    <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5" style={{ color: "var(--text-4)" }} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                        className="absolute top-full mt-1.5 left-0 right-0 rounded-xl overflow-hidden z-10"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
                        {notes.map(n => (
                          <button key={n.id}
                            onClick={() => { setSelectedId(n.id); setDropOpen(false); }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[12px] transition-colors"
                            style={{ color: effectiveId === n.id ? "var(--text-1)" : "var(--text-3)", background: effectiveId === n.id ? "var(--surface-2)" : "transparent" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = effectiveId === n.id ? "var(--surface-2)" : "transparent"; }}>
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: noteGroupColor(n) }} />
                            <span className="truncate">{n.title}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Preview */}
              {selectedNote && (
                <div>
                  <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: "var(--text-4)" }}>Preview</p>
                  <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-4)" }} />
                      <span className="text-[11px] font-mono uppercase tracking-[0.15em]" style={{ color: "var(--text-4)" }}>
                        {noteGroupName(selectedNote)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {SKELETON_WIDTHS.map((w, i) => (
                        <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "var(--surface-2)" }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              <AnimatePresence mode="wait">
                {phase === "loading" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Analysing…</p>
                    <div className="relative rounded-xl p-4 overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <motion.div className="absolute left-0 right-0 h-[2px] bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]"
                        animate={{ top: ["0%", "100%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                      {SKELETON_WIDTHS.map((w, i) => (
                        <div key={i} className="h-2 rounded-full mb-2" style={{ width: `${w}%`, background: "var(--surface-2)" }} />
                      ))}
                    </div>
                  </motion.div>
                )}
                {phase === "done" && summaryPoints.length > 0 && (
                  <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Summary</p>
                      <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] font-mono transition-colors"
                        style={{ color: "var(--text-3)" }}>
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {summaryPoints.map((point, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.25 }}
                          className="flex gap-3 p-3.5 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>{point}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
              {phase !== "done" ? (
                <motion.button
                  onClick={() => refetch()}
                  disabled={phase === "loading" || !effectiveId}
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-black text-[12px] font-black uppercase tracking-widest shadow-[0_4px_14px_rgba(245,158,11,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <Zap className="w-3.5 h-3.5" />
                  {phase === "loading" ? "Summarising…" : "Summarise Note"}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  disabled={createNote.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 text-white text-[12px] font-black uppercase tracking-widest shadow-[0_4px_14px_rgba(139,92,246,0.4)] disabled:opacity-60 transition-all">
                  <Check className="w-3.5 h-3.5" /> Save Summary as Note
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
