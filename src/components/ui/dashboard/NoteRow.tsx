"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, Pin } from "lucide-react";
import { useTogglePin } from "@/lib/hooks";
import { useNotesStore } from "@/lib/stores/notesStore";
import { timeAgo } from "@/lib/utils/timeAgo";
import { Note } from "@/lib/api/types";

interface NoteRowProps {
  note:  Note;
  index: number;
}

export const NoteRow = ({ note, index }: NoteRowProps) => {
  const router = useRouter();
  const { optimisticPinned, optimisticDeleted } = useNotesStore();
  const togglePin = useTogglePin();

  if (optimisticDeleted.has(note.id)) return null;

  const isPinned = optimisticPinned[note.id] ?? note.isPinned;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => router.push(`/dashboard/note?id=${note.id}`)}
      className="group flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all"
      style={{ borderBottom: "1px solid var(--border)" }}
      onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-4)" }} />

      <p className="text-[13px] font-semibold flex-1 truncate" style={{ color: "var(--text-2)" }}>
        {note.title}
      </p>

      <p className="text-[12px] flex-1 truncate hidden md:block" style={{ color: "var(--text-3)" }}>
        {note.content}
      </p>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-mono w-20 text-right" style={{ color: "var(--text-4)" }}>
          {timeAgo(note.updatedAt)}
        </span>
        <button
          onClick={e => {
            e.stopPropagation();
            togglePin.mutate({ id: note.id, isPinned: !isPinned });
          }}
          className={`p-1 rounded-lg transition-all ${isPinned ? "text-violet-400" : "opacity-0 group-hover:opacity-100"}`}
          style={!isPinned ? { color: "var(--text-4)" } : {}}
        >
          <Pin className="w-3 h-3" fill={isPinned ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
};
