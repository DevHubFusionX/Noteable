"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Square, RotateCcw, Check, Loader2 } from "lucide-react";
import { notesApi } from "@/lib/api/notes";
import { useCreateNote } from "@/lib/hooks";

const BARS = [3, 6, 9, 5, 8, 4, 10, 6, 7, 3, 9, 5, 8, 4, 6, 10, 3, 7];
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

interface VoiceModalProps { open: boolean; onClose: () => void; }

export const VoiceModal = ({ open, onClose }: VoiceModalProps) => {
  const [phase, setPhase]         = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [seconds, setSeconds]     = useState(0);
  const [transcript, setTranscript] = useState("");
  const [error, setError]         = useState<string | null>(null);

  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const createNote  = useCreateNote();

  useEffect(() => {
    if (!open) {
      setPhase("idle");
      setSeconds(0);
      setTranscript("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "recording") return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setPhase("processing");
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const file = new File([blob], "recording.webm", { type: "audio/webm" });
          const { result } = await notesApi.transcribeAudio(file);
          setTranscript(result);
          setPhase("done");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Transcription failed");
          setPhase("idle");
        }
      };
      mediaRef.current = recorder;
      recorder.start();
      setPhase("recording");
    } catch {
      setError("Microphone access denied");
    }
  };

  const stopRecording = () => mediaRef.current?.stop();

  const handleMainBtn = () => {
    if (phase === "idle")      startRecording();
    if (phase === "recording") stopRecording();
  };

  const handleSave = () => {
    createNote.mutate(
      { title: transcript.slice(0, 60) || "Voice Note", content: transcript, isPinned: false, isArchived: false },
      { onSuccess: onClose },
    );
  };

  const handleRedo = () => {
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    setError(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm z-50" style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={onClose} />

          <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">

            <div className="pointer-events-auto w-full max-w-md mx-4 rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border-2)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-black" style={{ color: "var(--text-1)" }}>Voice Capture</p>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: "var(--text-4)" }}>
                      AI transcription
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                  style={{ color: "var(--text-4)" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="px-6 pb-6 flex flex-col items-center gap-6">

                {/* Recorder */}
                <div className="relative flex flex-col items-center gap-5 w-full py-4">
                  {/* Waveform bars */}
                  <div className="flex items-center gap-1 h-14">
                    {BARS.map((h, i) => (
                      <motion.div key={i} className="w-1.5 rounded-full bg-violet-500"
                        animate={{
                          height: phase === "recording" ? [`${h * 3}px`, `${h * 5}px`, `${h * 3}px`] : "4px",
                          opacity: phase === "recording" ? 1 : 0.2,
                        }}
                        transition={{ duration: 0.6 + i * 0.05, delay: i * 0.04, repeat: phase === "recording" ? Infinity : 0, ease: "easeInOut" }}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  <p className="text-[28px] font-mono font-bold tracking-widest transition-colors"
                    style={{ color: phase === "recording" ? "var(--text-1)" : "var(--text-4)" }}>
                    {fmt(seconds)}
                  </p>

                  {/* Main button */}
                  {phase === "processing" ? (
                    <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                    </div>
                  ) : (
                    <motion.button
                      onClick={handleMainBtn}
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                      animate={phase === "recording"
                        ? { boxShadow: ["0 0 0 0px rgba(139,92,246,0.4)", "0 0 0 16px rgba(139,92,246,0)", "0 0 0 0px rgba(139,92,246,0.4)"] }
                        : {}}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        phase === "recording"
                          ? "bg-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.5)]"
                          : "bg-violet-600 shadow-[0_4px_20px_rgba(139,92,246,0.45)]"
                      }`}
                    >
                      {phase === "recording"
                        ? <Square className="w-5 h-5 text-white" fill="white" />
                        : <Mic className="w-6 h-6 text-white" />}
                    </motion.button>
                  )}

                  <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--text-4)" }}>
                    {phase === "idle"       && "Tap to start"}
                    {phase === "recording"  && "Recording… tap to stop"}
                    {phase === "processing" && "Transcribing…"}
                  </p>

                  {error && (
                    <p className="text-[11px] font-mono text-red-400">{error}</p>
                  )}
                </div>

                {/* Transcript + actions */}
                <AnimatePresence>
                  {phase === "done" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }} className="w-full">
                      <p className="text-[9px] font-mono uppercase tracking-[0.22em] mb-2" style={{ color: "var(--text-4)" }}>
                        Transcript
                      </p>
                      <textarea
                        value={transcript}
                        onChange={e => setTranscript(e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl p-4 text-[13px] leading-relaxed resize-none focus:outline-none"
                        style={{
                          background: "var(--surface)",
                          border:     "1px solid var(--border)",
                          color:      "var(--text-2)",
                        }}
                      />
                      <div className="flex gap-2 mt-4">
                        <button onClick={handleRedo}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
                          <RotateCcw className="w-3.5 h-3.5" /> Redo
                        </button>
                        <motion.button
                          whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                          onClick={handleSave}
                          disabled={createNote.isPending}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-[12px] font-black uppercase tracking-widest shadow-[0_4px_14px_rgba(139,92,246,0.4)] transition-all disabled:opacity-60"
                        >
                          {createNote.isPending
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <><Check className="w-3.5 h-3.5" /> Save as Note</>}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
