"use client";

import React from "react";
import { Code2, FolderGit2 } from "lucide-react";
import Reveal3D from "../Reveal3D";
import HoverTiltCard from "../HoverTiltCard";
import IconCloud from "../IconCloud";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";

export default function SkillTreeSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <Reveal3D className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <IconCloud />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-3xl sm:text-4xl font-bold text-[#ffd60a] mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
              <Code2 /> Skills
            </h3>
            <HoverTiltCard className="border-[#ffd60a]/20">
              <div className="space-y-6">
                {skills.map((skill) => {
                  const relatedProjects = projects.filter((project) =>
                    project.tags.some((tag) => skill.matchTags.includes(tag))
                  );

                  return (
                    <div key={skill.name}>
                      <div className="text-sm font-mono text-slate-200 mb-2">{skill.name}</div>
                      {relatedProjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {relatedProjects.map((project) => (
                            <a
                              key={project.title}
                              href="#quests"
                              data-cursor="hover"
                              className="inline-flex items-center gap-1.5 text-xs text-[#ffd60a] bg-[#ffd60a]/10 hover:bg-[#ffd60a]/20 border border-[#ffd60a]/30 px-3 py-1.5 rounded-full transition-colors"
                            >
                              <FolderGit2 size={12} />
                              {project.title}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-mono">No linked project yet</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </HoverTiltCard>
          </div>
        </div>
      </Reveal3D>
    </section>
  );
}