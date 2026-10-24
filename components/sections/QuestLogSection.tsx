"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Swords, Globe, Brain, Gamepad2, Smartphone, type LucideIcon } from "lucide-react";
import Reveal3D from "../Reveal3D";
import QuestCarousel, { type CategoryOption } from "../QuestCarousel";
import ProjectModal from "../ProjectModal";
import { projects, categories, type Project, type ProjectCategory } from "@/data/projects";


const CATEGORY_ICONS: Record<ProjectCategory, LucideIcon> = {
  fullstack: Globe,
  ai: Brain,
  game: Gamepad2,
  mobile: Smartphone,
};

const CATEGORY_OPTIONS: CategoryOption[] = categories.map((cat) => ({
  id: cat.id,
  label: cat.label,
  icon: CATEGORY_ICONS[cat.id],
  count: projects.filter((p) => p.category === cat.id).length,
}));

export default function QuestLogSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [category, setCategory] = useState<ProjectCategory>(categories[0].id);

  const handleClose = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => projects.filter((p) => p.category === category), [category]);

  return (
    <section id="quests" className="min-h-screen flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      <Reveal3D className="w-full max-w-6xl">
        <h3 className="text-3xl sm:text-4xl font-bold text-[#f72585] mb-8 sm:mb-10 flex items-center justify-center gap-3 sm:gap-4">
          <Swords /> Quest Log
        </h3>

        <QuestCarousel
          categories={CATEGORY_OPTIONS}
          category={category}
          onCategoryChange={setCategory}
          projects={filtered}
          onOpen={setSelected}
          paused={selected !== null}
        />
      </Reveal3D>

      <ProjectModal project={selected} onClose={handleClose} />
    </section>
  );
}