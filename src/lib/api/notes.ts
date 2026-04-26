import { apiClient } from "./client";
import {
  Note, NoteSchema,
  NotesListResponse, NotesListResponseSchema,
  CreateNotePayload, UpdateNotePayload,
  TranscribeResponse, TranscribeResponseSchema,
} from "./types";

// ── Query params ───────────────────────────────────────────────────────────

export interface FetchNotesParams {
  searchQuery?: string;
  orderBy?:     "asc" | "desc";
  groupId?:     string;
  isPinned?:    boolean;
  isArchived?:  boolean;
}

export interface FetchTrashParams {
  searchQuery?: string;
  orderBy?:     "asc" | "desc";
}

export interface FetchArchivedParams {
  orderBy?: "asc" | "desc";
}

export interface FetchPinnedParams {
  groupId?:  string;
  orderBy?:  "asc" | "desc";
}

// ── API ────────────────────────────────────────────────────────────────────

export const notesApi = {
  // GET /notes/?searchQuery=&orderBy=
  fetchAll: async (params: FetchNotesParams = {}): Promise<NotesListResponse> => {
    const { data } = await apiClient.get("/notes/", { params });
    return NotesListResponseSchema.parse(data);
  },

  // GET /notes/:id
  fetchOne: async (id: string): Promise<Note> => {
    const { data } = await apiClient.get(`/notes/${id}`);
    return NoteSchema.parse(data);
  },

  // POST /notes/
  create: async (payload: CreateNotePayload): Promise<Note> => {
    const { data } = await apiClient.post("/notes/", payload);
    return NoteSchema.parse(data);
  },

  // PATCH /notes/:id  — generic update (title, content, isPinned, isArchived, groupId)
  update: async (id: string, payload: UpdateNotePayload): Promise<Note> => {
    const { data } = await apiClient.patch(`/notes/${id}`, payload);
    return NoteSchema.parse(data);
  },

  // PATCH /notes/move-to-trash  { ids: string[] }
  moveToTrash: async (ids: string[]): Promise<void> => {
    await apiClient.patch("/notes/move-to-trash", { ids });
  },

  // GET /notes/trash?searchQuery=&orderBy=
  fetchTrash: async (params: FetchTrashParams = {}): Promise<NotesListResponse> => {
    const { data } = await apiClient.get("/notes/trash", { params });
    return NotesListResponseSchema.parse(data);
  },

  // GET /notes/summerize/:id  (API typo is intentional)
  summarize: async (id: string): Promise<Note> => {
    const { data } = await apiClient.get(`/notes/summerize/${id}`);
    return NoteSchema.parse(data);
  },

  // Convenience: toggle pin via update
  togglePin: async (id: string, isPinned: boolean): Promise<Note> =>
    notesApi.update(id, { isPinned }),

  // Convenience: toggle archive via update
  toggleArchive: async (id: string, isArchived: boolean): Promise<Note> =>
    notesApi.update(id, { isArchived }),

  // DELETE /notes/  { ids: string[] }
  deleteNotes: async (ids: string[]): Promise<void> => {
    await apiClient.delete("/notes/", { data: { ids } });
  },

  // GET /notes/archive?orderBy=
  fetchArchived: async (params: FetchArchivedParams = {}): Promise<NotesListResponse> => {
    const { data } = await apiClient.get("/notes/archive", { params });
    return NotesListResponseSchema.parse(data);
  },

  // GET /notes/pinned?groupId=&orderBy=
  fetchPinned: async (params: FetchPinnedParams = {}): Promise<NotesListResponse> => {
    const { data } = await apiClient.get("/notes/pinned", { params });
    return NotesListResponseSchema.parse(data);
  },

  // POST /notes/transcribe-audio  multipart/form-data { audio: File }
  transcribeAudio: async (file: File): Promise<TranscribeResponse> => {
    const form = new FormData();
    form.append("audio", file);
    const { data } = await apiClient.post("/notes/transcribe-audio", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return TranscribeResponseSchema.parse(data);
  },
};
