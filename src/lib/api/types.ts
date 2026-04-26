import { z } from "zod";

// ── API response wrapper ───────────────────────────────────────────────────
// All endpoints return { error: boolean, message: string, data: T }

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    error:   z.boolean(),
    message: z.string(),
    data:    dataSchema,
  });

// ── Auth ───────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  email:     z.string().email(),
  avatarUrl: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const TokensSchema = z.object({
  accessToken:  z.string(),
  refreshToken: z.string(),
});

export const AuthResponseSchema = z.object({
  user:         UserSchema,
  accessToken:  z.string().optional(),
  refreshToken: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  token:        z.union([
    z.string(),
    z.object({
      accessToken:   z.string().optional(),
      refreshToken:  z.string().optional(),
      access_token:  z.string().optional(),
      refresh_token: z.string().optional(),
      token:         z.string().optional(),
    }).passthrough(),
  ]).optional(),
  tokens: z.object({
    accessToken:   z.string().optional(),
    refreshToken:  z.string().optional(),
    access_token:  z.string().optional(),
    refresh_token: z.string().optional(),
    token:         z.string().optional(),
  }).passthrough().optional(),
}).passthrough().transform((data) => {
  const tObj = typeof data.token === "object" ? data.token : null;
  const tsObj = data.tokens;

  return {
    user: data.user,
    accessToken:  data.accessToken  ?? data.access_token  ?? (typeof data.token === "string" ? data.token : undefined) ?? 
                  tsObj?.accessToken ?? tsObj?.access_token ?? tsObj?.token ??
                  tObj?.accessToken  ?? tObj?.access_token  ?? tObj?.token ??
                  (data.user as any).accessToken ?? (data.user as any).access_token ?? (data.user as any).token ?? "",
    refreshToken: data.refreshToken ?? data.refresh_token ?? 
                  tsObj?.refreshToken ?? tsObj?.refresh_token ??
                  tObj?.refreshToken  ?? tObj?.refresh_token  ??
                  (data.user as any).refreshToken ?? (data.user as any).refresh_token ?? "",
  };
});

export const LoginPayloadSchema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterPayloadSchema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ── Notes ──────────────────────────────────────────────────────────────────
// Real API shape from POST /notes/ and GET /notes/:id responses

export const NoteSchema = z.object({
  id:         z.string(),
  title:      z.string(),
  content:    z.string(),
  isPinned:   z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isDeleted:  z.boolean().default(false),
  groupId:    z.string().nullable().optional(),
  userId:     z.string().optional(),
  group:      z.any().nullable().optional(),   // populated on GET /notes/:id
  createdAt:  z.string(),
  updatedAt:  z.string(),
}).passthrough();

export const CreateNotePayloadSchema = z.object({
  title:      z.string().min(1, "Title is required"),
  content:    z.string().default(""),
  isPinned:   z.boolean().default(false),
  isArchived: z.boolean().default(false),
  groupId:    z.string().optional().nullable(),
});

export const UpdateNotePayloadSchema = CreateNotePayloadSchema.partial();

// List response — API returns array directly inside data wrapper
export const NotesListResponseSchema = z.any().transform((val) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") {
    return val.records ?? val.notes ?? val.data ?? val.items ?? [];
  }
  return [];
}).pipe(z.array(NoteSchema));

// ── Groups ─────────────────────────────────────────────────────────────────

export const GroupSchema = z.object({
  id:        z.string(),
  name:      z.string(),
  color:     z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateGroupPayloadSchema = z.object({
  name: z.string().min(1, "Group name is required"),
});

export const UpdateGroupPayloadSchema = CreateGroupPayloadSchema.partial();

export const GroupsListResponseSchema = z.array(GroupSchema);

// ── Messages ───────────────────────────────────────────────────────────────

export const MessageSchema = z.object({
  id:        z.string(),
  noteId:    z.string(),
  role:      z.enum(["user", "model"]),
  content:   z.string(),
  createdAt: z.string(),
});

export const MessagesPaginationSchema = z.object({
  currentPage:  z.number(),
  nextPage:     z.number().nullable(),
  prevPage:     z.number().nullable(),
  hasNext:      z.boolean(),
  hasPrev:      z.boolean(),
  totalPages:   z.number(),
  totalRecords: z.number(),
});

export const MessagesResponseSchema = z.object({
  records:    z.array(MessageSchema),
  pagination: MessagesPaginationSchema,
});

// ── Transcribe ─────────────────────────────────────────────────────────────

export const TranscribeResponseSchema = z.object({
  result: z.string(),
});

// ── API Error ──────────────────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  message:    z.string(),
  statusCode: z.number().optional(),
  errors:     z.record(z.string()).optional(),
});

// ── Inferred types ─────────────────────────────────────────────────────────

export type User              = z.infer<typeof UserSchema>;
export type Tokens            = z.infer<typeof TokensSchema>;
export type AuthResponse      = z.infer<typeof AuthResponseSchema>;
export type LoginPayload      = z.infer<typeof LoginPayloadSchema>;
export type RegisterPayload   = z.infer<typeof RegisterPayloadSchema>;
export type Note              = z.infer<typeof NoteSchema>;
export type CreateNotePayload = z.infer<typeof CreateNotePayloadSchema>;
export type UpdateNotePayload = z.infer<typeof UpdateNotePayloadSchema>;
export type NotesListResponse = Note[];
export type Group              = z.infer<typeof GroupSchema>;
export type CreateGroupPayload = z.infer<typeof CreateGroupPayloadSchema>;
export type UpdateGroupPayload = z.infer<typeof UpdateGroupPayloadSchema>;
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;
export type Message            = z.infer<typeof MessageSchema>;
export type MessagesResponse   = z.infer<typeof MessagesResponseSchema>;
export type TranscribeResponse = z.infer<typeof TranscribeResponseSchema>;
export type ApiError           = z.infer<typeof ApiErrorSchema>;
