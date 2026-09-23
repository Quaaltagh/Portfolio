"use client";

import React, { useEffect, useRef } from "react";
import { cloudTechnologies } from "@/data/skills";

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  text: string;
}

class FibonacciSphere {
  readonly points: SpherePoint[];

  constructor(labels: string[], radius = 120) {
    this.points = labels.map((text, i) => {
      const phi = Math.acos(1 - (2 * i) / labels.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        text,
      };
    });
  }
}

class SphereRenderer {
  rotation = { x: 0, y: 0 };
  velocity = { x: 0.005, y: 0.005 };
  isDragging = false;
  private prevMouse = { x: 0, y: 0 };
  private reqId = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement,
    private sphere: FibonacciSphere
  ) {}

  start() {
    const loop = () => {
      this.tick();
      this.reqId = requestAnimationFrame(loop);
    };
    this.reqId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.reqId);
  }

  onDragStart(x: number, y: number) {
    this.isDragging = true;
    this.prevMouse = { x, y };
  }

  onDragMove(x: number, y: number) {
    if (!this.isDragging) return;
    const dx = x - this.prevMouse.x;
    const dy = y - this.prevMouse.y;
    this.velocity.y = dx * 0.005;
    this.velocity.x = -dy * 0.005;
    this.rotation.y += this.velocity.y;
    this.rotation.x += this.velocity.x;
    this.prevMouse = { x, y };
  }

  onDragEnd() {
    this.isDragging = false;
  }

  private tick() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!this.isDragging) {
      this.rotation.x += this.velocity.x;
      this.rotation.y += this.velocity.y;
      this.velocity.x *= 0.95;
      this.velocity.y *= 0.95;
      if (Math.abs(this.velocity.x) < 0.002) this.velocity.x = 0.002;
      if (Math.abs(this.velocity.y) < 0.002) this.velocity.y = 0.002;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const focal = 300;
    const cosX = Math.cos(this.rotation.x);
    const sinX = Math.sin(this.rotation.x);
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);

    const projected = this.sphere.points.map((p) => {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      const scale = focal / (focal + z2);
      return { x: x1 * scale + cx, y: y1 * scale + cy, z: z2, scale, text: p.text };
    });

    projected.sort((a, b) => b.z - a.z);
    projected.forEach((p) => {
      ctx.font = `bold ${Math.max(12, 16 * p.scale)}px sans-serif`;
      ctx.fillStyle = `rgba(76, 201, 240, ${Math.max(0.2, p.scale)})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.text, p.x, p.y);
    });
  }
}

export default function IconCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sphere = new FibonacciSphere(cloudTechnologies);
    const renderer = new SphereRenderer(ctx, canvas, sphere);
    renderer.start();

    const handleDown = (e: MouseEvent) => renderer.onDragStart(e.clientX, e.clientY);
    const handleMove = (e: MouseEvent) => renderer.onDragMove(e.clientX, e.clientY);
    const handleUp = () => renderer.onDragEnd();

    canvas.addEventListener("mousedown", handleDown);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      renderer.stop();
      canvas.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return <canvas ref={canvasRef} width={350} height={350} data-cursor="drag" className="mx-auto max-w-full" />;
}
