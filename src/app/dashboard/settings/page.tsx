"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sun, FileCode, Cpu, Bell, Keyboard, Download, Upload, HardDrive, ChevronRight, Check, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/ui/dashboard/TopBar";
import { useTheme } from "@/lib/ThemeContext";

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <motion.button onClick={onChange}
    className="relative w-9 h-5 rounded-full transition-colors shrink-0"
    style={{ background: on ? "var(--text-1)" : "var(--surface-2)" }}>
    <motion.div animate={{ x: on ? 16 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm"
      style={{ background: on ? "var(--bg)" : "var(--text-4)" }} />
  </motion.button>
);

const SegmentControl = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center gap-0.5 rounded-xl p-0.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
    {options.map(opt => (
      <button key={opt} onClick={() => onChange(opt)}
        className="relative flex-1 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all capitalize"
        style={{ color: value === opt ? "var(--text-1)" : "var(--text-4)" }}>
        {value === opt && (
          <motion.div layoutId={`seg-${options.join()}`} className="absolute inset-0 rounded-lg"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }} />
        )}
        <span className="relative z-10">{opt}</span>
      </button>
    ))}
  </div>
);

const SelectField = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="rounded-xl px-3 py-2 text-[12px] font-mono focus:outline-none transition-all cursor-pointer"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Section = ({ title, icon: Icon, children, delay = 0 }: { title: string; icon: React.ElementType; children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col gap-4 p-5 rounded-2xl"
    style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
    <div className="flex items-center gap-2.5 pb-1" style={{ borderBottom: "1px solid var(--border)" }}>
      <Icon className="w-3.5 h-3.5" style={{ color: "var(--text-4)" }} strokeWidth={1.8} />
      <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--text-3)" }}>{title}</p>
    </div>
    {children}
  </motion.div>
);

const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>{label}</p>
      {sub && <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-4)" }}>{sub}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Divider = () => <div className="h-px" style={{ background: "var(--border)" }} />;

const PasswordRow = () => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = () => { setOpen(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--text-2)" }}>Password</p>
          <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-4)" }}>Last changed 3 months ago</p>
        </div>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all"
          style={{ color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
          {saved ? <><Check className="w-3 h-3 text-emerald-400" /> Saved</> : "Change"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="flex flex-col gap-2 pt-1">
              {["Current password", "New password", "Confirm new password"].map(p => (
                <input key={p} type="password" placeholder={p}
                  className="w-full rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none transition-all font-mono"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)" }} />
              ))}
              <motion.button onClick={save} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest mt-1 transition-all"
                style={{ background: "var(--text-1)", color: "var(--bg)" }}>
                Update Password
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TwoFARow = () => {
  const [on, setOn] = useState(false);
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <Row label="Two-factor authentication" sub={on ? "Enabled via authenticator app" : "Add an extra layer of security"}>
        <Toggle on={on} onChange={() => { if (!on) setShowQR(true); else setOn(false); }} />
      </Row>
      <AnimatePresence>
        {showQR && !on && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-24 h-24 rounded-xl grid grid-cols-6 gap-0.5 p-2" style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="rounded-[2px]" style={{ background: Math.random() > 0.5 ? "var(--text-1)" : "transparent" }} />
                ))}
              </div>
              <p className="text-[11px] font-mono text-center" style={{ color: "var(--text-3)" }}>Scan with your authenticator app</p>
              <button onClick={() => { setOn(true); setShowQR(false); }}
                className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                style={{ background: "var(--text-1)", color: "var(--bg)" }}>
                I've scanned it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SHORTCUTS = [
  { action: "New note",       keys: ["⌘", "N"] },
  { action: "Search",         keys: ["⌘", "K"] },
  { action: "Open Buddy",     keys: ["⌘", "B"] },
  { action: "Voice capture",  keys: ["⌘", "⇧", "V"] },
  { action: "Summarize note", keys: ["⌘", "⇧", "S"] },
  { action: "Toggle sidebar", keys: ["⌘", "\\"] },
];

const ShortcutsGrid = () => (
  <div className="flex flex-col gap-1">
    {SHORTCUTS.map(s => (
      <div key={s.action} className="flex items-center justify-between px-3 py-2 rounded-xl transition-all"
        onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-3)" }}>{s.action}</span>
        <div className="flex items-center gap-1">
          {s.keys.map(k => (
            <kbd key={k} className="px-2 py-0.5 rounded-lg text-[11px] font-mono"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-3)" }}>{k}</kbd>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const StorageBar = () => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between">
      <span className="text-[12px] font-mono" style={{ color: "var(--text-3)" }}>Used storage</span>
      <span className="text-[12px] font-mono" style={{ color: "var(--text-2)" }}>24 MB / 1 GB</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
      <motion.div className="h-full rounded-full" style={{ background: "var(--text-2)" }}
        initial={{ width: 0 }} animate={{ width: "2.4%" }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </div>
    <div className="flex gap-3 mt-1">
      {[{ label: "Notes", opacity: "0.6" }, { label: "Voice", opacity: "0.3" }, { label: "Other", opacity: "0.15" }].map(d => (
        <div key={d.label} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: `rgba(var(--text-1-raw, 255,255,255), ${d.opacity})`, opacity: 0.7 }} />
          <span className="text-[10px] font-mono" style={{ color: "var(--text-4)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const ClearHistoryRow = () => {
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const execute = () => { setConfirm(false); setDone(true); setTimeout(() => setDone(false), 3000); };
  return (
    <Row label="Clear AI conversation history" sub="Removes all Note Buddy chat logs">
      {done
        ? <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400"><Check className="w-3 h-3" /> Cleared</span>
        : confirm
          ? <div className="flex items-center gap-2">
              <button onClick={() => setConfirm(false)} className="text-[11px] font-mono transition-colors" style={{ color: "var(--text-4)" }}>Cancel</button>
              <button onClick={execute} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-mono text-red-400 bg-red-500/15 border border-red-500/25 hover:bg-red-500/25 transition-all">
                <AlertTriangle className="w-3 h-3" /> Confirm
              </button>
            </div>
          : <button onClick={() => setConfirm(true)} className="px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all"
              style={{ color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
              Clear
            </button>
      }
    </Row>
  );
};

export default function SettingsPage() {
  const { theme, fontSize, density, setTheme, setFontSize, setDensity } = useTheme();
  const [noteFormat, setNoteFormat] = useState("Markdown");
  const [autoSave, setAutoSave] = useState("30s");
  const [aiLang, setAiLang] = useState("English");
  const [emailFreq, setEmailFreq] = useState("Weekly");
  const [spellCheck, setSpellCheck] = useState(true);
  const [onDevice, setOnDevice] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar view="grid" setView={() => {}} onNewNote={() => {}} />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-[22px] font-black tracking-tight" style={{ color: "var(--text-1)" }}>Settings</h1>
            <p className="text-[12px] font-mono mt-1" style={{ color: "var(--text-4)" }}>Manage your account, appearance and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-5">
              <Section title="Account" icon={Lock} delay={0.05}>
                <PasswordRow />
                <Divider />
                <TwoFARow />
                <Divider />
                <Row label="Connected accounts" sub="Google, Apple Sign-in">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all"
                    style={{ color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}>
                    Manage <ChevronRight className="w-3 h-3" />
                  </button>
                </Row>
              </Section>

              <Section title="Appearance" icon={Sun} delay={0.1}>
                <Row label="Theme">
                  <SegmentControl options={["dark", "light", "system"]} value={theme} onChange={v => setTheme(v as "dark"|"light"|"system")} />
                </Row>
                <Row label="Font size">
                  <SegmentControl options={["compact", "default", "large"]} value={fontSize} onChange={v => setFontSize(v as "compact"|"default"|"large")} />
                </Row>
                <Row label="Card density">
                  <SegmentControl options={["cozy", "comfortable"]} value={density} onChange={v => setDensity(v as "cozy"|"comfortable")} />
                </Row>
              </Section>

              <Section title="Editor" icon={FileCode} delay={0.15}>
                <SelectField label="Default format" options={["Plain text", "Markdown", "Rich text"]} value={noteFormat} onChange={setNoteFormat} />
                <SelectField label="Auto-save" options={["10s", "30s", "1 min", "Manual"]} value={autoSave} onChange={setAutoSave} />
                <Row label="Spell check" sub="Underline misspelled words">
                  <Toggle on={spellCheck} onChange={() => setSpellCheck(!spellCheck)} />
                </Row>
              </Section>

              <Section title="Notifications" icon={Bell} delay={0.2}>
                <Row label="Push notifications" sub="Browser & mobile alerts">
                  <Toggle on={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
                </Row>
                <Row label="Email digest" sub="Activity summary">
                  <Toggle on={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                </Row>
                {emailNotifs && <SelectField label="Frequency" options={["Daily", "Weekly", "Monthly"]} value={emailFreq} onChange={setEmailFreq} />}
              </Section>
            </div>

            <div className="flex flex-col gap-5">
              <Section title="AI & Privacy" icon={Cpu} delay={0.08}>
                <Row label="On-device AI only" sub="Never send notes to external servers">
                  <Toggle on={onDevice} onChange={() => setOnDevice(!onDevice)} />
                </Row>
                <SelectField label="AI language" options={["English", "Spanish", "French", "German", "Japanese"]} value={aiLang} onChange={setAiLang} />
                <Divider />
                <ClearHistoryRow />
              </Section>

              <Section title="Keyboard Shortcuts" icon={Keyboard} delay={0.13}>
                <ShortcutsGrid />
              </Section>

              <Section title="Data & Storage" icon={HardDrive} delay={0.18}>
                <StorageBar />
                <Divider />
                <div className="flex flex-col gap-2">
                  {[{ label: "Export as Markdown", icon: Download }, { label: "Export as JSON", icon: Download }, { label: "Import notes", icon: Upload }].map(({ label, icon: Icon }) => (
                    <motion.button key={label} whileHover={{ x: 2 }}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                      style={{ color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-1)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />{label}
                    </motion.button>
                  ))}
                </div>
              </Section>
            </div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center text-[10px] font-mono pb-4" style={{ color: "var(--text-4)" }}>
            Noteable v0.1.0 · Built with privacy in mind
          </motion.p>
        </div>
      </div>
    </div>
  );
}
