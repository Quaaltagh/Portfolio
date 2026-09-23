"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Reveal3D({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.45"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const z = useTransform(scrollYProgress, [0, 1], [-160, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={cn("w-full", className)} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, y, z, scale, opacity, transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}
