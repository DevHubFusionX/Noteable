import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useNotesStore } from "@/lib/stores/notesStore";
import { useUiStore } from "@/lib/stores/uiStore";
import { CreateNotePayload, UpdateNotePayload } from "@/lib/api/types";

export const useCreateNote = () => {
  const qc             = useQueryClient();
  const { showToast }  = useUiStore();
  const { setActiveNote } = useNotesStore();

  return useMutation({
    mutationFn: (payload: CreateNotePayload) => notesApi.create(payload),
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: queryKeys.notes.all() });
      setActiveNote(note);
      showToast("Note created", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};

export const useUpdateNote = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      notesApi.update(id, payload),
    onSuccess: (note) => {
      qc.setQueryData(queryKeys.notes.detail(note.id), note);
      qc.invalidateQueries({ queryKey: queryKeys.notes.all() });
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};
