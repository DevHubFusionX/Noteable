"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pin, Archive, Trash2 } from "lucide-react";
import { useMoveToTrash } from "@/lib/hooks";
import { useTogglePin, useToggleArchive, useDeleteNotes } from "@/lib/hooks";
import { Note } from "@/lib/api/types";

interface NoteMenuProps {
  note:      Note;
  isPinned:  boolean;
  open:      boolean;
  onClose:   () => void;
}

export const NoteMenu = ({ note, isPinned, open, onClose }: NoteMenuProps) => {
  const moveToTrash   = useMoveToTrash();
  const togglePin     = useTogglePin();
  const toggleArchive = useToggleArchive();
  const deleteNotes   = useDeleteNotes();

  const items = [
    {
      label:  isPinned ? "Unpin" : "Pin",
      icon:   <Pin className="w-3 h-3" />,
      action: () => togglePin.mutate({ id: note.id, isPinned: !isPinned }),
    },
    {
      label:  note.isArchived ? "Unarchive" : "Archive",
      icon:   <Archive className="w-3 h-3" />,
      action: () => toggleArchive.mutate({ id: note.id, isArchived: !note.isArchived }),
    },
    {
      label:  "Move to trash",
      icon:   <Trash2 className="w-3 h-3" />,
      danger: true,
      action: () => moveToTrash.mutate([note.id]),
    },
    {
      label:  "Delete permanently",
      icon:   <Trash2 className="w-3 h-3" />,
      danger: true,
      action: () => deleteNotes.mutate([note.id]),
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.12 }}
          className="absolute right-0 top-full mt-1 w-40 rounded-xl overflow-hidden z-50"
          style={{
            background:  "var(--bg-2)",
            border:      "1px solid var(--border-2)",
            boxShadow:   "0 16px 40px rgba(0,0,0,0.4)",
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.action(); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium transition-colors ${
                item.danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-[var(--surface-2)]"
              }`}
              style={!item.danger ? { color: "var(--text-3)" } : {}}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
