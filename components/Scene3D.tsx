"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Scene3D() {
  const { scrollYProgress } = useScroll();
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [68, 84]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [-100, -1600]);
  const lightY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const lightY2 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none" style={{ perspective: 1400 }}>
      <motion.div className="absolute inset-0 bg-grid transform-origin-bottom" style={{ rotateX: gridRotateX, z: gridZ, transformStyle: "preserve-3d" }} />
      <motion.div className="absolute top-1/4 left-1/4 w-120 h-120 bg-[#4cc9f0]/10 rounded-full blur-[100px]" style={{ y: lightY, transformStyle: "preserve-3d" }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-120 h-120 bg-[#f72585]/10 rounded-full blur-[120px]" style={{ y: lightY2, transformStyle: "preserve-3d" }} />
    </div>
  );
}
