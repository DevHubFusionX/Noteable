"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Edit3, FileText, Mic, Sparkles, Zap, Shield, Bell } from "lucide-react";
import { TopBar } from "@/components/ui/dashboard/TopBar";

const Avatar = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative w-20 h-20 shrink-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div className="absolute inset-0 rounded-2xl"
        style={{ background: "conic-gradient(from 0deg, var(--text-1), var(--text-3), var(--text-1), var(--text-3), var(--text-1))", padding: "1.5px" }}
        animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
        <div className="w-full h-full rounded-2xl" style={{ background: "var(--bg)" }} />
      </motion.div>
      <div className="absolute inset-[2px] rounded-2xl flex items-center justify-center text-[28px] font-black"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-1)" }}>N</div>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-[2px] rounded-2xl bg-black/70 flex flex-col items-center justify-center gap-1">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-[8px] font-mono text-white/70 uppercase tracking-widest">Change</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2" style={{ borderColor: "var(--bg)" }} />
    </div>
  );
};

const EditableField = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(false);
  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>{label}</p>
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all"
        style={{ background: editing ? "var(--surface-2)" : "var(--surface)", border: `1px solid ${editing ? "var(--border-2)" : "var(--border)"}` }}>
        {editing
          ? <input autoFocus value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && save()}
              className={`flex-1 bg-transparent text-[13px] focus:outline-none ${mono ? "font-mono" : "font-medium"}`}
              style={{ color: "var(--text-1)" }} />
          : <span className={`flex-1 text-[13px] ${mono ? "font-mono" : "font-medium"}`} style={{ color: "var(--text-2)" }}>{val}</span>
        }
        <motion.button onClick={() => editing ? save() : setEditing(true)} whileTap={{ scale: 0.9 }}
          className="shrink-0 transition-colors" style={{ color: "var(--text-4)" }}>
          <AnimatePresence mode="wait">
            {saved ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-3.5 h-3.5 text-emerald-400" /></motion.div>
              : editing ? <motion.div key="s" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-3.5 h-3.5" style={{ color: "var(--text-2)" }} /></motion.div>
              : <motion.div key="e" initial={{ scale: 0 }} animate={{ scale: 1 }}><Edit3 className="w-3.5 h-3.5" /></motion.div>}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

const STATS = [
  { label: "Notes",     value: "46", icon: FileText },
  { label: "Voice",     value: "12", icon: Mic      },
  { label: "AI chats",  value: "38", icon: Sparkles },
  { label: "Summaries", value: "9",  icon: Zap      },
];

const StatsGrid = () => (
  <div className="grid grid-cols-2 gap-2">
    {STATS.map((s, i) => {
      const Icon = s.icon;
      return (
        <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }} whileHover={{ y: -2 }}
          className="flex items-center gap-3 p-4 rounded-xl transition-all cursor-default"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
          <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--text-4)" }} strokeWidth={1.5} />
          <div>
            <p className="text-[20px] font-black leading-none" style={{ color: "var(--text-1)" }}>{s.value}</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--text-4)" }}>{s.label}</p>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const WEEKS = 15;
const heat = Array.from({ length: WEEKS }, () =>
  Array.from({ length: 7 }, () => Math.random() > 0.45 ? Math.floor(Math.random() * 4) + 1 : 0)
);
const heatOpacity = (v: number) => ["0.04", "0.15", "0.30", "0.50", "0.80"][v] ?? "0.04";

const Heatmap = () => (
  <div className="flex flex-col gap-2.5">
    <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Activity — last 15 weeks</p>
    <div className="flex gap-1">
      {heat.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1 flex-1">
          {week.map((val, di) => (
            <motion.div key={di} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: wi * 0.015 + di * 0.008, duration: 0.25 }} whileHover={{ scale: 1.6 }}
              className="w-full aspect-square rounded-sm cursor-pointer transition-all"
              style={{ background: `rgba(var(--text-1-raw, 255,255,255), ${heatOpacity(val)})` }} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <motion.button onClick={onChange} className="relative w-9 h-5 rounded-full transition-colors shrink-0"
    style={{ background: on ? "var(--text-1)" : "var(--surface-2)" }}>
    <motion.div animate={{ x: on ? 16 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm"
      style={{ background: on ? "var(--bg)" : "var(--text-4)" }} />
  </motion.button>
);

const PREFS = [
  { label: "Email notifications", sub: "Weekly digest & activity",  icon: Bell,   key: "email" },
  { label: "On-device AI only",   sub: "Never send data to servers", icon: Shield, key: "local" },
];

const Preferences = () => {
  const [prefs, setPrefs] = useState({ email: true, local: true });
  return (
    <div className="flex flex-col gap-2">
      {PREFS.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div key={p.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
            <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--text-4)" }} strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: "var(--text-2)" }}>{p.label}</p>
              <p className="text-[11px] font-mono" style={{ color: "var(--text-4)" }}>{p.sub}</p>
            </div>
            <Toggle on={prefs[p.key as keyof typeof prefs]} onChange={() => setPrefs(v => ({ ...v, [p.key]: !v[p.key as keyof typeof prefs] }))} />
          </motion.div>
        );
      })}
    </div>
  );
};

const DangerZone = () => {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-1" style={{ color: "var(--text-4)" }}>Danger zone</p>
      <button className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-[12px] font-medium transition-all"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-1)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
        Export all notes
      </button>
      <motion.button onClick={() => setConfirm(!confirm)}
        animate={{ borderColor: confirm ? "rgba(239,68,68,0.4)" : "var(--border)" }}
        className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-[12px] font-medium text-red-400/40 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {confirm ? "Tap again to confirm deletion" : "Delete account"}
      </motion.button>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar view="grid" setView={() => {}} onNewNote={() => {}} />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

          {/* Identity header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-5 p-5 rounded-2xl"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <Avatar />
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-black tracking-tight leading-none" style={{ color: "var(--text-1)" }}>Noteable User</h1>
              <p className="text-[12px] font-mono mt-1" style={{ color: "var(--text-3)" }}>user@noteable.app</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] rounded-full px-2.5 py-1"
                  style={{ color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                  Member since 2024
                </span>
                <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-400/80 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}
                className="p-5 rounded-2xl flex flex-col gap-4"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Profile</p>
                <EditableField label="Display name" value="Noteable User" />
                <EditableField label="Email" value="user@noteable.app" mono />
                <EditableField label="Bio" value="Building in public. Notes are my second brain." />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} className="flex flex-col gap-3">
                <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Preferences</p>
                <Preferences />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
                <DangerZone />
              </motion.div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }} className="flex flex-col gap-3">
                <p className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: "var(--text-4)" }}>Overview</p>
                <StatsGrid />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}
                className="p-5 rounded-2xl" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <Heatmap />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
