"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Capture Everything",
    body: "Throw in voice memos, quick scribbles, screenshots, or full articles. Noteable accepts the mess — no formatting required.",
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    number: "02",
    title: "On-Device Synthesis",
    body: "Our local AI silently categorizes, tags, and links your ideas. Structure emerges without you lifting a finger — and nothing leaves your device.",
    accent: "from-indigo-500/20 to-indigo-500/0",
  },
  {
    number: "03",
    title: "Surface What Matters",
    body: "Patterns you never noticed. Connections you forgot you made. Noteable turns months of scattered thinking into a searchable, living knowledge base.",
    accent: "from-purple-500/20 to-purple-500/0",
  },
];

export const InteractiveWalkthrough = () => {
  return (
    <section className="relative py-20 md:py-44 px-4 md:px-12 overflow-hidden">

      {/* ─── Giant Background Label ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[14vw] md:text-[11vw] font-bold tracking-tight text-slate-900/[0.03] uppercase leading-none whitespace-nowrap">
          How It Works
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ─── Section Header ─── */}
        <div className="mb-24 md:mb-32 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-main" />
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400 font-semibold">
              Process
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.15]"
          >
            Three quiet steps.<br />
            <span className="text-slate-400">Zero friction.</span>
          </motion.h2>
        </div>

        {/* ─── Steps ─── */}
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <StepRow key={i} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>

      </div>
    </section>
  );
};


const StepRow = ({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start py-14 md:py-16 ${
          !isLast ? "border-b border-slate-100" : ""
        }`}
      >
        {/* Number */}
        <div className="md:col-span-1 flex items-start">
          <span className="text-sm font-mono text-slate-300 font-semibold group-hover:text-main/60 transition-colors duration-500">
            {step.number}
          </span>
        </div>

        {/* Title */}
        <div className="md:col-span-4 flex items-start">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors duration-500">
            {step.title}
          </h3>
        </div>

        {/* Description */}
        <div className="md:col-span-5 flex items-start">
          <p className="text-[15px] md:text-base text-slate-400 leading-relaxed font-medium group-hover:text-slate-600 transition-colors duration-500">
            {step.body}
          </p>
        </div>

        {/* Visual Accent */}
        <div className="md:col-span-2 flex items-center justify-end">
          <motion.div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.accent} border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-slate-500"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
