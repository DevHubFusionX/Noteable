"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AuthTab } from "./useAuthForm";

const GOOGLE_PATHS = [
  { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" },
  { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" },
  { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" },
  { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" },
];

const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(14)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 h-px bg-blue-100/60" style={{ top: `${48 + i * 34}px` }} />
    ))}
  </div>
);

const SubmitButton = ({ loading, label }: { loading: boolean; label: string }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-[13px] uppercase tracking-widest mt-1 disabled:opacity-60"
  >
    <motion.div className="absolute inset-0 bg-main" initial={{ x: "-100%" }} whileHover={{ x: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} />
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
      ) : label}
    </span>
  </motion.button>
);

interface AuthFormProps {
  tab: AuthTab;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  name: string; setName: (v: string) => void;
  loading: boolean;
  done: boolean;
  apiError: string | null;
  direction: React.MutableRefObject<1 | -1>;
  switchTab: (t: AuthTab) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: () => void;
  onClose: () => void;
  onForgot: () => void;
}

export const AuthForm = ({
  tab, email, setEmail, password, setPassword,
  name, setName, loading, done, apiError, direction,
  switchTab, handleSubmit, reset, onClose, onForgot,
}: AuthFormProps) => (
  <div className="flex-1 bg-white relative" style={{ perspective: "1200px" }}>
    {/* Tape strip */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-yellow-100/90 border-x border-b border-yellow-200/60 z-20" />

    <AnimatePresence mode="wait" custom={direction.current}>
      <motion.div
        key={done ? "done" : tab}
        custom={direction.current}
        initial={(d: number) => ({ rotateY: d * 90, opacity: 0 })}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={(d: number) => ({ rotateY: d * -90, opacity: 0 })}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center center", backfaceVisibility: "hidden" }}
        className="relative bg-white"
      >
        <RuledLines />

        <div className="relative z-10 p-10">
          {done ? (
            <SuccessState tab={tab} onClose={() => { reset(); onClose(); }} />
          ) : (
            <FormBody
              tab={tab} email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              name={name} setName={setName}
              loading={loading} apiError={apiError}
              switchTab={switchTab}
              handleSubmit={handleSubmit} onForgot={onForgot}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);

const SuccessState = ({ tab, onClose }: { tab: AuthTab; onClose: () => void }) => (
  <div className="flex flex-col items-start gap-4 py-10">
    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
    <div>
      <h3 className="text-[18px] font-bold text-slate-900">
        {tab === "signup" ? "You're on the list!" : "Welcome back!"}
      </h3>
      <p className="text-[13px] text-slate-400 mt-1">
        {tab === "signup" ? "We'll be in touch with early access soon." : "Redirecting you to your workspace…"}
      </p>
    </div>
    <button onClick={onClose} className="text-[11px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors">
      Close ↗
    </button>
  </div>
);

interface FormBodyProps {
  tab: AuthTab;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  name: string; setName: (v: string) => void;
  loading: boolean;
  apiError: string | null;
  switchTab: (t: AuthTab) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
}

const FormBody = ({ tab, email, setEmail, password, setPassword, name, setName, loading, apiError, switchTab, handleSubmit, onForgot }: FormBodyProps) => (
  <div>
    {/* Tabs */}
    <div className="flex items-center gap-1 mb-7 bg-slate-50 rounded-xl p-1 w-fit">
      {(["signup", "login"] as const).map(t => (
        <button
          key={t}
          onClick={() => switchTab(t)}
          className={`relative px-5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${tab === t ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
        >
          {tab === t && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200" />}
          <span className="relative z-10">{t === "signup" ? "Sign up" : "Log in"}</span>
        </button>
      ))}
    </div>

    {/* Google */}
    <button className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-5">
      <svg width="16" height="16" viewBox="0 0 24 24">
        {GOOGLE_PATHS.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
      </svg>
      Continue with Google
    </button>

    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[11px] font-mono text-slate-300 uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {tab === "signup" && (
        <input
          type="text" placeholder="Full name" value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
          style={{ fontFamily: "Georgia, serif" }}
        />
      )}
      <input
        type="email" placeholder="Email address" required value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
        style={{ fontFamily: "Georgia, serif" }}
      />
      <input
        type="password" placeholder="Password" required value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-main/50 focus:ring-2 focus:ring-main/10 transition-all"
        style={{ fontFamily: "Georgia, serif" }}
      />
      {tab === "login" && (
        <div className="flex justify-end -mt-1">
          <button type="button" onClick={onForgot} className="text-[11px] font-mono text-slate-400 hover:text-main transition-colors uppercase tracking-widest">
            Forgot password?
          </button>
        </div>
      )}
      <SubmitButton loading={loading} label={tab === "signup" ? "Create account" : "Sign in"} />

      {/* API error */}
      {apiError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] text-red-500 text-center mt-1 font-medium"
        >
          {apiError}
        </motion.p>
      )}
    </form>

    <p className="text-[11px] text-slate-300 text-center mt-5 font-mono">
      {tab === "signup" ? "Already have an account? " : "No account yet? "}
      <button onClick={() => switchTab(tab === "signup" ? "login" : "signup")} className="text-main hover:underline">
        {tab === "signup" ? "Log in" : "Sign up"}
      </button>
    </p>
  </div>
);
