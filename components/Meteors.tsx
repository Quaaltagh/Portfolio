"use client";

import React, { useEffect, useRef, useState } from "react";

interface MeteorData {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

class MeteorFactory {
  static generate(count: number): MeteorData[] {
    return Array.from({ length: count }).map(() => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
  }
}

export default function Meteors({ number = 20 }: { number?: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const isSmall = window.matchMedia("(max-width: 639px)").matches;
    setMeteors(MeteorFactory.generate(isSmall ? Math.ceil(number / 2) : number));
  }, [number]);
  
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((m, idx) => (
        <span
          key={idx}
          className="absolute h-0.5 w-0.5 rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={
            {
              top: m.top,
              left: m.left,
              animation: `meteor ${m.animationDuration} linear infinite`,
              animationDelay: m.animationDelay,
              animationPlayState: running ? "running" : "paused",
              "--angle": "215deg",
            } as React.CSSProperties
          }
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-12.5 h-px bg-linear-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </div>
  );
}