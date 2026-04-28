"use client";

import React, { useEffect, useRef } from "react";

const GRID_SIZE = 64;

/**
 * Lightweight background grid.
 * - Grid pan uses a pure CSS animation (zero JS overhead).
 * - Smart nodes reduced from 12 → 4, using CSS animations instead of recursive GSAP.
 * - Orb blurs reduced from 120px → 50px for major GPU savings.
 * - GSAP removed entirely from this component.
 */
export const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 z-0 h-screen w-full bg-background overflow-hidden">
      {/* Grid layer — CSS-only infinite pan */}
      <div
        className="absolute inset-0 grid-pan"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139,92,246,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139,92,246,0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          maskImage: "radial-gradient(ellipse at center, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 60%, transparent 100%)",
        }}
      />

      {/* Smart nodes — CSS-animated, reduced from 12 to 4 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="smart-node absolute w-1.5 h-1.5 bg-main rounded-full shadow-[0_0_8px_2px_rgba(139,92,246,0.8)]"
          style={{
            top: `${15 + i * 20}%`,
            left: `${10 + i * 22}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}

      {/* Gradient orbs — blur reduced from 120px to 50px */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-main/5 blur-[50px] pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-main/5 blur-[50px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] rounded-full bg-main/5 blur-[50px] pointer-events-none" />
    </div>
  );
};
