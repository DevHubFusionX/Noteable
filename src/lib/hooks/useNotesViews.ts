import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesApi, FetchArchivedParams, FetchPinnedParams } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useUiStore } from "@/lib/stores/uiStore";

export const useArchivedNotes = (params: FetchArchivedParams = {}) =>
  useQuery({
    queryKey:  queryKeys.notes.archived(params),
    queryFn:   () => notesApi.fetchArchived(params),
    staleTime: 30_000,
  });

export const usePinnedNotes = (params: FetchPinnedParams = {}) =>
  useQuery({
    queryKey:  queryKeys.notes.pinned(params),
    queryFn:   () => notesApi.fetchPinned(params),
    staleTime: 30_000,
  });

export const useDeleteNotes = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (ids: string[]) => notesApi.deleteNotes(ids),
    onSuccess: (_, ids) => {
      ids.forEach(id => qc.removeQueries({ queryKey: queryKeys.notes.detail(id) }));
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
      showToast(
        ids.length === 1 ? "Note deleted" : `${ids.length} notes deleted`,
        "info",
      );
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};
