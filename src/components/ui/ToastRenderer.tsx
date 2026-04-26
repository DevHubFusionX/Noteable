"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUiStore, ToastVariant } from "@/lib/stores/uiStore";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle  className="w-4 h-4 text-emerald-400" />,
  error:   <XCircle      className="w-4 h-4 text-red-400" />,
  info:    <Info         className="w-4 h-4 text-blue-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

const BORDERS: Record<ToastVariant, string> = {
  success: "rgba(16,185,129,0.3)",
  error:   "rgba(239,68,68,0.3)",
  info:    "rgba(59,130,246,0.3)",
  warning: "rgba(245,158,11,0.3)",
};

export const ToastRenderer = () => {
  const { toasts, dismissToast } = useUiStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{    opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[260px] max-w-sm"
            style={{
              background:   "var(--bg-2, #111)",
              border:       `1px solid ${BORDERS[toast.variant]}`,
              boxShadow:    "0 8px 32px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="shrink-0">{ICONS[toast.variant]}</span>
            <p className="flex-1 text-[13px] font-medium" style={{ color: "var(--text-1, #fff)" }}>
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-0.5 rounded-lg transition-colors"
              style={{ color: "var(--text-4, rgba(255,255,255,0.2))" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
