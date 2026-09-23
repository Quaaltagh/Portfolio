"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { Terminal } from "lucide-react";
import Reveal3D from "../Reveal3D";

export default function HeroSection({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      <Reveal3D>
        <motion.div className="glass p-12 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl" style={{ scale, opacity }}>
          <h2 className="text-[#4cc9f0] tracking-[0.5em] mb-4 text-sm md:text-base uppercase font-bold">Developer</h2>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-300 to-slate-500 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            JOHAN HENDRAWAN
          </h1>
          <div className="flex items-center gap-2 text-xl text-[#f72585]">
            <Terminal size={24} />
            <span className="font-mono">Software Eng. // AI // Game Dev</span>
          </div>
        </motion.div>
      </Reveal3D>
    </section>
  );
}
