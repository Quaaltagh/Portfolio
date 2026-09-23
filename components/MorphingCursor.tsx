"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


class CursorEngine {
  mouse = { x: 0, y: 0 };
  ring = { x: 0, y: 0 };
  private reqId = 0;
  private onFrame: () => void;

  constructor(onFrame: () => void) {
    this.onFrame = onFrame;
  }

  start() {
    const loop = () => {
      this.ring.x += (this.mouse.x - this.ring.x) * 0.18;
      this.ring.y += (this.mouse.y - this.ring.y) * 0.18;
      this.onFrame();
      this.reqId = requestAnimationFrame(loop);
    };
    this.reqId = requestAnimationFrame(loop);
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  stop() {
    cancelAnimationFrame(this.reqId);
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

  useEffect(() => {
    const engine = new CursorEngine(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${engine.mouse.x}px, ${engine.mouse.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${engine.ring.x}px, ${engine.ring.y}px, 0)`;
      }
    });

    const onMouseMove = (e: MouseEvent) => {
      engine.updateMouse(e.clientX, e.clientY);
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]");
      setCursorState(cursorEl ? cursorEl.getAttribute("data-cursor") || "default" : "default");
    };

    window.addEventListener("mousemove", onMouseMove);
    engine.start();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      engine.stop();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 hidden sm:block">
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
