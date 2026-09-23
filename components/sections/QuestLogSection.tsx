"use client";

import React from "react";
import { Swords } from "lucide-react";
import Reveal3D from "../Reveal3D";
import QuestCard from "../QuestCard";
import { projects } from "@/data/projects";

export default function QuestLogSection() {
  return (
    <section id="quests" className="min-h-screen flex flex-col items-center justify-center px-4 py-32">
      <Reveal3D className="w-full max-w-5xl">
        <h3 className="text-4xl font-bold text-[#f72585] mb-12 flex items-center justify-center gap-4">
          <Swords /> Quest Log
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <QuestCard key={project.title} project={project} />
          ))}
        </div>
      </Reveal3D>
    </section>
  );
}
