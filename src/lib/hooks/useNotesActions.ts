import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useNotesStore } from "@/lib/stores/notesStore";
import { useUiStore } from "@/lib/stores/uiStore";
import { Note } from "@/lib/api/types";

export const useTogglePin = () => {
  const qc = useQueryClient();
  const { showToast, flashSidebar } = useUiStore();
  const { setOptimisticPin, rollbackPin } = useNotesStore();

  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      notesApi.togglePin(id, isPinned),
    onMutate: ({ id, isPinned }) => {
      setOptimisticPin(id, isPinned);
      if (isPinned) flashSidebar("pinned");
      qc.setQueryData<Note>(queryKeys.notes.detail(id), (old) =>
        old ? { ...old, isPinned } : old
      );
    },
    onSuccess: (note) => {
      qc.setQueryData(queryKeys.notes.detail(note.id), note);
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
    onError: (err: Error, { id }) => {
      rollbackPin(id);
      showToast(err.message, "error");
    },
  });
};

export const useToggleArchive = () => {
  const qc = useQueryClient();
  const { showToast, flashSidebar } = useUiStore();

  return useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) =>
      notesApi.toggleArchive(id, isArchived),
    onMutate: ({ id, isArchived }) => {
      if (isArchived) {
        flashSidebar("archive");
        qc.setQueryData<Note>(queryKeys.notes.detail(id), (old) =>
          old ? { ...old, isArchived: true } : old
        );
      }
    },
    onSuccess: (note) => {
      qc.setQueryData(queryKeys.notes.detail(note.id), note);
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
      showToast(note.isArchived ? "Note archived" : "Note unarchived", "info");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};
