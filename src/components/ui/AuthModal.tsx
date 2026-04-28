"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLeftPanel } from "./auth/AuthLeftPanel";
import { AuthForm } from "./auth/AuthForm";
import { useAuthForm } from "./auth/useAuthForm";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const form = useAuthForm();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative pointer-events-auto w-full max-w-[780px]"
              >
                {/* Paper stack — hidden on mobile */}
                <div className="hidden sm:block absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-slate-200/60 -z-10" />
                <div className="hidden sm:block absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-slate-100 -z-10" />

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 z-[100] w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 2-col on sm+, single col on mobile */}
                <div className="flex rounded-2xl overflow-hidden border border-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
                  <div className="hidden sm:block">
                    <AuthLeftPanel tab={form.tab} />
                  </div>
                  <AuthForm
                    tab={form.tab}
                    email={form.email} setEmail={form.setEmail}
                    password={form.password} setPassword={form.setPassword}
                    name={form.name} setName={form.setName}
                    loading={form.loading}
                    done={form.done}
                    apiError={form.apiError}
                    direction={form.direction}
                    switchTab={form.switchTab}
                    handleSubmit={form.handleSubmit}
                    reset={form.reset}
                    onClose={onClose}
                    onForgot={() => form.setForgotOpen(true)}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ForgotPasswordModal
        open={form.forgotOpen}
        onClose={() => form.setForgotOpen(false)}
        onBack={() => { form.setForgotOpen(false); form.switchTab("login"); }}
      />
    </>
  );
};
