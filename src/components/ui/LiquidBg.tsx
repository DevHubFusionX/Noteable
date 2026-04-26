"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const LiquidBg = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const blobs = containerRef.current.querySelectorAll(".blob");
    
    gsap.to(blobs, {
      y: () => (Math.random() - 0.5) * 40,
      x: () => (Math.random() - 0.5) * 40,
      scale: () => 0.8 + Math.random() * 0.5,
      duration: () => 3 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

    return () => {
      gsap.killTweensOf(blobs);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden opacity-50 blur-xl mix-blend-screen"
    >
      <div className="blob absolute -top-4 -left-4 w-16 h-16 rounded-full bg-[#E5F2FF]/50 mix-blend-screen" />
      <div className="blob absolute top-2 right-0 w-12 h-12 rounded-full bg-[#FFE5F2]/50 mix-blend-screen" />
      <div className="blob absolute -bottom-4 left-4 w-14 h-14 rounded-full bg-[#E5FFE5]/50 mix-blend-screen" />
    </div>
  );
};
