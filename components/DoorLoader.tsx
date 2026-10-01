"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Meteors from "./Meteors";

const EASE = [0.83, 0, 0.17, 1] as const;
const DURATION = 0.7;

type Phase = "closing" | "opening";

interface DoorLoaderProps {
  /** Dipanggil saat pintu sudah tertutup penuh (waktu yang tepat untuk mengganti konten di belakangnya). */
  onClosed?: () => void;
  /** Dipanggil saat pintu sudah terbuka penuh, overlay boleh di-unmount. */
  onDone?: () => void;
  /** Lama pintu tertutup sebelum membuka lagi (ms). */
  holdMs?: number;
}

export default function DoorLoader({ onClosed, onDone, holdMs = 450 }: DoorLoaderProps) {
  const [phase, setPhase] = useState<Phase>("closing");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedFired = useRef(false);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleRightComplete = () => {
    if (phase === "closing") {
      if (closedFired.current) return;
      closedFired.current = true;
      onClosed?.();
      timer.current = setTimeout(() => setPhase("opening"), holdMs);
    } else {
      onDone?.();
    }
  };

  const closing = phase === "closing";

  return (
    <div className="fixed inset-0 z-300 flex pointer-events-auto">
      {/* Pintu kiri */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: closing ? "0%" : "-100%" }}
        transition={{ duration: DURATION, ease: EASE }}
        className="w-1/2 h-full glass bg-[#060a14]/95 border-r-0 rounded-none relative overflow-hidden"
      >
        <Meteors number={15} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-50">
          <div className="w-1 h-32 bg-[#4cc9f0] shadow-[0_0_15px_#4cc9f0]" />
        </div>
      </motion.div>

      {/* Pintu kanan */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: closing ? "0%" : "100%" }}
        transition={{ duration: DURATION, ease: EASE }}
        onAnimationComplete={handleRightComplete}
        className="w-1/2 h-full glass bg-[#060a14]/95 border-l-0 rounded-none relative overflow-hidden"
      >
        <Meteors number={15} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-50">
          <div className="w-1 h-32 bg-[#4cc9f0] shadow-[0_0_15px_#4cc9f0]" />
        </div>
      </motion.div>
    </div>
  );
}