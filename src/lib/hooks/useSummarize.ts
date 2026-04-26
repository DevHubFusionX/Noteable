import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@/lib/api/notes";
import { queryKeys } from "@/lib/api/queryKeys";

// enabled: false by default — call refetch() to trigger on demand
export const useSummarize = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.notes.summarize(id ?? ""),
    queryFn:  () => notesApi.summarize(id!),
    enabled:  false,   // triggered manually via refetch()
    staleTime: 5 * 60_000,
    retry: false,
  });
