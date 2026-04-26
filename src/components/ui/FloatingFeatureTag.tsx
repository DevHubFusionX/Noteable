"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface FloatingFeatureTagProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  backgroundVisual?: React.ReactNode;
}

export const FloatingFeatureTag = ({
  children,
  delay = 0,
  className = "",
  backgroundVisual,
}: FloatingFeatureTagProps) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tagRef.current) return;

    // A subtle floating animation using GSAP for a more organic feel
    gsap.to(tagRef.current, {
      y: "-=15",
      x: "+=5",
      rotation: "+=2",
      duration: 3 + Math.random() * 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: delay,
    });
  }, [delay]);

  return (
    <motion.div
      ref={tagRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.8, type: "spring", bounce: 0.4 }}
      className={`absolute px-5 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl text-white font-medium whitespace-nowrap overflow-hidden ${className}`}
    >
      {backgroundVisual}
      <span className="relative z-10">{children}</span>
    </motion.div>
  );
};
