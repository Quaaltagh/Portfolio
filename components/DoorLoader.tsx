"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Meteors from "./Meteors";

const leftVariants: Variants = {
  closed: { x: "0%" },
  open: { x: "-100%", transition: { duration: 1.1, ease: [0.83, 0, 0.17, 1] as const } },
};
const rightVariants: Variants = {
  closed: { x: "0%" },
  open: { x: "100%", transition: { duration: 1.1, ease: [0.83, 0, 0.17, 1] as const } },
};

export default function DoorLoader({ onEnter }: { onEnter: () => void }) {
  const [opening, setOpening] = useState(false);

  return (
    <div className="fixed inset-0 z-100 flex pointer-events-auto">
      <motion.div variants={leftVariants} initial="closed" animate={opening ? "open" : "closed"} className="w-1/2 h-full glass border-r-0 rounded-none relative overflow-hidden">
        <Meteors number={15} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-50">
          <div className="w-1 h-32 bg-[#4cc9f0] shadow-[0_0_15px_#4cc9f0]" />
        </div>
      </motion.div>

      <motion.div
        variants={rightVariants}
        initial="closed"
        animate={opening ? "open" : "closed"}
        onAnimationComplete={() => opening && onEnter()}
        className="w-1/2 h-full glass border-l-0 rounded-none relative overflow-hidden"
      >
        <Meteors number={15} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-50">
          <div className="w-1 h-32 bg-[#4cc9f0] shadow-[0_0_15px_#4cc9f0]" />
        </div>
      </motion.div>

      <AnimatePresence>
        {!opening && (
          <motion.div exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="mb-8 w-24 h-24 glass flex items-center justify-center rotate-45 border-[#4cc9f0]/30 shadow-[0_0_30px_rgba(76,201,240,0.2)]">
              <span className="-rotate-45 text-4xl font-bold tracking-tighter text-[#4cc9f0]">JH</span>
            </div>
            <button
              onClick={() => setOpening(true)}
              data-cursor="hover"
              className="pointer-events-auto px-8 py-3 glass glass-hover text-[#f72585] tracking-widest text-sm uppercase relative overflow-hidden group"
            >
              <span className="relative z-10 font-bold">Press To Enter</span>
              <div className="absolute inset-0 bg-[#f72585]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
