import { create } from "zustand";
import { Note } from "@/lib/api/types";

interface NotesState {
  activeNoteId:  string | null;
  activeNote:    Note | null;
  selectedGroup: string | null;
  searchQuery:   string;
  viewMode:      "grid" | "list";

  setActiveNote:    (note: Note | null)    => void;
  setActiveNoteId:  (id: string | null)    => void;
  setSelectedGroup: (group: string | null) => void;
  setSearchQuery:   (q: string)            => void;
  setViewMode:      (mode: "grid" | "list") => void;

  // Optimistic updates — applied immediately, rolled back on error
  optimisticPinned:  Record<string, boolean>;
  optimisticDeleted: Set<string>;

  setOptimisticPin:    (id: string, isPinned: boolean) => void;
  setOptimisticDelete: (id: string)                    => void;
  rollbackPin:         (id: string)                    => void;
  rollbackDelete:      (id: string)                    => void;
  clearOptimistic:     ()                              => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  activeNoteId:  null,
  activeNote:    null,
  selectedGroup: null,
  searchQuery:   "",
  viewMode:      "grid",

  setActiveNote:    (note)  => set({ activeNote: note, activeNoteId: note?.id ?? null }),
  setActiveNoteId:  (id)    => set({ activeNoteId: id }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setSearchQuery:   (q)     => set({ searchQuery: q }),
  setViewMode:      (mode)  => set({ viewMode: mode }),

  optimisticPinned:  {},
  optimisticDeleted: new Set(),

  setOptimisticPin: (id, isPinned) =>
    set((s) => ({ optimisticPinned: { ...s.optimisticPinned, [id]: isPinned } })),

  setOptimisticDelete: (id) =>
    set((s) => ({ optimisticDeleted: new Set([...s.optimisticDeleted, id]) })),

  rollbackPin: (id) =>
    set((s) => {
      const next = { ...s.optimisticPinned };
      delete next[id];
      return { optimisticPinned: next };
    }),

  rollbackDelete: (id) =>
    set((s) => {
      const next = new Set(s.optimisticDeleted);
      next.delete(id);
      return { optimisticDeleted: next };
    }),

  clearOptimistic: () =>
    set({ optimisticPinned: {}, optimisticDeleted: new Set() }),
}));
