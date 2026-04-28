"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, X, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/ui/dashboard/TopBar";
import { useTrash, useMoveToTrash } from "@/lib/hooks";
import { useDeleteNotes } from "@/lib/hooks";
import { useNotesStore } from "@/lib/stores/notesStore";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Note } from "@/lib/api/types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/queryKeys";
import { notesApi } from "@/lib/api/notes";
import { useMutation } from "@tanstack/react-query";
import { useUiStore } from "@/lib/stores/uiStore";

const useRestoreNote = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();
  return useMutation({
    mutationFn: (id: string) => notesApi.update(id, { isDeleted: false }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
      showToast("Note restored", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};

const TrashCard = ({ note, onRestore, onDelete }: { note: Note; onRestore: () => void; onDelete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group relative flex flex-col rounded-2xl p-5"
    style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text-4)" }}>
        {note.group ? (note.group as any).name ?? "Note" : "Note"}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button onClick={onRestore} title="Restore"
          className="p-1.5 rounded-lg transition-all hover:bg-emerald-500/10"
          style={{ color: "var(--text-4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgb(52,211,153)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} title="Delete permanently"
          className="p-1.5 rounded-lg transition-all hover:bg-red-500/10"
          style={{ color: "var(--text-4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgb(248,113,113)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
    <h3 className="text-[14px] font-bold leading-snug mb-2 line-clamp-2" style={{ color: "var(--text-2)" }}>
      {note.title}
    </h3>
    <p className="text-[12px] leading-relaxed line-clamp-2 flex-1" style={{ color: "var(--text-4)" }}>
      {note.content}
    </p>
    <p className="text-[10px] font-mono mt-3 pt-3" style={{ color: "var(--text-4)", borderTop: "1px solid var(--border)" }}>
      Deleted {timeAgo(note.updatedAt)}
    </p>
  </motion.div>
);

const EmptyTrash = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <Trash2 className="w-8 h-8" style={{ color: "var(--text-4)" }} />
    <p className="text-[14px] font-medium" style={{ color: "var(--text-3)" }}>Trash is empty</p>
    <p className="text-[12px] font-mono" style={{ color: "var(--text-4)" }}>Deleted notes will appear here</p>
  </div>
);

export default function TrashPage() {
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const { viewMode, setViewMode }       = useNotesStore();
  const { data: notes = [], isLoading } = useTrash();
  const deleteNotes  = useDeleteNotes();
  const restoreNote  = useRestoreNote();

  const handleEmptyTrash = () => {
    if (!confirmEmpty) { setConfirmEmpty(true); return; }
    deleteNotes.mutate(notes.map(n => n.id), { onSuccess: () => setConfirmEmpty(false) });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar view={viewMode} setView={setViewMode} onNewNote={() => {}} title="Trash" noteCount={notes.length} />

      {/* Warning banner */}
      {notes.length > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 shrink-0"
          style={{ background: "rgba(239,68,68,0.05)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400/70" />
            <p className="text-[11px] font-mono" style={{ color: "var(--text-4)" }}>
              Notes in trash are permanently deleted after 30 days
            </p>
          </div>
          <motion.button
            onClick={handleEmptyTrash}
            disabled={deleteNotes.isPending}
            animate={{ borderColor: confirmEmpty ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)" }}
            className="text-[11px] font-mono px-3 py-1 rounded-lg transition-all disabled:opacity-50"
            style={{ color: confirmEmpty ? "rgb(248,113,113)" : "rgba(248,113,113,0.5)", border: "1px solid rgba(239,68,68,0.2)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            {confirmEmpty ? "Confirm — empty trash" : "Empty trash"}
          </motion.button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {isLoading ? (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse h-44"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <EmptyTrash />
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {notes.map(note => (
                <TrashCard
                  key={note.id}
                  note={note}
                  onRestore={() => restoreNote.mutate(note.id)}
                  onDelete={() => deleteNotes.mutate([note.id])}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
