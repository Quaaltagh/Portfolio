"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { Terminal } from "lucide-react";
import Reveal3D from "../Reveal3D";
import Meteors from "../Meteors";

export default function HeroSection({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <Meteors number={30} />

      <Reveal3D>
        <motion.div className="glass px-6 py-10 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl" style={{ scale, opacity }}>
          <h2 className="text-[#4cc9f0] tracking-[0.3em] sm:tracking-[0.5em] mb-4 text-xs sm:text-sm md:text-base uppercase font-bold">Computer Science</h2>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-300 to-slate-500 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            JOHAN HENDRAWAN
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm sm:text-xl text-[#f72585]">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-mono">AI Eng. // Software Eng. // Game Dev</span>
          </div>
        </motion.div>
      </Reveal3D>
    </section>
  );
}