"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const FadeInSection = ({
  children,
  className = "",
  fadeOut = true,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  fadeOut?: boolean;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    fadeOut ? [0, 0.15, 0.85, 1] : [0, 0.15, 1, 1],
    fadeOut ? [0, 1, 1, 0]       : [0, 1,   1, 1]
  );
  const y = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, ...style }} className={className}>
      {children}
    </motion.div>
  );
};
