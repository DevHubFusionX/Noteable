"use client";

import React, { useId } from "react";
import { motion, useInView } from "framer-motion";

interface InkTearProps {
  /** colour of the section above */
  fromColor: string;
  /** colour of the section below */
  toColor: string;
  /** flip vertically so the tear hangs down instead of up */
  flip?: boolean;
}

// Ink splatter dots — scattered around the tear line
const SPLATTERS = [
  { cx: "8%",  cy: 18, r: 3.5, delay: 0.55 },
  { cx: "14%", cy: 28, r: 2,   delay: 0.65 },
  { cx: "22%", cy: 10, r: 4,   delay: 0.45 },
  { cx: "31%", cy: 32, r: 2.5, delay: 0.7  },
  { cx: "38%", cy: 8,  r: 1.5, delay: 0.5  },
  { cx: "47%", cy: 34, r: 3,   delay: 0.6  },
  { cx: "55%", cy: 12, r: 2,   delay: 0.75 },
  { cx: "63%", cy: 30, r: 4,   delay: 0.4  },
  { cx: "72%", cy: 6,  r: 2.5, delay: 0.58 },
  { cx: "80%", cy: 26, r: 1.5, delay: 0.68 },
  { cx: "88%", cy: 14, r: 3,   delay: 0.48 },
  { cx: "94%", cy: 30, r: 2,   delay: 0.62 },
];

// Ink drip paths hanging below the tear
const DRIPS = [
  { d: "M 12% 40 Q 12.5% 58 12% 72",   delay: 0.7  },
  { d: "M 28% 38 Q 28.8% 62 28.2% 80", delay: 0.8  },
  { d: "M 45% 42 Q 45.5% 55 45% 65",   delay: 0.75 },
  { d: "M 62% 36 Q 62.8% 60 62.2% 78", delay: 0.85 },
  { d: "M 78% 40 Q 78.5% 52 78% 62",   delay: 0.72 },
  { d: "M 91% 38 Q 91.5% 56 91% 70",   delay: 0.78 },
];

export const InkTear = ({ fromColor, toColor, flip = false }: InkTearProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const id = useId().replace(/:/g, "");

  // Jagged tear path across full width
  const tearPath = `M0,40 
    C2%,38 4%,44 6%,36 
    S10%,28 13%,38 
    S17%,48 20%,34 
    S24%,22 27%,36 
    S31%,50 34%,38 
    S38%,26 41%,40 
    S45%,52 48%,36 
    S52%,20 55%,34 
    S59%,48 62%,36 
    S66%,24 69%,38 
    S73%,50 76%,34 
    S80%,22 83%,38 
    S87%,52 90%,36 
    S94%,24 97%,38 
    L100%,38 L100%,0 L0,0 Z`;

  return (
    <div
      ref={ref}
      className="relative w-full pointer-events-none select-none"
      style={{ height: 90, transform: flip ? "scaleY(-1)" : undefined, background: toColor }}
    >
      <svg
        viewBox="0 0 100 90"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      >
        <defs>
          {/* Ink bleed filter */}
          <filter id={`ink-${id}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id={`clip-${id}`}>
            <motion.rect
              x="0" y="0" height="90"
              animate={{ width: inView ? "100%" : "0%" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </clipPath>
        </defs>

        {/* Above-tear fill (fromColor) */}
        <motion.path
          d={tearPath}
          fill={fromColor}
          filter={`url(#ink-${id})`}
          clipPath={`url(#clip-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Ink splatters */}
        {SPLATTERS.map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx} cy={s.cy} r={s.r}
            fill={fromColor}
            filter={`url(#ink-${id})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 0.85 } : {}}
            transition={{ duration: 0.4, delay: s.delay, ease: "backOut" }}
            style={{ transformOrigin: `${s.cx} ${s.cy}px` }}
          />
        ))}

        {/* Ink drips */}
        {DRIPS.map((drip, i) => (
          <motion.path
            key={i}
            d={drip.d}
            stroke={fromColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            filter={`url(#ink-${id})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
            transition={{ duration: 0.5, delay: drip.delay, ease: "easeIn" }}
          />
        ))}
      </svg>
    </div>
  );
};
