// Centralised TanStack Query key factory
// Usage: queryKeys.notes.all(), queryKeys.notes.detail("123")

export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  notes: {
    all:       ()                => ["notes"]                        as const,
    list:      (p: object)       => ["notes", "list", p]             as const,
    detail:    (id: string)      => ["notes", id]                    as const,
    summarize: (id: string)      => ["notes", "summarize", id]       as const,
    trash:     (p?: object)      => ["notes", "trash", p ?? {}]      as const,
    archived:  (p?: object)      => ["notes", "archived", p ?? {}]   as const,
    pinned:    (p?: object)      => ["notes", "pinned", p ?? {}]     as const,
    groups:    ()                => ["notes", "groups"]              as const,
  },
  groups: {
    all:    ()             => ["groups"]          as const,
    list:   (p?: object)   => ["groups", "list", p ?? {}] as const,
    detail: (id: string)   => ["groups", id]      as const,
  },
  messages: {
    byNote: (noteId: string, page?: number) => ["messages", noteId, page ?? 1] as const,
    all:    (noteId: string)                 => ["messages", noteId]            as const,
  },
} as const;
