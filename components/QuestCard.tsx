"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import HoverTiltCard from "./HoverTiltCard";
import type { Project } from "@/data/projects";

export default function QuestCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(project.image) && !imgError;

  return (
    <div onClick={() => onOpen(project)} data-cursor="hover" className="cursor-pointer">
      <HoverTiltCard noPadding className="border-[#f72585]/20 group overflow-hidden">
        <div className="w-full h-40 bg-slate-800/60 flex items-center justify-center overflow-hidden">
          {showImage ? (
            <img
              src={project.image}
              alt={project.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-600">
              <ImageOff size={28} />
              <span className="text-[10px] font-mono tracking-wide">No preview yet</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4 gap-3">
            <div>
              <h4 className="text-xl font-bold text-white group-hover:text-[#f72585] transition-colors">{project.title}</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {project.role} · {project.year}
              </p>
            </div>
            {/* <span className={`px-2 py-1 ${project.rankColorClass} text-xs font-mono rounded whitespace-nowrap`}>{project.rankLabel}</span> */}
          </div>

          <p className="text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">{project.description}</p>

          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-600 font-mono">Click for details →</p>
        </div>
      </HoverTiltCard>
    </div>
  );
}