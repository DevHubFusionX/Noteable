"use client";

import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  view:    "grid" | "list";
  setView: (v: "grid" | "list") => void;
}

export const ViewToggle = ({ view, setView }: ViewToggleProps) => (
  <div
    className="hidden sm:flex items-center gap-0.5 rounded-xl p-0.5"
    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
  >
    {(["grid", "list"] as const).map((v) => (
      <button
        key={v}
        onClick={() => setView(v)}
        className="relative p-1.5 rounded-lg transition-all"
        style={{ color: view === v ? "var(--text-1)" : "var(--text-4)" }}
      >
        {view === v && (
          <motion.div
            layoutId="view-pill"
            className="absolute inset-0 rounded-lg"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">
          {v === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
        </span>
      </button>
    ))}
  </div>
);
