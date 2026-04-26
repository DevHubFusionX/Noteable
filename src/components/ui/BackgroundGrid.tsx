"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const GRID_SIZE = 64;

const GradientOrb = ({ className }: { className: string }) => (
  <div className={`bg-orb absolute rounded-full pointer-events-none ${className}`} />
);

export const BackgroundGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Continuously pan the grid to make it look like it's moving
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPosition: `${GRID_SIZE}px ${GRID_SIZE}px`,
          duration: 4,
          ease: "none",
          repeat: -1,
        });
      }

      // Animating the glowing orbs gently
      const orbs = gsap.utils.toArray(".bg-orb") as HTMLElement[];
      orbs.forEach((orb) => {
        gsap.to(orb, {
          scale: gsap.utils.random(1.05, 1.15),
          opacity: gsap.utils.random(0.4, 0.7),
          duration: gsap.utils.random(6, 10),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      
      // Floating smart data nodes (mini glowing dots traveling the grid)
      const nodes = gsap.utils.toArray(".smart-node") as HTMLElement[];
      nodes.forEach((node) => {
        const animateNode = () => {
          const axis = Math.random() > 0.5 ? "x" : "y";
          const distance = (Math.floor(Math.random() * 5) + 3) * GRID_SIZE;
          const direction = Math.random() > 0.5 ? 1 : -1;
          
          gsap.to(node, {
            [axis]: `+=${distance * direction}`,
            duration: distance / 50,
            ease: "power1.inOut",
            opacity: 1,
            onComplete: () => {
              gsap.to(node, { opacity: 0, duration: 0.5, onComplete: animateNode });
            }
          });
        };
        // Initial random placement
        gsap.set(node, { 
          x: Math.floor(Math.random() * 20) * GRID_SIZE, 
          y: Math.floor(Math.random() * 10) * GRID_SIZE 
        });
        animateNode();
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 h-screen w-full bg-background overflow-hidden"
    >
      {/* 
        The grid layer uses a CSS pattern that we pan continuously.
        Removed the aggressive mask so it shows fully across the screen. 
      */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139,92,246,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139,92,246,0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          // Very subtle fade only at the extreme edges
          maskImage: "radial-gradient(ellipse at center, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 60%, transparent 100%)",
        }}
      />

      {/* Smart moving nodes traveling on the grid intersections */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="smart-node absolute top-0 left-0 w-1.5 h-1.5 bg-main rounded-full opacity-0 shadow-[0_0_8px_2px_rgba(139,92,246,0.8)]"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ))}

      {/* Gradient orbs */}
      <GradientOrb className="top-[-20%] left-[-10%] w-[50%] h-[50%] bg-main/5 blur-[120px]" />
      <GradientOrb className="top-[10%] right-[-10%] w-[40%] h-[60%] bg-main/5 blur-[120px]" />
      <GradientOrb className="bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-main/5 blur-[120px]" />
    </div>
  );
};
