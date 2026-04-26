import { useQuery } from "@tanstack/react-query";
import { notesApi, FetchNotesParams } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";

export const useNotes = (params: FetchNotesParams = {}) =>
  useQuery({
    queryKey:        queryKeys.notes.list(params),
    queryFn:         () => notesApi.fetchAll(params),
    staleTime:       30_000,
    placeholderData: (prev) => prev,
  });

export const useNote = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.notes.detail(id ?? ""),
    queryFn:  () => notesApi.fetchOne(id!),
    enabled:  !!id,
    staleTime: 30_000,
  });
