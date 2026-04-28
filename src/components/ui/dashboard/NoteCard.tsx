"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pin, Archive, Clock, Trash2, Eye, X, Edit3 } from "lucide-react";
import { NoteMenu } from "./NoteMenu";
import { useNotesStore } from "@/lib/stores/notesStore";
import { useMoveToTrash, useToggleArchive } from "@/lib/hooks";
import { timeAgo } from "@/lib/utils/timeAgo";
import { stripMarkdown } from "@/lib/utils/stripMarkdown";
import { Note } from "@/lib/api/types";

interface NoteCardProps {
  note:  Note;
  index: number;
}

const NotePreviewModal = ({ note, onClose, onEdit }: { note: Note; onClose: () => void; onEdit: () => void }) => {
  const groupName = note.group ? (note.group as { name?: string }).name ?? "Note" : "Note";
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>
              {groupName}
            </span>
            <h2 className="text-[22px] font-black tracking-tight mt-1 leading-tight" style={{ color: "var(--text-1)" }}>
              {note.title}
            </h2>
            <p className="text-[11px] font-mono mt-1" style={{ color: "var(--text-4)" }}>
              {timeAgo(note.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <motion.button
              onClick={onEdit}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white bg-violet-600 transition-all"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </motion.button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all ml-1"
              style={{ color: "var(--text-4)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-none">
          <div
            className="note-editor leading-relaxed"
            style={{ fontSize: "15px", color: "var(--text-2)", fontFamily: "Mulish, sans-serif" }}
            dangerouslySetInnerHTML={{ __html: note.content || "<p style='color:var(--text-4)'>No content</p>" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export const NoteCard = ({ note, index }: NoteCardProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { optimisticPinned, optimisticDeleted } = useNotesStore();
  const moveToTrash   = useMoveToTrash();
  const toggleArchive = useToggleArchive();

  if (optimisticDeleted.has(note.id)) return null;

  const isPinned  = optimisticPinned[note.id] ?? note.isPinned;
  const groupName = note.group ? (note.group as { name?: string }).name ?? "Note" : "Note";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => router.push(`/dashboard/note?id=${note.id}`)}
        className="group relative flex flex-col rounded-2xl cursor-pointer transition-all note-card"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", padding: "var(--card-p, 20px)" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {isPinned        && <Pin     className="w-2.5 h-2.5 shrink-0 text-violet-400" />}
            {note.isArchived && <Archive className="w-2.5 h-2.5 shrink-0 text-amber-400" />}
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] truncate" style={{ color: "var(--text-4)" }}>
              {groupName}
            </span>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewOpen(true)}
              title="Quick preview"
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-all"
              style={{ color: "var(--text-4)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => toggleArchive.mutate({ id: note.id, isArchived: !note.isArchived })}
              title={note.isArchived ? "Unarchive" : "Archive"}
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: note.isArchived ? "rgb(251,191,36)" : "var(--text-4)" }}>
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => moveToTrash.mutate([note.id])}
              title="Move to trash"
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: "var(--text-4)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgb(248,113,113)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="p-1 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                style={{ color: "var(--text-4)" }}>
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <NoteMenu note={note} isPinned={isPinned} open={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="note-title font-bold leading-snug mb-2 line-clamp-2"
          style={{ color: "var(--text-1)", fontSize: "var(--fs-title, 14px)" }}>
          {note.title}
        </h3>

        {/* Preview text */}
        <p className="note-preview leading-relaxed line-clamp-3 flex-1"
          style={{ color: "var(--text-3)", fontSize: "var(--fs-note, 12px)" }}>
          {stripMarkdown(note.content)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
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

      {/* Preview modal */}
      <AnimatePresence>
        {previewOpen && (
          <NotePreviewModal
            note={note}
            onClose={() => setPreviewOpen(false)}
            onEdit={() => { setPreviewOpen(false); router.push(`/dashboard/note?id=${note.id}`); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
