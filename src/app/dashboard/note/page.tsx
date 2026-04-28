"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { marked } from "marked";
import {
  ArrowLeft, Bold, Italic, List, ListOrdered,
  Hash, FolderOpen, Clock, Sparkles, Mic,
  Check, ChevronDown, Type, Quote, Trash2, Archive
} from "lucide-react";
import { useGroups, useCreateNote, useNote, useUpdateNote, useMoveToTrash, useToggleArchive } from "@/lib/hooks";
import { Group, Note } from "@/lib/api/types";

const NO_GROUP: Group = { id: "none", name: "No group", color: "var(--text-4)" };

// ── Glass ──────────────────────────────────────────────────────────────────
const Glass = ({ children, className = "", style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) => (
  <div className={`backdrop-blur-md ${className}`}
    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", boxShadow: "0 4px 24px var(--glass-shadow)", ...style }}>
    {children}
  </div>
);



// ── Toolbar config ────────────────────────────────────────────────────────
const TOOLBAR: { icon: React.ElementType; label: string; key: string }[][] = [
  [
    { icon: Bold,        label: "Bold",          key: "bold"    },
    { icon: Italic,      label: "Italic",        key: "italic"  },
    { icon: Type,        label: "Heading",       key: "heading" },
    { icon: Quote,       label: "Quote",         key: "quote"   },
  ],
  [
    { icon: List,        label: "Bullet list",   key: "ul"      },
    { icon: ListOrdered, label: "Numbered list", key: "ol"      },
  ],
];


// ── Toolbar button ─────────────────────────────────────────────────────────
const ToolBtn = ({ icon: Icon, label, active = false, onClick }: {
  icon: React.ElementType; label: string; active?: boolean; onClick?: () => void;
}) => (
  <motion.button onClick={onClick} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} title={label}
    className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all"
    style={{
      color: active ? "#8b5cf6" : "var(--text-3)",
      background: active ? "rgba(139,92,246,0.15)" : "transparent",
      border: active ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface-2)"; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
    <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
  </motion.button>
);

// ── Save indicator ─────────────────────────────────────────────────────────
const SaveIndicator = ({ saved, isPending }: { saved: boolean; isPending: boolean }) => (
  <AnimatePresence mode="wait">
    {isPending ? (
      <motion.div key="saving" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: "var(--text-4)" }}>
        <motion.div className="w-2 h-2 rounded-full bg-amber-400"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        Saving…
      </motion.div>
    ) : saved ? (
      <motion.div key="saved" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: "var(--text-4)" }}>
        <Check className="w-3 h-3 text-emerald-400" /> Saved
      </motion.div>
    ) : (
      <motion.div key="editing" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: "var(--text-4)" }}>
        <div className="w-2 h-2 rounded-full bg-violet-400/50" />
        Unsaved
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Voice toggle ───────────────────────────────────────────────────────────
const BARS = [3, 6, 4, 8, 5, 9, 4, 7];

const VoiceToggle = ({ onTranscript, onInterim }: { onTranscript: (text: string) => void; onInterim: (text: string) => void }) => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    onInterim(interimTranscript);
  }, [interimTranscript, onInterim]);

  useEffect(() => {
    if (!finalTranscript) return;
    onTranscript(finalTranscript);
    onInterim("");
    resetTranscript();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

  const toggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
      onInterim("");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, interimResults: true, language: "en-US" });
    }
  };

  if (!mounted || !browserSupportsSpeechRecognition) return null;

  return (
    <div className="relative flex items-center">
      {/* Live text bubble */}
      <AnimatePresence>
        {listening && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-2 max-w-[260px] px-3 py-1.5 rounded-xl text-[11px] font-mono backdrop-blur-md"
            style={{
              background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
              color: "var(--text-2)", boxShadow: "0 4px 16px var(--glass-shadow)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5 animate-pulse" />
            {"Listening…"}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={toggle} whileTap={{ scale: 0.9 }}
        animate={{ width: listening ? 76 : 36 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        style={{
          height: "36px",
          background: listening ? "rgba(239,68,68,0.15)" : "var(--glass-bg)",
          border: listening ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--glass-border)",
          boxShadow: listening ? "0 0 20px rgba(239,68,68,0.25)" : "0 4px 24px var(--glass-shadow)",
          backdropFilter: "blur(12px)",
        }}>
        <AnimatePresence mode="wait">
          {listening ? (
            <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-2.5">
              <div className="flex items-center gap-[2px] h-4">
                {BARS.map((h, i) => (
                  <motion.div key={i} className="w-[2px] rounded-full bg-red-400"
                    animate={{ height: [`${h * 2}px`, `${h * 3.5}px`, `${h * 2}px`] }}
                    transition={{ duration: 0.45 + i * 0.07, repeat: Infinity, ease: "easeInOut" }} />
                ))}
              </div>
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400 shrink-0" />
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Mic className="w-3.5 h-3.5" style={{ color: "var(--text-3)" }} />
            </motion.div>
          )}
        </AnimatePresence>
        {listening && (
          <motion.div className="absolute inset-0 rounded-2xl border border-red-400/30"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }} />
        )}
      </motion.button>
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function NotePage() {
  return (
    <React.Suspense fallback={<div className="h-screen w-full bg-[#0a0a0a]" />}>
      <NoteEditorContent />
    </React.Suspense>
  );
}

function NoteEditorContent() {
  const router = useRouter();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");

  const { data: apiGroups = [] } = useGroups();
  const groups = [NO_GROUP, ...apiGroups];
  
  const createNote   = useCreateNote();
  const updateNote   = useUpdateNote();
  const moveToTrash  = useMoveToTrash();
  const toggleArchive = useToggleArchive();
  const { data: existingNote, isLoading: loadingNote } = useNote(noteId);

  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [group, setGroup]     = useState<Group>(NO_GROUP);
  const [groupOpen, setGroupOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [interim, setInterim] = useState("");

  const initialized = useRef(false);
  const contentRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (existingNote && !initialized.current) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      lastSavedTitle.current   = existingNote.title;
      lastSavedContent.current = existingNote.content;
      if (contentRef.current)
        contentRef.current.innerHTML = existingNote.content;
      if (existingNote.groupId) {
        const g = groups.find(x => x.id === existingNote.groupId);
        if (g) setGroup(g);
      } else {
        setGroup(NO_GROUP);
      }
      initialized.current = true;
    }
  }, [existingNote, groups]);

  const handleTranscript = (text: string) => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand("insertText", false, (content ? " " : "") + text);
      setContent(contentRef.current.innerText);
    }
    setInterim("");
  };

  const handleInterim = (text: string) => {
    setInterim(text);
  };

  // Extract plain markdown from the contentEditable div's innerText
  const handleContentInput = () => {
    if (!contentRef.current) return;
    // Just store the raw text for saving — don't re-render HTML on every keystroke
    setContent(contentRef.current.innerText);
  };

  const lastSavedContent = useRef("");
  const lastSavedTitle   = useRef("");

  useEffect(() => {
    if (!noteId) return;                          // new notes: manual save only
    if (!title.trim() && !content) return;        // nothing to save
    const unchanged =
      title.trim() === lastSavedTitle.current &&
      (contentRef.current?.innerHTML ?? content) === lastSavedContent.current;
    if (unchanged) return;

    setSaved(false);
    const t = setTimeout(() => {
      const savedContent = contentRef.current?.innerHTML ?? content;
      updateNote.mutate(
        { id: noteId, payload: { title: title.trim(), content: savedContent, groupId: group.id === "none" ? undefined : group.id } },
        { onSuccess: () => {
            lastSavedTitle.current   = title.trim();
            lastSavedContent.current = savedContent;
            setSaved(true);
          }
        }
      );
    }, 2000);
    return () => clearTimeout(t);
  }, [title, content, group.id, noteId]);

  useEffect(() => {
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags(t => [...new Set([...t, tagInput.trim().toLowerCase()])]);
      setTagInput("");
    }
  };

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleFormat = (key: string) => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    switch (key) {
      case "bold":    document.execCommand("bold");                    break;
      case "italic":  document.execCommand("italic");                  break;
      case "heading": document.execCommand("formatBlock", false, "h2"); break;
      case "quote":   document.execCommand("formatBlock", false, "blockquote"); break;
      case "ul":      document.execCommand("insertUnorderedList");     break;
      case "ol":      document.execCommand("insertOrderedList");       break;
    }
    setContent(contentRef.current.innerHTML);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const savedContent = contentRef.current?.innerHTML ?? content;
    const payload = {
      title:      title.trim(),
      content:    savedContent,
      isPinned:   false,
      isArchived: false,
      groupId:    group.id === "none" ? undefined : group.id,
    };
    if (noteId) {
      updateNote.mutate({ id: noteId, payload }, { onSuccess: () => router.push("/dashboard") });
    } else {
      createNote.mutate(payload, { onSuccess: () => router.push("/dashboard") });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ background: "var(--bg)" }}>
      {loadingNote && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", top: "-100px", left: "20%" }}
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Top bar */}
      <div className="relative z-20 shrink-0 px-3 h-14 flex items-center gap-2"
        style={{ borderBottom: "1px solid var(--border)" }}>

        {/* Back + save */}
        <Glass className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl">
          <motion.button onClick={() => router.back()} whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--text-3)" }}>
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Back</span>
          </motion.button>
          <div className="w-px h-4" style={{ background: "var(--border)" }} />
          <SaveIndicator saved={saved} isPending={createNote.isPending || updateNote.isPending} />
        </Glass>

        <div className="flex-1" />

        {/* Archive + Trash — always visible */}
        {noteId && (
          <Glass className="flex items-center px-1.5 py-1.5 rounded-2xl gap-0.5">
            <motion.button
              onClick={() => toggleArchive.mutate({ id: noteId, isArchived: !existingNote?.isArchived }, { onSuccess: () => router.push("/dashboard") })}
              whileTap={{ scale: 0.9 }} title={existingNote?.isArchived ? "Unarchive" : "Archive"}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: existingNote?.isArchived ? "rgb(251,191,36)" : "var(--text-4)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Archive className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              onClick={() => moveToTrash.mutate([noteId], { onSuccess: () => router.push("/dashboard") })}
              whileTap={{ scale: 0.9 }} title="Move to trash"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: "var(--text-4)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "rgb(248,113,113)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-4)"; }}>
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </Glass>
        )}

        {/* Group picker */}
        <div className="relative">
          <Glass className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl">
            <button onClick={() => setGroupOpen(!groupOpen)}
              className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "var(--text-2)" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
              <span className="hidden sm:block max-w-[80px] truncate">{group.name}</span>
              <ChevronDown className="w-3 h-3" style={{ color: "var(--text-4)" }} />
            </button>
          </Glass>
          <AnimatePresence>
            {groupOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-44 rounded-2xl overflow-hidden z-50"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>
                {groups.map(g => (
                  <button key={g.id} onClick={() => { setGroup(g); setGroupOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium transition-all"
                    style={{ color: group.id === g.id ? "var(--text-1)" : "var(--text-3)", background: group.id === g.id ? "var(--surface-2)" : "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = group.id === g.id ? "var(--surface-2)" : "transparent")}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                    {g.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buddy — desktop only */}
        <Glass className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl cursor-pointer hover:opacity-80 transition-all">
          <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-violet-400">
            <Sparkles className="w-3 h-3" /> Buddy
          </button>
        </Glass>

        {/* Voice */}
        <VoiceToggle onTranscript={handleTranscript} onInterim={handleInterim} />
      </div>

      {/* Toolbar */}
      <div className="relative z-10 flex justify-center pt-4 px-4 shrink-0 overflow-x-auto scrollbar-none">
        <Glass className="flex items-center gap-1 px-3 py-2 rounded-2xl min-w-max">
          {TOOLBAR.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />}
              {group.map(({ icon, label, key }) => {
                const isActive =
                  (key === "bold"   && typeof document !== "undefined" && document.queryCommandState("bold"))   ||
                  (key === "italic" && typeof document !== "undefined" && document.queryCommandState("italic")) ||
                  false;
                return (
                  <ToolBtn key={key} icon={icon} label={label}
                    active={isActive}
                    onClick={() => handleFormat(key)}
                  />
                );
              })}
            </React.Fragment>
          ))}
          <div className="w-px h-5 mx-1" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5 px-2">
            <Hash className="w-3 h-3 shrink-0" style={{ color: "var(--text-4)" }} />
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Add tag…" className="bg-transparent text-[11px] font-mono focus:outline-none w-20"
              style={{ color: "var(--text-2)" }} />
          </div>
        </Glass>
      </div>

      {/* Tags */}
      <AnimatePresence>
        {tags.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="flex justify-center px-4 pt-2 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <motion.button key={tag} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  onClick={() => setTags(t => t.filter(x => x !== tag))} whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono"
                  style={{ color: "#8b5cf6", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
                  <Hash className="w-2.5 h-2.5" />{tag} ×
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-4">
          <textarea ref={titleRef} value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Untitled" rows={1}
            className="w-full resize-none bg-transparent font-black tracking-tight leading-tight focus:outline-none overflow-hidden"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text-1)" }} />
          <div className="h-px" style={{ background: "var(--border)" }} />
          <div className="relative">
            <div
              ref={contentRef as any}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentInput}
              data-placeholder="Start writing…"
              className="min-h-[50vh] leading-relaxed focus:outline-none note-editor"
              style={{ fontSize: "var(--fs-body, 15px)", color: "var(--text-2)", fontFamily: "Mulish, sans-serif" }}
            />
            {interim && (
              <p className="text-[15px] leading-relaxed font-mono mt-1" style={{ color: "var(--text-4)", fontStyle: "italic" }}>
                {interim}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 shrink-0 px-3 sm:px-4 h-14 flex items-center justify-between gap-3"
        style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: "var(--text-4)" }}>
          <div className="flex items-center gap-1.5">
            <Type className="w-3 h-3" />
            <span>{wordCount} <span className="hidden sm:inline">words</span></span>
          </div>
          <div className="w-px h-3" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{readingTime} <span className="hidden sm:inline">min</span></span>
          </div>
          <div className="hidden sm:block w-px h-3" style={{ background: "var(--border)" }} />
          <div className="hidden sm:flex items-center gap-1.5">
            <FolderOpen className="w-3 h-3" />
            <span className="max-w-[120px] truncate">{group.name}</span>
          </div>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={!title.trim() || createNote.isPending || updateNote.isPending}
          whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white bg-violet-600 shadow-[0_4px_14px_rgba(139,92,246,0.4)] disabled:opacity-50 transition-all shrink-0">
          <Check className="w-3.5 h-3.5" />
          <span>{noteId ? "Update" : "Save"}</span>
        </motion.button>
      </div>
    </div>
  );
}
