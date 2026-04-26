"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, FileText, RotateCcw, ChevronRight, Mic, X, Plus, PanelRight } from "lucide-react";
import { TopBar } from "@/components/ui/dashboard/TopBar";
import { usePinnedNotes } from "@/lib/hooks";
import { useMessages, useSendMessage } from "@/lib/hooks/useMessages";
import { Note } from "@/lib/api/types";

// ── Constants ──────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What themes connect my recent notes?",
  "Summarise my Work notes this week",
  "What action items am I missing?",
  "Find contradictions in my research",
];

const GROUP_COLORS: Record<string, string> = {
  Work:     "#8b5cf6",
  Research: "#0ea5e9",
  Personal: "#10b981",
  Ideas:    "#f59e0b",
};

const noteColor = (note: Note) =>
  (note.group as { color?: string } | null)?.color ??
  GROUP_COLORS[(note.group as { name?: string } | null)?.name ?? ""] ??
  "#8b5cf6";

// ── Types ──────────────────────────────────────────────────────────────────

type Citation = { noteId: string; title: string; color: string };
type Msg = { id: string; role: "user" | "ai"; text: string; citations?: Citation[]; thinking?: boolean };

const SEED: Msg[] = [{
  id: "0", role: "ai",
  text: "Hey — I've read through your notes. I'm seeing some interesting threads worth pulling on. What's on your mind?",
}];

// ── Sub-components ─────────────────────────────────────────────────────────

const Dots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map(i => (
      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.9, delay: i * 0.18, repeat: Infinity }} />
    ))}
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────

export default function BuddyPage() {
  const [msgs, setMsgs]           = useState<Msg[]>(SEED);
  const [input, setInput]         = useState("");
  const [contextOpen, setContextOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Real data ──────────────────────────────────────────────────────────
  const { data: pinnedNotes = [] } = usePinnedNotes();
  const [contextNotes, setContextNotes] = useState<Note[]>([]);

  // Seed context from pinned notes once loaded
  useEffect(() => {
    if (pinnedNotes.length > 0 && contextNotes.length === 0) {
      setContextNotes(pinnedNotes.slice(0, 3));
    }
  }, [pinnedNotes]);

  // Use first context note's id as the chat thread
  const activeNoteId = contextNotes[0]?.id ?? null;
  const sendMessage  = useSendMessage(activeNoteId);

  // Load existing message history for the active note
  const { data: history } = useMessages(activeNoteId);

  // Seed msgs from API history on first load
  useEffect(() => {
    if (!history?.records.length) return;
    const mapped: Msg[] = history.records.map(m => ({
      id:   m.id,
      role: m.role === "model" ? "ai" : "user",
      text: m.content,
    }));
    setMsgs([SEED[0], ...mapped]);
  }, [history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // ── Send ───────────────────────────────────────────────────────────────
  const send = (text: string) => {
    if (!text.trim() || sendMessage.isPending) return;

    const userMsg: Msg = { id: Date.now().toString(), role: "user", text: text.trim() };
    const thinkingMsg: Msg = { id: "thinking", role: "ai", text: "", thinking: true };
    setMsgs(p => [...p, userMsg, thinkingMsg]);
    setInput("");

    sendMessage.mutate(text.trim(), {
      onSuccess: (reply) => {
        setMsgs(p => p.filter(m => m.id !== "thinking").concat({
          id:   reply.id,
          role: "ai",
          text: reply.content,
        }));
      },
      onError: () => {
        setMsgs(p => p.filter(m => m.id !== "thinking").concat({
          id:   Date.now().toString(),
          role: "ai",
          text: "Something went wrong. Please try again.",
        }));
      },
    });
  };

  // ── Context panel ──────────────────────────────────────────────────────
  const ContextPanel = () => (
    <div className="flex flex-col h-full w-60 shrink-0" style={{ background: "var(--bg-2)", borderLeft: "1px solid var(--border)" }}>
      <div className="px-4 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Context</p>
          <p className="text-[13px] font-black mt-0.5" style={{ color: "var(--text-1)" }}>Active Notes</p>
        </div>
        <button onClick={() => setContextOpen(false)} className="md:hidden p-1 rounded-lg transition-all" style={{ color: "var(--text-4)" }}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-none">
        <AnimatePresence>
          {contextNotes.map(n => {
            const color = noteColor(n);
            const groupName = (n.group as { name?: string } | null)?.name ?? "";
            return (
              <motion.div key={n.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                className="group flex flex-col gap-1 p-3 rounded-xl transition-all cursor-pointer"
                style={{ background: "var(--surface)", border: `1px solid ${color}25` }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--surface)")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em]" style={{ color }}>{groupName}</span>
                  </div>
                  <button onClick={() => setContextNotes(p => p.filter(x => x.id !== n.id))}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all" style={{ color: "var(--text-4)" }}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className="text-[12px] font-semibold line-clamp-1" style={{ color: "var(--text-2)" }}>{n.title}</p>
                <p className="text-[10px] line-clamp-2" style={{ color: "var(--text-3)" }}>{n.content}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add from pinned notes not already in context */}
        {pinnedNotes.filter(n => !contextNotes.find(c => c.id === n.id)).slice(0, 3).map(n => (
          <button key={n.id}
            onClick={() => setContextNotes(p => [...p, n])}
            className="flex items-center gap-2 p-3 rounded-xl border border-dashed transition-all text-[11px] font-medium text-left"
            style={{ borderColor: "var(--border)", color: "var(--text-4)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-4)"; }}>
            <Plus className="w-3 h-3 shrink-0" />
            <span className="truncate">{n.title}</span>
          </button>
        ))}

        {pinnedNotes.length === 0 && contextNotes.length === 0 && (
          <p className="text-[11px] font-mono text-center py-4" style={{ color: "var(--text-4)" }}>
            No pinned notes yet
          </p>
        )}
      </div>

      <div className="px-4 py-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[9px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-4)" }}>Scope</p>
        {[{ l: "Notes in context", v: `${contextNotes.length}` }, { l: "Total pinned", v: `${pinnedNotes.length}` }].map(s => (
          <div key={s.l} className="flex justify-between mb-1">
            <span className="text-[11px]" style={{ color: "var(--text-3)" }}>{s.l}</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--text-2)" }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar view="grid" setView={() => {}} onNewNote={() => {}} />

      <div className="flex flex-1 min-h-0 overflow-hidden flex-row-reverse">
        {/* Desktop context panel */}
        <div className="hidden md:flex"><ContextPanel /></div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {contextOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setContextOpen(false)} />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed right-0 top-0 bottom-0 z-50 md:hidden">
                <ContextPanel />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat */}
        <div className="relative flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Sub-header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-[0_4px_14px_rgba(139,92,246,0.4)]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2" style={{ borderColor: "var(--bg-2)" }} />
              </div>
              <div>
                <p className="text-[14px] font-black" style={{ color: "var(--text-1)" }}>Note Buddy</p>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-4)" }}>
                  AI · {contextNotes.length} notes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMsgs(SEED)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all"
                style={{ color: "var(--text-3)", border: "1px solid transparent" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:block">Clear</span>
              </button>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/25 text-[11px] font-mono text-violet-400">
                <Sparkles className="w-3 h-3" /> On-device
              </div>
              <button onClick={() => setContextOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono transition-all"
                style={{ color: "var(--text-3)", border: "1px solid var(--border)" }}>
                <PanelRight className="w-3.5 h-3.5" />
                <span className="text-[10px]">{contextNotes.length}</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 scrollbar-none">
            {msgs.length === 1 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-1">
                <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "var(--text-4)" }}>Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] transition-all"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}>
                      <ChevronRight className="w-3 h-3" style={{ color: "var(--text-4)" }} />{s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {msgs.map(msg => msg.role === "ai" ? (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="flex gap-3 items-start">
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-[0_4px_12px_rgba(139,92,246,0.35)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <motion.div className="absolute inset-0 rounded-xl border border-violet-400/30"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2.4, repeat: Infinity }} />
                </div>
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed"
                    style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                    {msg.thinking ? <Dots /> : msg.text}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map(c => (
                        <motion.button key={c.noteId} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all hover:opacity-80"
                          style={{ color: c.color, background: `${c.color}15`, borderColor: `${c.color}30` }}>
                          <FileText className="w-2.5 h-2.5" />{c.title}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-[13px] leading-relaxed font-medium"
                  style={{ background: "var(--text-1)", color: "var(--bg)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-3 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-end gap-2 p-3 rounded-2xl transition-all"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}>
              <div className="flex items-center gap-1 shrink-0 self-end pb-0.5">
                {contextNotes.slice(0, 2).map(n => (
                  <div key={n.id} className="w-5 h-5 rounded-full border-2"
                    style={{ backgroundColor: noteColor(n), borderColor: "var(--bg-2)" }} title={n.title} />
                ))}
                {contextNotes.length > 2 && (
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                    style={{ background: "var(--surface-2)", borderColor: "var(--bg-2)", color: "var(--text-3)" }}>
                    +{contextNotes.length - 2}
                  </div>
                )}
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask anything about your notes…" rows={1}
                className="flex-1 resize-none bg-transparent text-[13px] focus:outline-none leading-relaxed max-h-32 scrollbar-none"
                style={{ color: "var(--text-1)" }} />
              <div className="flex items-center gap-1.5 shrink-0 self-end">
                <button className="p-2 rounded-xl transition-all" style={{ color: "var(--text-4)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-2)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
                  <Mic className="w-3.5 h-3.5" />
                </button>
                <motion.button onClick={() => send(input)} disabled={!input.trim() || sendMessage.isPending}
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  className="p-2.5 rounded-xl bg-violet-600 text-white shadow-[0_3px_12px_rgba(139,92,246,0.4)] disabled:opacity-25 disabled:cursor-not-allowed transition-all">
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
            <p className="text-center text-[10px] font-mono mt-2 tracking-wide" style={{ color: "var(--text-4)" }}>
              Reads only notes in context · on-device only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
