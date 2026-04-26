"use client";

import { motion } from "framer-motion";

export const WaterText = () => {
  return (
    <div className="w-full flex items-center justify-center py-16 md:py-24 bg-white overflow-hidden">
      <div className="relative select-none" style={{ width: "min(900px, 92vw)", height: "clamp(80px, 14vw, 180px)" }}>

        {/* ── Ghost outline text (always visible) ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 900 160"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="50%"
            y="78%"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="800"
            fontSize="148"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            letterSpacing="-4"
          >
            Noteable
          </text>
        </svg>

        {/* ── Water-filled text ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 900 160"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Clip to the text shape */}
            <clipPath id="text-clip">
              <text
                x="50%"
                y="78%"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontWeight="800"
                fontSize="148"
                letterSpacing="-4"
              >
                Noteable
              </text>
            </clipPath>
          </defs>

          {/* Water fill rect clipped to text */}
          <g clipPath="url(#text-clip)">
            {/* Base fill */}
            <rect x="0" y="0" width="900" height="160" fill="#8b5cf6" opacity="0.15" />

            {/* Animated wave 1 */}
            <motion.path
              fill="#8b5cf6"
              opacity="0.6"
              animate={{ x: [0, -900] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              d="M0,80 Q112,50 225,80 Q337,110 450,80 Q562,50 675,80 Q787,110 900,80 Q1012,50 1125,80 Q1237,110 1350,80 Q1462,50 1575,80 Q1687,110 1800,80 L1800,160 L0,160 Z"
            />

            {/* Animated wave 2 (offset) */}
            <motion.path
              fill="#7c3aed"
              opacity="0.4"
              animate={{ x: [-450, -1350] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              d="M0,90 Q112,65 225,90 Q337,115 450,90 Q562,65 675,90 Q787,115 900,90 Q1012,65 1125,90 Q1237,115 1350,90 Q1462,65 1575,90 Q1687,115 1800,90 L1800,160 L0,160 Z"
            />

            {/* Animated wave 3 (shimmer) */}
            <motion.path
              fill="#a78bfa"
              opacity="0.25"
              animate={{ x: [0, -900] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              d="M0,70 Q112,45 225,70 Q337,95 450,70 Q562,45 675,70 Q787,95 900,70 Q1012,45 1125,70 Q1237,95 1350,70 Q1462,45 1575,70 Q1687,95 1800,70 L1800,160 L0,160 Z"
            />
          </g>

          {/* Text stroke on top */}
          <text
            x="50%"
            y="78%"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="800"
            fontSize="148"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            opacity="0.4"
            letterSpacing="-4"
          >
            Noteable
          </text>
        </svg>

        {/* ── Entry animation overlay ── */}
        <motion.div
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          style={{ originX: 0 }}
          className="absolute inset-0 bg-white z-10"
        />
      </div>
    </div>
  );
};
