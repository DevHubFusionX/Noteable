"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, FileText, Mic, Sparkles, Plus, ArrowRight } from "lucide-react";
import { useNotes } from "@/lib/hooks";
import { noteGroupName, noteGroupColor } from "@/lib/utils/noteGroup";

const ACTIONS = [
  { id: "new",    label: "New note",        icon: <Plus className="w-3.5 h-3.5" />,     shortcut: "⌘N",  href: "/dashboard/note" },
  { id: "voice",  label: "Voice capture",   icon: <Mic className="w-3.5 h-3.5" />,      shortcut: "⌘⇧V", href: null },
  { id: "buddy",  label: "Open Note Buddy", icon: <Sparkles className="w-3.5 h-3.5" />, shortcut: "⌘⇧B", href: "/dashboard/buddy" },
  { id: "search", label: "Semantic search", icon: <Search className="w-3.5 h-3.5" />,   shortcut: "⌘F",  href: null },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onVoiceCapture: () => void;
  onSearch: () => void;
}

const ALLOWED_PATHS = ["/dashboard"];

const isSafeHref = (href: string | null): href is string =>
  href !== null && ALLOWED_PATHS.some(p => href.startsWith(p));

export const CommandPalette = ({ open, onClose, onVoiceCapture, onSearch }: Props) => {
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState(0);
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allNotes = [] } = useNotes({ searchQuery: query || undefined });

  useEffect(() => {
    if (open) { setQuery(""); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const filteredNotes = allNotes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    noteGroupName(n).toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = ACTIONS.filter(a =>
    !query || a.label.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [
    ...filteredActions.map(a => ({ type: "action" as const, ...a })),
    ...filteredNotes.map(n => ({
      type:     "note" as const,
      id:       n.id,
      label:    n.title,
      group:    noteGroupName(n),
      color:    noteGroupColor(n),
      href:     `/dashboard/note?id=${n.id}`,
      shortcut: "",
    })),
  ];

  const execute = (item: typeof allItems[0]) => {
    if (item.type === "action") {
      if (item.id === "voice")  { onClose(); onVoiceCapture(); return; }
      if (item.id === "search") { onClose(); onSearch();       return; }
    }
    if (isSafeHref(item.href)) router.push(item.href);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")    { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, allItems.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && allItems[selected]) execute(allItems[selected]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, allItems]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background:  "var(--bg-2)",
              border:      "1px solid var(--border-2)",
              boxShadow:   "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-4)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search notes or run a command…"
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: "var(--text-1)" }}
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-4)" }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
              {allItems.length === 0 && (
                <p className="text-center py-8 text-[13px]" style={{ color: "var(--text-4)" }}>
                  No results for &quot;{query}&quot;
                </p>
              )}

              {filteredActions.length > 0 && (
                <div className="mb-1">
                  <p className="px-4 py-1.5 text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Actions</p>
                  {filteredActions.map((action, i) => {
                    const isSelected = selected === i;
                    return (
                      <button key={action.id}
                        onClick={() => execute({ type: "action", ...action })}
                        onMouseEnter={() => setSelected(i)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                        style={{ background: isSelected ? "var(--surface-2)" : "transparent" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>
                          {action.icon}
                        </div>
                        <span className="flex-1 text-[13px] font-medium" style={{ color: "var(--text-1)" }}>{action.label}</span>
                        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-4)" }}>
                          {action.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredNotes.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Notes</p>
                  {filteredNotes.map((note, i) => {
                    const idx        = filteredActions.length + i;
                    const isSelected = selected === idx;
                    const color      = noteGroupColor(note);
                    const group      = noteGroupName(note);
                    return (
                      <button key={note.id}
                        onClick={() => execute({ type: "note", id: note.id, label: note.title, group, color, href: `/dashboard/note?id=${note.id}`, shortcut: "" })}
                        onMouseEnter={() => setSelected(idx)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                        style={{ background: isSelected ? "var(--surface-2)" : "transparent" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${color}18` }}>
                          <FileText className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-1)" }}>{note.title}</p>
                          {group && <p className="text-[10px] font-mono" style={{ color }}>{group}</p>}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-4)" }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
              {[["↑↓", "navigate"], ["↵", "open"], ["esc", "close"]].map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-4)" }}>{key}</kbd>
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-4)" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
