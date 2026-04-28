"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus, Trash2, Edit3, Check, X, FileText } from "lucide-react";
import { TopBar } from "@/components/ui/dashboard/TopBar";
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup } from "@/lib/hooks";
import { useNotesStore } from "@/lib/stores/notesStore";
import { Group } from "@/lib/api/types";

const GROUP_COLORS = ["#8b5cf6","#0ea5e9","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16"];

const colorFor = (group: Group, index: number) =>
  group.color ?? GROUP_COLORS[index % GROUP_COLORS.length];

function GroupCard({ group, index }: { group: Group; index: number }) {
  const router       = useRouter();
  const updateGroup  = useUpdateGroup();
  const deleteGroup  = useDeleteGroup();
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(group.name);
  const [confirm, setConfirm]   = useState(false);
  const color = colorFor(group, index);

  const saveRename = () => {
    if (name.trim() && name !== group.name)
      updateGroup.mutate({ id: group.id, payload: { name: name.trim() } });
    setEditing(false);
  };

  const handleDelete = () => {
    if (!confirm) { setConfirm(true); return; }
    deleteGroup.mutate(group.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col rounded-2xl p-5 cursor-pointer transition-all"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Color bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ backgroundColor: color }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mt-1">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}>
          <FolderOpen className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all" onClick={e => e.stopPropagation()}>
          <button onClick={() => { setEditing(true); setConfirm(false); }}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "var(--text-4)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}>
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: confirm ? "rgb(248,113,113)" : "var(--text-4)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgb(248,113,113)")}
            onMouseLeave={e => (e.currentTarget.style.color = confirm ? "rgb(248,113,113)" : "var(--text-4)")}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="mt-3 flex-1" onClick={() => !editing && router.push(`/dashboard?view=group&groupId=${group.id}`)}>
        {editing ? (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") { setName(group.name); setEditing(false); } }}
              className="flex-1 bg-transparent text-[15px] font-bold focus:outline-none border-b"
              style={{ color: "var(--text-1)", borderColor: color }}
            />
            <button onClick={saveRename}><Check className="w-3.5 h-3.5 text-emerald-400" /></button>
            <button onClick={() => { setName(group.name); setEditing(false); }}><X className="w-3.5 h-3.5" style={{ color: "var(--text-4)" }} /></button>
          </div>
        ) : (
          <h3 className="text-[15px] font-bold" style={{ color: "var(--text-1)" }}>{group.name}</h3>
        )}
        {confirm && (
          <p className="text-[10px] font-mono mt-1 text-red-400">Tap delete again to confirm</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}
        onClick={() => router.push(`/dashboard?view=group&groupId=${group.id}`)}>
        <FileText className="w-3 h-3" style={{ color: "var(--text-4)" }} />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-4)" }}>
          View notes
        </span>
      </div>
    </motion.div>
  );
}

function CreateGroupCard({ onCreated }: { onCreated?: () => void }) {
  const [active, setActive] = useState(false);
  const [name, setName]     = useState("");
  const createGroup         = useCreateGroup();

  const submit = () => {
    if (!name.trim()) return;
    createGroup.mutate({ name: name.trim() }, {
      onSuccess: () => { setName(""); setActive(false); onCreated?.(); },
    });
  };

  if (!active) return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setActive(true)}
      whileHover={{ y: -2 }}
      className="flex flex-col items-center justify-center rounded-2xl p-5 transition-all border-dashed"
      style={{ background: "var(--bg-2)", border: "1px dashed var(--border)", minHeight: "120px" }}>
      <Plus className="w-5 h-5 mb-2" style={{ color: "var(--text-4)" }} />
      <span className="text-[12px] font-mono uppercase tracking-widest" style={{ color: "var(--text-4)" }}>New Group</span>
    </motion.button>
  );

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col rounded-2xl p-5"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)" }}>
      <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-3" style={{ color: "var(--text-4)" }}>Group name</p>
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") { setActive(false); setName(""); } }}
        placeholder="e.g. Work, Research…"
        className="bg-transparent text-[15px] font-bold focus:outline-none border-b pb-1 mb-4"
        style={{ color: "var(--text-1)", borderColor: "var(--border-2)" }}
      />
      <div className="flex gap-2">
        <button onClick={() => { setActive(false); setName(""); }}
          className="flex-1 py-2 rounded-xl text-[11px] font-mono transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
          Cancel
        </button>
        <motion.button onClick={submit} disabled={!name.trim() || createGroup.isPending}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-violet-600 disabled:opacity-40 transition-all">
          Create
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function GroupsPage() {
  const { viewMode, setViewMode } = useNotesStore();
  const { data: groups = [], isLoading } = useGroups();

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      <TopBar view={viewMode} setView={setViewMode} onNewNote={() => {}} title="Groups" noteCount={groups.length} />
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {isLoading ? (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse h-36"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {groups.map((group, i) => (
                <GroupCard key={group.id} group={group} index={i} />
              ))}
            </AnimatePresence>
            <CreateGroupCard />
          </div>
        )}
      </div>
    </div>
  );
}
