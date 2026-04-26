"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pin, Archive, Clock } from "lucide-react";
import { NoteMenu } from "./NoteMenu";
import { useNotesStore } from "@/lib/stores/notesStore";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Note } from "@/lib/api/types";

interface NoteCardProps {
  note:  Note;
  index: number;
}

export const NoteCard = ({ note, index }: NoteCardProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { optimisticPinned, optimisticDeleted } = useNotesStore();

  if (optimisticDeleted.has(note.id)) return null;

  const isPinned   = optimisticPinned[note.id] ?? note.isPinned;
  const groupName  = note.group ? (note.group as { name?: string }).name ?? "Note" : "Note";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => router.push(`/dashboard/note?id=${note.id}`)}
      className="group relative flex flex-col rounded-2xl cursor-pointer transition-all note-card"
      style={{
        background: "var(--bg-2)",
        border:     "1px solid var(--border)",
        padding:    "var(--card-p, 20px)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {isPinned      && <Pin     className="w-2.5 h-2.5 shrink-0 text-violet-400" />}
          {note.isArchived && <Archive className="w-2.5 h-2.5 shrink-0 text-amber-400" />}
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] truncate" style={{ color: "var(--text-4)" }}>
            {groupName}
          </span>
        </div>

        {/* 3-dot menu */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            style={{ color: "var(--text-4)" }}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <NoteMenu
            note={note}
            isPinned={isPinned}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      </div>

      {/* Title */}
      <h3
        className="note-title font-bold leading-snug mb-2 line-clamp-2"
        style={{ color: "var(--text-1)", fontSize: "var(--fs-title, 14px)" }}
      >
        {note.title}
      </h3>

      {/* Preview */}
      <p
        className="note-preview leading-relaxed line-clamp-3 flex-1"
        style={{ color: "var(--text-3)", fontSize: "var(--fs-note, 12px)" }}
      >
        {note.content}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-4 pt-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: "var(--text-4)" }}>
          <FileText className="w-3 h-3" />
          <span>Note</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--text-4)" }}>
          <Clock className="w-2.5 h-2.5" />
          {timeAgo(note.updatedAt)}
        </div>
      </div>
    </motion.div>
  );
};
