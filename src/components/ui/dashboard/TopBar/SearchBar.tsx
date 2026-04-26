"use client";

import { Search } from "lucide-react";
import { useNotesStore } from "@/lib/stores/notesStore";

export const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useNotesStore();

  return (
    <div className="relative flex-1 min-w-0">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
        style={{ color: "var(--text-4)" }}
      />
      <input
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search notes…"
        className="w-full rounded-xl pl-9 pr-4 py-2 text-[13px] focus:outline-none transition-all font-mono"
        style={{
          background: "var(--surface)",
          border:     "1px solid var(--border)",
          color:      "var(--text-2)",
        }}
      />
      {searchQuery && (
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1.5 py-0.5 rounded"
          style={{ color: "var(--text-4)", background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          ↵
        </kbd>
      )}
    </div>
  );
};
