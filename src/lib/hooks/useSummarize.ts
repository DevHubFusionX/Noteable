import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queryKeys";
import { z } from "zod";

const SummarizeResponseSchema = z.object({
  content: z.string(),
}).passthrough();

const fetchSummary = async (id: string): Promise<{ content: string }> => {
  const { data } = await apiClient.get(`/notes/summerize/${id}`);
  // Handle both { content } and { result } shapes
  const content =
    data?.content ??
    data?.result  ??
    data?.summary ??
    (typeof data === "string" ? data : null);
  if (!content) throw new Error("No summary returned from API");
  return { content };
};

// enabled: false by default — call refetch() to trigger on demand
export const useSummarize = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.notes.summarize(id ?? ""),
    queryFn:  () => fetchSummary(id!),
    enabled:  false,
    staleTime: 5 * 60_000,
    retry: false,
  });
