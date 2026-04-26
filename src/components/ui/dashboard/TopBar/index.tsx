"use client";

import { useEffect } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Menu, Mic, Zap, Sparkles, Bell, Plus } from "lucide-react";
import { useMobileNav } from "@/lib/MobileNavContext";
import { SearchBar } from "./SearchBar";
import { ViewToggle } from "./ViewToggle";
import { ProfileMenu } from "./ProfileMenu";
import { VoiceModal } from "../VoiceModal";
import { SummarizerPanel } from "../SummarizerPanel";

interface TopBarProps {
  view:       "grid" | "list";
  setView:    (v: "grid" | "list") => void;
  onNewNote:  () => void;
  title?:     string;
  noteCount?: number;
}

const Divider = () => (
  <div className="hidden sm:block w-px h-5 shrink-0" style={{ background: "var(--border)" }} />
);

export const TopBar = ({ view, setView, onNewNote, title = "All Notes", noteCount }: TopBarProps) => {
  const { openMobileNav } = useMobileNav();
  const router = useRouter();
  const [voiceOpen,   setVoiceOpen]   = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Listen for voice shortcut from keyboard handler
  useEffect(() => {
    const handler = () => setVoiceOpen(true);
    window.addEventListener("noteable:voice", handler);
    return () => window.removeEventListener("noteable:voice", handler);
  }, []);

  return (
    <>
      <header
        className="relative z-20 flex items-center gap-2.5 px-4 h-14 shrink-0"
        style={{ background: "var(--bg-3)", borderBottom: "1px solid var(--border)" }}
      >
        {/* Mobile hamburger */}
        <button
          onClick={openMobileNav}
          className="md:hidden p-2 rounded-xl transition-all shrink-0"
          style={{ color: "var(--text-3)" }}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Title + count */}
        <div className="flex items-center gap-2 shrink-0 mr-1">
          <h1 className="text-[15px] font-black tracking-tight" style={{ color: "var(--text-1)" }}>
            {title}
          </h1>
          {noteCount != null && noteCount > 0 && (
            <span className="hidden sm:block text-[10px] font-mono text-violet-400 bg-violet-500/20 border border-violet-500/30 rounded-full px-2 py-0.5">
              {noteCount}
            </span>
          )}
        </div>

        <Divider />
        <SearchBar />
        <Divider />
        <ViewToggle view={view} setView={setView} />
        <Divider />

        {/* Voice */}
        <button
          onClick={() => setVoiceOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
          style={{ color: "var(--text-3)", border: "1px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent";      e.currentTarget.style.color = "var(--text-3)"; }}
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Voice</span>
        </button>

        {/* Summarize */}
        <button
          onClick={() => setSummaryOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-amber-400/70 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden lg:block">Summarize</span>
        </button>

        {/* Buddy */}
        <button
          onClick={() => router.push("/dashboard/buddy")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/25 transition-all"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden lg:block">Buddy</span>
        </button>

        {/* Bell */}
        <button className="relative p-2 rounded-xl transition-all" style={{ color: "var(--text-4)" }}>
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
        </button>

        <Divider />
        <ProfileMenu />

        {/* New note */}
        <motion.button
          onClick={() => { onNewNote(); router.push("/dashboard/note"); }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest shadow-[0_4px_14px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.55)] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </motion.button>
      </header>

      <VoiceModal    open={voiceOpen}   onClose={() => setVoiceOpen(false)}   />
      <SummarizerPanel open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </>
  );
};
