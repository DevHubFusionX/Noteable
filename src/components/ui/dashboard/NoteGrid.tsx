"use client";

import { FileText } from "lucide-react";
import { NoteCard } from "./NoteCard";
import { NoteRow } from "./NoteRow";
import { Note } from "@/lib/api/types";

// ── Skeleton ───────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div
    className="rounded-2xl animate-pulse"
    style={{
      background: "var(--bg-2)",
      border:     "1px solid var(--border)",
      padding:    "20px",
      height:     "180px",
    }}
  >
    <div className="h-2 w-16 rounded-full mb-4"  style={{ background: "var(--surface-2)" }} />
    <div className="h-4 w-3/4 rounded-full mb-2" style={{ background: "var(--surface-2)" }} />
    <div className="h-3 w-full rounded-full mb-1.5" style={{ background: "var(--surface)" }} />
    <div className="h-3 w-5/6 rounded-full mb-1.5" style={{ background: "var(--surface)" }} />
    <div className="h-3 w-2/3 rounded-full"        style={{ background: "var(--surface)" }} />
  </div>
);

const LIST_HEADERS = ["", "Title", "Content", "Updated"];

// ── Props ──────────────────────────────────────────────────────────────────

interface NoteGridProps {
  notes:     Note[] | undefined;
  isLoading: boolean;
  isError:   boolean;
  viewMode:  "grid" | "list";
}

// ── Component ──────────────────────────────────────────────────────────────

export const NoteGrid = ({ notes, isLoading, isError, viewMode }: NoteGridProps) => {

  if (isLoading) return (
    <div
      className="p-4 notes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{ gap: "var(--card-gap, 16px)" }}
    >
      {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-[14px] font-medium" style={{ color: "var(--text-3)" }}>
        Failed to load notes
      </p>
      <button
        onClick={() => window.location.reload()}
        className="text-[12px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
      >
        Try again
      </button>
    </div>
  );

  if (!notes || notes.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <FileText className="w-8 h-8" style={{ color: "var(--text-4)" }} />
      <p className="text-[14px] font-medium" style={{ color: "var(--text-3)" }}>No notes yet</p>
      <p className="text-[12px] font-mono" style={{ color: "var(--text-4)" }}>
        Press ⌘N to create your first note
      </p>
    </div>
  );

  if (viewMode === "grid") return (
    <div
      className="p-4 notes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      style={{ gap: "var(--card-gap, 16px)" }}
    >
      {notes.map((note, i) => <NoteCard key={note.id} note={note} index={i} />)}
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* List header */}
      <div
        className="flex items-center gap-4 px-5 py-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
      >
        {LIST_HEADERS.map((h, i) => (
          <span
            key={h + i}
            className={`text-[9px] font-mono uppercase tracking-[0.22em] ${
              i === 1 ? "flex-1" :
              i === 2 ? "flex-1 hidden md:block" :
              i === 3 ? "w-20 text-right shrink-0" :
              "w-4 shrink-0"
            }`}
            style={{ color: "var(--text-4)" }}
          >
            {h}
          </span>
        ))}
        <div className="w-6 shrink-0" />
      </div>

      {notes.map((note, i) => <NoteRow key={note.id} note={note} index={i} />)}
    </div>
  );
};
