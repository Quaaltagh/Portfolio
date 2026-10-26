"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const GLOW_CYAN = "radial-gradient(circle, rgba(76,201,240,0.13) 0%, rgba(76,201,240,0) 68%)";
const GLOW_PINK = "radial-gradient(circle, rgba(247,37,133,0.13) 0%, rgba(247,37,133,0) 68%)";

export default function Scene3D() {
  const { scrollYProgress } = useScroll();
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [68, 84]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [-100, -1600]);
  const lightY = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const lightY2 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none" style={{ perspective: 1400 }}>
      <motion.div
        className="absolute inset-0 bg-grid"
        style={{ rotateX: gridRotateX, z: gridZ, willChange: "transform" }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 rounded-full"
        style={{
          y: lightY,
          width: 720,
          height: 720,
          marginLeft: -120,
          marginTop: -120,
          background: GLOW_CYAN,
          willChange: "transform",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 rounded-full"
        style={{
          y: lightY2,
          width: 720,
          height: 720,
          marginRight: -120,
          marginBottom: -120,
          background: GLOW_PINK,
          willChange: "transform",
        }}
      />
    </div>
  );
}