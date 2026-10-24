"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import QuestFan, { type FanCardItem } from "./QuestFan";
import type { Project, ProjectCategory } from "@/data/projects";

const ITEM_HEIGHT = 65;
/** Jeda tiap pindah project (ms). */
const AUTOPLAY_MS = 3500;
/** Berapa lama setelah interaksi terakhir autoplay lanjut lagi (ms). */
const RESUME_MS = 3000;

export interface CategoryOption {
  id: ProjectCategory;
  label: string;
  icon: LucideIcon;
  count: number;
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  if (rangeSize === 0) return min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function QuestCarousel({
  categories,
  category,
  onCategoryChange,
  projects,
  onOpen,
  paused = false,
}: {
  categories: CategoryOption[];
  category: ProjectCategory;
  onCategoryChange: (id: ProjectCategory) => void;
  projects: Project[];
  onOpen: (project: Project) => void;
  /** true saat modal terbuka: autoplay & hitungan lanjut ditahan. */
  paused?: boolean;
}) {
  const len = categories.length;
  const activeIndex = Math.max(
    0,
    categories.findIndex((c) => c.id === category)
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();

  // Project yang sedang disorot autoplay di dalam kategori aktif
  const [activeProject, setActiveProject] = useState(0);
  // Hover mouse: autoplay berhenti selama mouse di dalam box
  const [hovering, setHovering] = useState(false);
  // Sudah diklik/diketuk: autoplay berhenti sampai user diam selama RESUME_MS
  const [interacted, setInteracted] = useState(false);
  // Naik tiap klik, supaya hitungan RESUME_MS diulang dari awal
  const [interactionTick, setInteractionTick] = useState(0);

  const autoplay = inView && !hovering && !interacted && !paused && !reduceMotion;

  // Lanjutkan autoplay setelah user diam: tidak hover, modal tertutup, lalu tunggu RESUME_MS
  useEffect(() => {
    if (!interacted || hovering || paused) return;
    const timer = setTimeout(() => setInteracted(false), RESUME_MS);
    return () => clearTimeout(timer);
  }, [interacted, hovering, paused, interactionTick]);

  // Autoplay: project satu per satu, setelah yang terakhir pindah ke kategori berikutnya
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => {
      if (activeProject + 1 < projects.length) {
        setActiveProject(activeProject + 1);
      } else {
        const next = categories[(activeIndex + 1) % len];
        setActiveProject(0);
        onCategoryChange(next.id);
      }
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [autoplay, activeProject, activeIndex, projects.length, categories, len, onCategoryChange]);

  const handleSelectCategory = (id: ProjectCategory) => {
    setActiveProject(0);
    onCategoryChange(id);
  };

  // Mobile: gulirkan barisan chip supaya chip aktif selalu terlihat (tanpa menggeser halaman)
  useEffect(() => {
    const row = chipRowRef.current;
    if (!row) return;
    const el = row.querySelector<HTMLElement>('[data-active="true"]');
    if (!el) return;
    row.scrollTo({ left: el.offsetLeft - (row.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  }, [category]);

  const fanCards = useMemo<FanCardItem[]>(
    () =>
      projects.map((p) => ({
        imgUrl: p.image,
        title: p.title,
        subtitle: `${p.role} · ${p.year}`,
        onSelect: () => onOpen(p),
      })),
    [projects, onOpen]
  );

  return (
    <div
      ref={rootRef}
      // Hover hanya dihitung untuk mouse. Klik/ketukan apa pun di dalam box menghentikan autoplay
      // sementara, dan mengulang hitungan sebelum autoplay lanjut.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onClickCapture={() => {
        setInteracted(true);
        setInteractionTick((t) => t + 1);
      }}
      className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] border border-white/10 glass"
    >
      <div className="flex flex-col lg:flex-row lg:min-h-[640px]">
        {/* KIRI (mobile): barisan chip horizontal */}
        <div className="lg:hidden border-b border-white/10 bg-[#0b1020]/80">
          <div
            ref={chipRowRef}
            className="relative flex gap-2 overflow-x-auto px-4 py-3 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat, index) => {
              const isActive = index === activeIndex;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  data-active={isActive}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={cn(
                    "shrink-0 snap-center min-h-11 inline-flex items-center gap-2 px-4 rounded-full border text-xs font-medium uppercase tracking-tight whitespace-nowrap transition-colors duration-300",
                    isActive
                      ? "bg-[#f72585] text-white border-[#f72585] shadow-[0_0_20px_rgba(247,37,133,0.3)]"
                      : "text-white/60 border-white/20 active:bg-white/10"
                  )}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-white/40"} />
                  {cat.label}
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-white/25" : "bg-white/10"
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* KIRI (desktop): pilihan kategori bergaya carousel vertikal */}
        <div className="hidden lg:flex w-[36%] relative z-30 flex-col items-start justify-center overflow-hidden pl-10 pr-4 bg-[#0b1020]/80">
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-[#0b1020] via-[#0b1020]/80 to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#0b1020] via-[#0b1020]/80 to-transparent z-40 pointer-events-none" />

          <div className="relative w-full h-full min-h-[240px] flex items-center justify-start z-20">
            {categories.map((cat, index) => {
              const isActive = index === activeIndex;
              const wrappedDistance = wrap(-(len / 2), len / 2, index - activeIndex);
              const Icon = cat.icon;

              return (
                <motion.div
                  key={cat.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    data-cursor="hover"
                    className={cn(
                      "relative flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-700 text-left border",
                      isActive
                        ? "bg-[#f72585] text-white border-[#f72585] shadow-[0_0_25px_rgba(247,37,133,0.35)] z-10"
                        : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                    )}
                  >
                    <Icon size={18} strokeWidth={2} className={isActive ? "text-white" : "text-white/40"} />
                    <span className="font-medium text-sm tracking-tight whitespace-nowrap uppercase">{cat.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                        isActive ? "bg-white/25" : "bg-white/10"
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 relative bg-black/20 flex flex-col items-center justify-center py-6 sm:py-8 lg:py-10 px-2 sm:px-6 overflow-hidden lg:border-l border-white/10">
          <p className="text-center text-[11px] font-mono text-[#4cc9f0] mt-1">Klik / ketuk kartu untuk detail →</p>

          <div className="w-full">
            <QuestFan
              key={category}
              cards={fanCards}
              highlightIndex={interacted ? null : activeProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}