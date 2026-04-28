import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api/messages";
import { queryKeys } from "@/lib/api/queryKeys";

export const useMessages = (noteId: string | null, page = 1) =>
  useQuery({
    queryKey:  queryKeys.messages.byNote(noteId ?? "", page),
    queryFn:   () => messagesApi.fetchByNote(noteId!, page),
    enabled:   !!noteId,
    staleTime: 5 * 60_000,
  });

export const useSendMessage = (noteId: string | null) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => messagesApi.send(noteId!, content),
    onSuccess: () => {
      if (noteId) qc.invalidateQueries({ queryKey: queryKeys.messages.all(noteId) });
    },
  });
};
