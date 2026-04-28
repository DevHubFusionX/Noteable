import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi, FetchTrashParams } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useNotesStore } from "@/lib/stores/notesStore";
import { useUiStore } from "@/lib/stores/uiStore";

export const useTrash = (params: FetchTrashParams = {}) =>
  useQuery({
    queryKey: queryKeys.notes.trash(params),
    queryFn:  () => notesApi.fetchTrash(params),
    staleTime: 30_000,
  });

export const useMoveToTrash = () => {
  const qc = useQueryClient();
  const { showToast, flashSidebar } = useUiStore();
  const { setOptimisticDelete, rollbackDelete, rollbackPin } = useNotesStore();

  return useMutation({
    mutationFn: (ids: string[]) => notesApi.moveToTrash(ids),
    onMutate: (ids) => {
      ids.forEach(id => {
        setOptimisticDelete(id);
        rollbackPin(id);
      });
      flashSidebar("trash");
    },
    onSuccess: (_, ids) => {
      ids.forEach(id => qc.removeQueries({ queryKey: queryKeys.notes.detail(id) }));
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
      showToast(
        ids.length === 1 ? "Note moved to trash" : `${ids.length} notes moved to trash`,
        "info",
      );
    },
    onError: (err: Error, ids) => {
      ids.forEach(id => rollbackDelete(id));
      showToast(err.message, "error");
    },
  });
};
