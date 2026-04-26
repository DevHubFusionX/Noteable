"use client";

import React from "react";

type DividerVariant = "pen" | "notebook" | "quill" | "pencil";

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
}

const PenIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12] dark:opacity-[0.08]">
    <path d="M30 8L40 18L18 40H8V30L30 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 12L36 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Decorative ink spatter */}
    <circle cx="14" cy="42" r="1.5" fill="currentColor" opacity="0.4"/>
    <circle cx="18" cy="44" r="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

const NotebookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12] dark:opacity-[0.08]">
    <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/>
    {/* Spine binding marks */}
    <line x1="16" y1="6" x2="16" y2="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
    {/* Ruled lines */}
    <line x1="20" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <line x1="20" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <line x1="20" y1="26" x2="30" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <line x1="20" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
  </svg>
);

const QuillIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12] dark:opacity-[0.08]">
    <path d="M38 4C38 4 20 14 16 26C14 32 12 40 10 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M38 4C30 8 22 16 18 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Feather barbs */}
    <path d="M34 8C30 10 28 14 26 18" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <path d="M36 6C32 9 29 12 27 16" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
    {/* Ink drop */}
    <circle cx="10" cy="44" r="2" fill="currentColor" opacity="0.3"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12] dark:opacity-[0.08]">
    {/* Pencil body */}
    <path d="M34 6L42 14L16 40L6 44L10 34L34 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Pencil tip */}
    <path d="M6 44L10 34L16 40L6 44Z" fill="currentColor" opacity="0.15"/>
    {/* Edit line */}
    <path d="M30 10L38 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Scribble decoration */}
    <path d="M20 38C22 36 24 38 26 36" stroke="currentColor" strokeWidth="0.8" opacity="0.3" strokeLinecap="round"/>
  </svg>
);

const icons: Record<DividerVariant, React.ReactNode> = {
  pen: <PenIcon />,
  notebook: <NotebookIcon />,
  quill: <QuillIcon />,
  pencil: <PencilIcon />,
};

export const SectionDivider = ({ variant = "pen", className = "" }: SectionDividerProps) => {
  return (
    <div className={`relative w-full flex items-center justify-center py-8 pointer-events-none select-none ${className}`}>
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-foreground/5 to-foreground/10" />
      
      {/* Center icon */}
      <div className="mx-6 text-foreground flex-shrink-0">
        {icons[variant]}
      </div>
      
      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-foreground/5 to-foreground/10" />
    </div>
  );
};

/* Dark variant for dark-bg sections */
export const SectionDividerDark = ({ variant = "pen", className = "" }: SectionDividerProps) => {
  return (
    <div className={`relative w-full flex items-center justify-center py-8 pointer-events-none select-none ${className}`}>
      {/* Left line */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-white/10" />
      
      {/* Center icon */}
      <div className="mx-6 text-white flex-shrink-0">
        {icons[variant]}
      </div>
      
      {/* Right line */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/5 to-white/10" />
    </div>
  );
};
