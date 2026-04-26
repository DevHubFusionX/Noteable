import { Note } from "@/lib/api/types";

export const noteGroupName = (note: Note): string =>
  (note.group as { name?: string } | null)?.name ?? "";

export const noteGroupColor = (note: Note): string =>
  (note.group as { color?: string } | null)?.color ?? "#8b5cf6";
