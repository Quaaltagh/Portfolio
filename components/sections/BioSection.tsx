"use client";

import React from "react";
import { Terminal } from "lucide-react";
import Reveal3D from "../Reveal3D";
import HoverTiltCard from "../HoverTiltCard";

export default function BioSection() {
  return (
    <section id="bio" className="min-h-screen flex items-center px-4 md:px-20">
      <Reveal3D className="max-w-4xl mx-auto">
        <HoverTiltCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-8xl font-bold">01</span>
          </div>
          <h3 className="text-3xl font-bold text-[#4cc9f0] mb-8 flex items-center gap-4">
            <Terminal /> Character Bio
          </h3>
          <div data-cursor="text" className="space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              Active student of Computer Science at BINUS University with an interest in software development and AI engineering. Able to work in a team as well as independently, and continuously developing skills in C, Python, and Unity. Interested in gaining professional experience through an internship or freelance project.
            </p>
          </div>
        </HoverTiltCard>
      </Reveal3D>
    </section>
  );
}
