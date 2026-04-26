"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { useLogout } from "@/lib/hooks/useAuth";

export const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const router  = useRouter();
  const user    = useAuthStore(s => s.user);
  const logout  = useLogout();

  const initial = user?.name?.[0]?.toUpperCase() ?? "N";

  const NAV_ITEMS = [
    {
      label: "View Profile",
      href:  "/dashboard/profile",
      d:     "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 20a9 9 0 0 1 18 0",
    },
    {
      label: "Settings",
      href:  "/dashboard/settings",
      d:     "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all"
        onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-[11px] font-black text-white shadow-[0_2px_8px_rgba(139,92,246,0.4)]">
          {initial}
        </div>
        <AnimatePresence mode="wait">
          {!open
            ? <ChevronDown key="d" className="w-3 h-3" style={{ color: "var(--text-4)" }} />
            : <ChevronUp   key="u" className="w-3 h-3" style={{ color: "var(--text-3)" }} />
          }
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
            style={{
              background: "var(--bg-2)",
              border:     "1px solid var(--border-2)",
              boxShadow:  "0 16px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-[13px] font-black text-white shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate" style={{ color: "var(--text-1)" }}>
                  {user?.name ?? "Noteable User"}
                </p>
                <p className="text-[10px] font-mono truncate" style={{ color: "var(--text-3)" }}>
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Nav items */}
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => { router.push(item.href); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium transition-colors"
                style={{ color: "var(--text-3)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent";      e.currentTarget.style.color = "var(--text-3)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.d} />
                </svg>
                {item.label}
              </button>
            ))}

            {/* Sign out */}
            <div style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={() => { logout.mutate(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
