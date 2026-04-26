import { apiClient } from "./client";
import { Message, MessageSchema, MessagesResponse, MessagesResponseSchema } from "./types";

export const messagesApi = {
  // GET /messages/:noteId?page=
  fetchByNote: async (noteId: string, page = 1): Promise<MessagesResponse> => {
    const { data } = await apiClient.get(`/messages/${noteId}`, { params: { page } });
    return MessagesResponseSchema.parse(data);
  },

  // POST /messages/:noteId  { content }
  send: async (noteId: string, content: string): Promise<Message> => {
    const { data } = await apiClient.post(`/messages/${noteId}`, { content });
    return MessageSchema.parse(data);
  },
};
