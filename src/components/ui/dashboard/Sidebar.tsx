"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Sparkles, Search,
  FolderOpen, Trash2, Plus,
  Settings, LogOut, ChevronRight,
  Archive, Pin,
} from "lucide-react";
import { useGroups } from "@/lib/hooks";
import { useUiStore } from "@/lib/stores/uiStore";

const NAV_MAIN = [
  { id: "notes",   label: "All Notes",  icon: FileText,  badge: null },
  { id: "buddy",   label: "Note Buddy", icon: Sparkles,  badge: "AI" },
  { id: "search",  label: "Search",     icon: Search,    badge: null },
];

const NAV_ORGANIZE = [
  { id: "pinned",  label: "Pinned",  icon: Pin,        badge: null },
  { id: "archive", label: "Archive", icon: Archive,    badge: null },
  { id: "groups",  label: "Groups",  icon: FolderOpen, badge: null },
  { id: "trash",   label: "Trash",   icon: Trash2,     badge: null },
];

// Palette for groups that have no color from the API
const GROUP_COLORS = ["#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

// DRY: animated label that fades in/out when sidebar collapses
const CollapseLabel = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, x: -6 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -6 }}
    transition={{ duration: 0.18 }}
    className="relative z-10 text-[13px] flex-1 text-left"
  >
    {children}
  </motion.span>
);

const FLASH_COLORS: Record<string, string> = {
  trash:   "rgba(239,68,68,0.7)",
  archive: "rgba(251,191,36,0.7)",
  pinned:  "rgba(139,92,246,0.7)",
};

const NavItem = ({ item, isActive, collapsed, onClick, flash }: {
  item: { id: string; label: string; icon: React.ElementType; badge: string | null };
  isActive: boolean; collapsed: boolean; onClick: () => void; flash?: boolean;
}) => {
  const Icon  = item.icon;
  const color = FLASH_COLORS[item.id] ?? "rgba(139,92,246,0.7)";
  return (
    <motion.button onClick={onClick} whileHover={{ x: collapsed ? 0 : 2 }}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
      style={{ color: isActive ? "var(--text-1)" : "var(--text-3)" }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      {isActive && (
        <motion.div layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }} />
      )}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
      )}

      {/* Icon wrapper with liquid drop animation */}
      <div className="relative z-10 shrink-0">
        {/* Ripple drop */}
        <AnimatePresence>
          {flash && (
            <motion.div
              key="drop"
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: color, filter: "blur(2px)" }}
            />
          )}
        </AnimatePresence>
        {/* Splat drops */}
        <AnimatePresence>
          {flash && [0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.div
              key={`splat-${deg}`}
              initial={{ x: 0, y: 0, scale: 1, opacity: 0.9 }}
              animate={{
                x: Math.cos((deg * Math.PI) / 180) * 10,
                y: Math.sin((deg * Math.PI) / 180) * 10,
                scale: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.45, delay: i * 0.02, ease: "easeOut" }}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ background: color, top: "50%", left: "50%", marginTop: "-3px", marginLeft: "-3px" }}
            />
          ))}
        </AnimatePresence>
        <motion.div
          animate={flash ? { scale: [1, 1.5, 0.85, 1.15, 1], rotate: [0, -12, 8, -4, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Icon className="w-[15px] h-[15px]" strokeWidth={isActive ? 2.2 : 1.8}
            style={{ color: flash ? color : undefined, filter: flash ? `drop-shadow(0 0 4px ${color})` : undefined }}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <CollapseLabel>
            <span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span>
          </CollapseLabel>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <span className="relative z-10 text-[8px] font-black uppercase tracking-widest bg-violet-600 text-white rounded-full px-1.5 py-0.5">
          {item.badge}
        </span>
      )}
    </motion.button>
  );
};

export const Sidebar = ({ active, setActive, collapsed, setCollapsed }: SidebarProps) => {
  const [groupsOpen, setGroupsOpen] = useState(true);
  const router = useRouter();
  const { data: groups = [] } = useGroups();
  const { sidebarFlash } = useUiStore();

  const flashMap: Record<string, string> = {
    trash:   "trash",
    archive: "archive",
    pinned:  "pinned",
  };

  const handleNav = (id: string) => {
    setActive(id);
    if (id === "buddy")   router.push("/dashboard/buddy");
    else if (id === "pinned")  router.push("/dashboard?view=pinned");
    else if (id === "archive") router.push("/dashboard?view=archive");
    else if (id === "trash")   router.push("/dashboard/trash");
    else if (id === "groups")  router.push("/dashboard/groups");
    else router.push("/dashboard");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 232 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full shrink-0 overflow-hidden"
      style={{ background: "var(--bg-3)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className={`flex items-center h-14 px-3 shrink-0 ${collapsed ? "justify-center" : "gap-3"}`}
        style={{ borderBottom: "1px solid var(--border)" }}>
        <motion.button onClick={() => setCollapsed(!collapsed)}
          whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(139,92,246,0.45)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </motion.button>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }} className="flex flex-col leading-none min-w-0">
              <span className="text-[15px] font-black tracking-tight" style={{ color: "var(--text-1)" }}>Noteable</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-violet-500 mt-0.5">workspace</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Note */}
      <div className="px-3 py-3 shrink-0">
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/dashboard/note")}
          className={`w-full flex items-center gap-2.5 rounded-xl bg-violet-600 text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-all ${collapsed ? "justify-center py-2.5 px-0" : "px-3.5 py-2.5"}`}>
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="text-[11px] font-black uppercase tracking-widest"
              >
                New Note
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none px-2 flex flex-col gap-4 py-1">
        <div className="flex flex-col gap-0.5">
          <AnimatePresence>
            {!collapsed && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-3 pt-1 pb-1.5 text-[9px] font-mono uppercase tracking-[0.25em]"
                style={{ color: "var(--text-4)" }}>Main</motion.p>
            )}
          </AnimatePresence>
          {NAV_MAIN.map(item => (
            <NavItem key={item.id} item={item} isActive={active === item.id} collapsed={collapsed} onClick={() => handleNav(item.id)} />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <AnimatePresence>
            {!collapsed && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.25em]"
                style={{ color: "var(--text-4)" }}>Organize</motion.p>
            )}
          </AnimatePresence>
          {NAV_ORGANIZE.map(item => (
            <NavItem key={item.id} item={item} isActive={active === item.id} collapsed={collapsed}
              flash={sidebarFlash === flashMap[item.id]}
              onClick={() => handleNav(item.id)} />
          ))}
        </div>

        {/* Groups */}
        <div className="flex flex-col gap-0.5">
          <AnimatePresence>
            {!collapsed && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setGroupsOpen(!groupsOpen)}
                className="w-full flex items-center justify-between px-3 pb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em]" style={{ color: "var(--text-4)" }}>Groups</span>
                <motion.div animate={{ rotate: groupsOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-3 h-3" style={{ color: "var(--text-4)" }} />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && groupsOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden flex flex-col gap-0.5">
                {groups.map((g, i) => (
                  <motion.button key={g.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }} whileHover={{ x: 2 }}
                    onClick={() => router.push(`/dashboard?view=group&groupId=${g.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                    style={{ color: "var(--text-3)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}>
                    <div className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: g.color ?? GROUP_COLORS[i % GROUP_COLORS.length] }} />
                    <span className="text-[13px] font-medium flex-1 text-left">{g.name}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex flex-col items-center gap-2.5 py-1">
              {groups.map((g, i) => (
                <div key={g.id} className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: g.color ?? GROUP_COLORS[i % GROUP_COLORS.length] }} />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-2 py-2 shrink-0 flex flex-col gap-0.5" style={{ borderTop: "1px solid var(--border)" }}>
        <motion.button onClick={() => router.push("/dashboard/settings")} whileHover={{ x: collapsed ? 0 : 2 }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ color: "var(--text-3)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-3)"; }}>
          <Settings className="w-[15px] h-[15px] shrink-0" strokeWidth={1.8} />
          <AnimatePresence>
            {!collapsed && <CollapseLabel>Settings</CollapseLabel>}
          </AnimatePresence>
        </motion.button>
        <motion.button whileHover={{ x: collapsed ? 0 : 2 }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ color: "rgba(248,113,113,0.5)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "rgb(248,113,113)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(248,113,113,0.5)"; }}>
          <LogOut className="w-[15px] h-[15px] shrink-0" strokeWidth={1.8} />
          <AnimatePresence>
            {!collapsed && <CollapseLabel>Log out</CollapseLabel>}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};
