"use client";

import React, { useEffect, useRef } from "react";
import { cloudTechnologies, type Technology } from "@/data/skills";

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  tech: Technology;
  img: HTMLImageElement | null;
  failed: boolean;
}

class FibonacciSphere {
  readonly points: SpherePoint[];

  constructor(technologies: Technology[], radius = 120) {
    this.points = technologies.map((tech, i) => {
      const phi = Math.acos(1 - (2 * i) / technologies.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        tech,
        img: null,
        failed: false,
      };
    });
  }

  preloadImages() {
    this.points.forEach((p) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = p.tech.iconUrl;
      img.onload = () => {
        p.img = img;
      };
      img.onerror = () => {
        p.failed = true;
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
      return { x: x1 * scale + cx, y: y1 * scale + cy, scale, z: z2, tech: p.tech, img: p.img, failed: p.failed };
    });

    projected.sort((a, b) => b.z - a.z);
    projected.forEach((p) => {
      const size = Math.max(14, 34 * p.scale);
      const alpha = Math.max(0.25, p.scale);

      if (p.img) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.img, p.x - size / 2, p.y - size / 2, size, size);
        ctx.restore();
      } else if (p.failed) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.fillStyle = `#${p.tech.color === "FFFFFF" ? "334155" : p.tech.color}`;
        ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${size * 0.45}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.tech.name.charAt(0), p.x, p.y + 1);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.fillStyle = `rgba(76, 201, 240, ${alpha * 0.6})`;
        ctx.arc(p.x, p.y, size / 5, 0, Math.PI * 2);
        ctx.fill();
      }
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
    sphere.preloadImages();

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