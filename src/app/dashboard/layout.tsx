"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/dashboard/Sidebar";
import { CommandPalette } from "@/components/ui/dashboard/CommandPalette";
import { MobileNavContext } from "@/lib/MobileNavContext";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { useAuthStore } from "@/lib/stores/authStore";
import { TOKEN_KEYS } from "@/lib/constants";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router          = useRouter();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const accessToken     = useAuthStore(s => s.accessToken);
  const fetchMe         = useAuthStore(s => s.fetchMe);
  const _hasHydrated    = useAuthStore(s => s._hasHydrated);
  const [checking, setChecking] = useState(true);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [active, setActive]       = useState("notes");
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useKeyboardShortcuts({
    onNewNote: () => router.push("/dashboard/note"),
    onCommandPalette: () => setPaletteOpen(p => !p),
    onSearch: () => {
      // Focus the search input in TopBar
      const input = document.querySelector<HTMLInputElement>("header input[placeholder*='Search']");
      input?.focus();
    },
    onVoiceCapture: () => {
      // Trigger voice modal — dispatch a custom event TopBar listens to
      window.dispatchEvent(new CustomEvent("noteable:voice"));
    },
    onNoteBuddy: () => router.push("/dashboard/buddy"),
  });

  useEffect(() => {
    if (!_hasHydrated) return;

    const check = async () => {
      const token = localStorage.getItem(TOKEN_KEYS.access);
      if (!token) {
        router.replace("/");
        return;
      }
      await fetchMe();
      const authed = useAuthStore.getState().isAuthenticated;
      if (!authed) {
        router.replace("/");
      } else {
        setChecking(false);
      }
    };
    check();
  }, [_hasHydrated, fetchMe, router]);

  if (checking) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return null;


  return (
    <MobileNavContext.Provider value={{ openMobileNav: () => setMobileOpen(true) }}>
      <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            active={active}
            setActive={setActive}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              >
                <Sidebar
                  active={active}
                  setActive={(id) => { setActive(id); setMobileOpen(false); }}
                  collapsed={false}
                  setCollapsed={() => setMobileOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden [&:has(.note-editor)]:pb-0 pb-[64px] sm:pb-0">
          {children}
        </div>
      </div>

      {/* Command palette — rendered outside the layout flow so it overlays everything */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onVoiceCapture={() => window.dispatchEvent(new CustomEvent("noteable:voice"))}
        onSearch={() => {
          const input = document.querySelector<HTMLInputElement>("header input[placeholder*='Search']");
          input?.focus();
        }}
      />
    </MobileNavContext.Provider>
  );
}
