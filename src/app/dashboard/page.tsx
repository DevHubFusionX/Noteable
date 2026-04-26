"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TopBar } from "@/components/ui/dashboard/TopBar";
import { NoteGrid } from "@/components/ui/dashboard/NoteGrid";
import { useNotes, useArchivedNotes, usePinnedNotes } from "@/lib/hooks";
import { useNotesStore } from "@/lib/stores/notesStore";

const VIEW_TITLES: Record<string, string> = {
  notes:   "All Notes",
  pinned:  "Pinned",
  archive: "Archive",
  group:   "Group",
};

function DashboardContent() {
  const { viewMode, setViewMode, searchQuery } = useNotesStore();
  const params  = useSearchParams();
  const view    = params.get("view")    ?? "notes";
  const groupId = params.get("groupId") ?? undefined;

  const allNotes      = useNotes({ searchQuery: searchQuery || undefined, groupId });
  const archivedNotes = useArchivedNotes();
  const pinnedNotes   = usePinnedNotes();

  const { data, isLoading, isError } =
    view === "archive" ? archivedNotes :
    view === "pinned"  ? pinnedNotes   :
    allNotes;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar
        view={viewMode}
        setView={setViewMode}
        onNewNote={() => {}}
        title={VIEW_TITLES[view] ?? "All Notes"}
        noteCount={data?.length}
      />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <NoteGrid notes={data} isLoading={isLoading} isError={isError} viewMode={viewMode} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
