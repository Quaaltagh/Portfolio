"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HoverTiltCard({
  children,
  className,
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / el.offsetWidth;
    const py = (e.clientY - (rect.top + rect.height / 2)) / el.offsetHeight;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  };

  const handlePointerLeave = () => {
    rotateY.set(0);
    rotateX.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className={cn("glass glass-hover rounded-xl", noPadding ? "" : "p-5 sm:p-8", className)}
    >
      {children}
    </motion.div>
  );
}