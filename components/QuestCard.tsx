"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import HoverTiltCard from "./HoverTiltCard";
import type { Project } from "@/data/projects";

export default function QuestCard({ project }: { project: Project }) {
  return (
    <HoverTiltCard className="border-[#f72585]/20 group">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div>
          <h4 className="text-xl font-bold text-white group-hover:text-[#f72585] transition-colors">{project.title}</h4>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {project.role} · {project.year}
          </p>
        </div>
        <span className={`px-2 py-1 ${project.rankColorClass} text-xs font-mono rounded whitespace-nowrap`}>{project.rankLabel}</span>
      </div>

      <p className="text-slate-400 mb-6 text-sm leading-relaxed">{project.description}</p>

      <div className="flex gap-2 flex-wrap mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="flex gap-4 flex-wrap pt-4 border-t border-white/10">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-1 text-xs text-[#4cc9f0] hover:text-white transition-colors font-mono"
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </HoverTiltCard>
  );
}
