"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutHandlers {
  onNewNote:        () => void;
  onCommandPalette: () => void;
  onSearch:         () => void;
  onVoiceCapture:   () => void;
  onNoteBuddy:      () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  const handle = useCallback((e: KeyboardEvent) => {
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (!mod) return;

    // Skip if typing in an input/textarea/contenteditable
    const tag = (e.target as HTMLElement).tagName;
    const editable = (e.target as HTMLElement).isContentEditable;
    if ((tag === "INPUT" || tag === "TEXTAREA") && e.key !== "k") return;
    if (editable && e.key !== "k") return;

    switch (e.key.toLowerCase()) {
      case "n":
        e.preventDefault();
        handlers.onNewNote();
        break;
      case "k":
        e.preventDefault();
        handlers.onCommandPalette();
        break;
      case "f":
        e.preventDefault();
        handlers.onSearch();
        break;
      case "v":
        if (e.shiftKey) { e.preventDefault(); handlers.onVoiceCapture(); }
        break;
      case "b":
        if (e.shiftKey) { e.preventDefault(); handlers.onNoteBuddy(); }
        break;
    }
  }, [handlers, isMac]);

  useEffect(() => {
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [handle]);
}
