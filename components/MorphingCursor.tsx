"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

class CursorEngine {
  mouse = { x: 0, y: 0 };
  ring = { x: 0, y: 0 };
  private reqId = 0;
  private running = false;

  constructor(private onFrame: () => void) {}

  private loop = () => {
    const dx = this.mouse.x - this.ring.x;
    const dy = this.mouse.y - this.ring.y;
    this.ring.x += dx * 0.18;
    this.ring.y += dy * 0.18;
    this.onFrame();

    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      this.running = false;
      return;
    }
    this.reqId = requestAnimationFrame(this.loop);
  };

  private wake() {
    if (this.running) return;
    this.running = true;
    this.reqId = requestAnimationFrame(this.loop);
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.wake();
  }

  stop() {
    cancelAnimationFrame(this.reqId);
    this.running = false;
  }
}

const ringVariants = {
  default: { width: 32, height: 32, borderRadius: "50%", borderWidth: "2px", borderColor: "rgba(76, 201, 240, 0.5)", backgroundColor: "transparent" },
  hover: { width: 48, height: 48, borderRadius: "50%", borderWidth: "0px", borderColor: "transparent", backgroundColor: "rgba(247, 37, 133, 0.2)" },
  drag: { width: 40, height: 40, borderRadius: "50%", borderWidth: "2px", borderColor: "rgba(255, 214, 10, 0.8)", borderStyle: "dashed", backgroundColor: "transparent" },
  text: { width: 4, height: 32, borderRadius: "2px", borderWidth: "0px", backgroundColor: "rgba(76, 201, 240, 0.8)" },
};

export default function MorphingCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const engine = new CursorEngine(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${engine.mouse.x}px, ${engine.mouse.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${engine.ring.x}px, ${engine.ring.y}px, 0)`;
      }
    });

    const onMouseMove = (e: MouseEvent) => engine.updateMouse(e.clientX, e.clientY);

    const onMouseOver = (e: MouseEvent) => {
      const cursorEl = (e.target as HTMLElement).closest("[data-cursor]");
      setCursorState(cursorEl?.getAttribute("data-cursor") || "default");
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      engine.stop();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-9999">
      <div ref={cursorRef} className="absolute top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#4cc9f0] rounded-full shadow-[0_0_10px_#4cc9f0]" />
      <motion.div
        ref={ringRef}
        className="absolute top-0 left-0 -ml-4 -mt-4 flex items-center justify-center"
        animate={cursorState}
        variants={ringVariants}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </div>
  );
}