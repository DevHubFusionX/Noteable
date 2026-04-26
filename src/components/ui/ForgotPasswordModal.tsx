"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
}

const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-blue-100/60" style={{ top: `${48 + i * 34}px` }} />
    ))}
  </div>
);

const HolePunches = () => (
  <div className="absolute left-0 top-0 bottom-0 w-[44px] flex flex-col justify-around py-10 pointer-events-none z-10">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="mx-auto w-3.5 h-3.5 rounded-full bg-white border border-slate-200 shadow-inner" />
    ))}
  </div>
);

type Step = "email" | "code" | "reset" | "done";

export const ForgotPasswordModal = ({ open, onClose, onBack }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const direction = React.useRef<1 | -1>(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const next = (s: Step) => {
    direction.current = 1;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(s); }, 1200);
  };

  const handleCodeChange = (val: string, i: number) => {
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleCodeKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const reset = () => {
    setStep("email");
    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setPassword("");
    setConfirm("");
  };

  const STEPS: Step[] = ["email", "code", "reset", "done"];
  const stepIndex = STEPS.indexOf(step);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="fp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="fp-modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative pointer-events-auto w-full max-w-[480px]"
            >
              {/* Paper stack */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl bg-slate-200/60 -z-10" />
              <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-slate-100 -z-10" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[100] w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.14)] bg-white relative" style={{ perspective: "1200px" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-yellow-100/90 border-x border-b border-yellow-200/60 z-20" />

                <AnimatePresence mode="wait" custom={direction.current}>
                  <motion.div
                    key={step}
                    custom={direction.current}
                    initial={(d: number) => ({ rotateY: d * 90, opacity: 0 })}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={(d: number) => ({ rotateY: d * -90, opacity: 0 })}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "center center", backfaceVisibility: "hidden" }}
                    className="relative bg-white"
                  >
                    <RuledLines />
                    <HolePunches />

                    <div className="relative z-10 pl-14 pr-8 pt-10 pb-8">

                      {/* Brand + back */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span className="font-bold text-[14px] tracking-tight text-slate-900">Noteable</span>
                        </div>
                        {step !== "done" && (
                          <button
                            onClick={step === "email" ? onBack : () => { direction.current = -1; setStep(STEPS[stepIndex - 1] as Step); }}
                            className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                            {step === "email" ? "Back to login" : "Back"}
                          </button>
                        )}
                      </div>

                      {/* Step progress dots */}
                      {step !== "done" && (
                        <div className="flex items-center gap-1.5 mb-7">
                          {(["email", "code", "reset"] as Step[]).map((s, i) => (
                            <div
                              key={s}
                              className={`h-1 rounded-full transition-all duration-300 ${stepIndex >= i ? "bg-main" : "bg-slate-200"}`}
                              style={{ width: stepIndex >= i ? "24px" : "8px" }}
                            />
                          ))}
                        </div>
                      )}

                      <AnimatePresence mode="wait">
                        {step === "email" && (
                          <motion.div key="email-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                            <h2 className="text-[22px] font-bold text-slate-900 mb-1">Forgot your password?</h2>
                            <p className="text-[13px] text-slate-400 mb-7">No stress. Enter your email and we'll send a reset code.</p>
                            <form onSubmit={e => { e.preventDefault(); next("code"); }} className="flex flex-col gap-4">
                              <input
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
                                style={{ fontFamily: "Georgia, serif" }}
                              />
                              <SubmitButton loading={loading} label="Send reset code" />
                            </form>
                          </motion.div>
                        )}

                        {step === "code" && (
                          <motion.div key="code-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                            <h2 className="text-[22px] font-bold text-slate-900 mb-1">Check your inbox</h2>
                            <p className="text-[13px] text-slate-400 mb-2">We sent a 6-digit code to</p>
                            <p className="text-[13px] font-semibold text-slate-700 mb-7 font-mono">{email}</p>
                            <form onSubmit={e => { e.preventDefault(); next("reset"); }} className="flex flex-col gap-6">
                              {/* OTP inputs */}
                              <div className="flex items-center gap-2 justify-between">
                                {code.map((c, i) => (
                                  <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={c}
                                    onChange={e => handleCodeChange(e.target.value, i)}
                                    onKeyDown={e => handleCodeKey(e, i)}
                                    className="w-11 h-12 text-center bg-slate-50 border border-slate-200 rounded-xl text-[18px] font-bold text-slate-800 outline-none focus:border-main/60 focus:ring-2 focus:ring-main/10 transition-all"
                                  />
                                ))}
                              </div>
                              <SubmitButton loading={loading} label="Verify code" />
                            </form>
                            <button className="text-[11px] font-mono text-slate-400 hover:text-main transition-colors uppercase tracking-widest mt-4 block mx-auto">
                              Resend code
                            </button>
                          </motion.div>
                        )}

                        {step === "reset" && (
                          <motion.div key="reset-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                            <h2 className="text-[22px] font-bold text-slate-900 mb-1">New password</h2>
                            <p className="text-[13px] text-slate-400 mb-7">Make it something your ex can't guess.</p>
                            <form onSubmit={e => { e.preventDefault(); next("done"); }} className="flex flex-col gap-3">
                              <input
                                type="password"
                                placeholder="New password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
                                style={{ fontFamily: "Georgia, serif" }}
                              />
                              <input
                                type="password"
                                placeholder="Confirm password"
                                required
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
                                style={{ fontFamily: "Georgia, serif" }}
                              />
                              {/* Password strength */}
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4].map(n => (
                                  <div
                                    key={n}
                                    className="flex-1 h-1 rounded-full transition-all duration-300"
                                    style={{ backgroundColor: password.length >= n * 3 ? (n <= 2 ? "#f59e0b" : "#10b981") : "#e2e8f0" }}
                                  />
                                ))}
                              </div>
                              <SubmitButton loading={loading} label="Reset password" />
                            </form>
                          </motion.div>
                        )}

                        {step === "done" && (
                          <motion.div key="done-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="py-8">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </div>
                            <h2 className="text-[22px] font-bold text-slate-900 mb-2">Password reset!</h2>
                            <p className="text-[13px] text-slate-400 mb-8 leading-relaxed">
                              You're all set. Your new password is locked in — unlike your old one 😅
                            </p>
                            <button
                              onClick={() => { reset(); onBack(); }}
                              className="group relative overflow-hidden w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-[13px] uppercase tracking-widest"
                            >
                              <motion.div className="absolute inset-0 bg-main" initial={{ x: "-100%" }} whileHover={{ x: 0 }} transition={{ duration: 0.25 }} />
                              <span className="relative z-10">Back to login</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const SubmitButton = ({ loading, label }: { loading: boolean; label: string }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-[13px] uppercase tracking-widest disabled:opacity-60"
  >
    <motion.div className="absolute inset-0 bg-main" initial={{ x: "-100%" }} whileHover={{ x: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} />
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      ) : label}
    </span>
  </motion.button>
);
