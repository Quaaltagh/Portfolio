"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";

export default function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-linear-to-r from-[#4cc9f0] via-[#f72585] to-[#ffd60a] z-50 origin-left"
      style={{ scaleX: progress, width: "100%" }}
    />
  );
}
