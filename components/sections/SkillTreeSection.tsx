"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import Reveal3D from "../Reveal3D";
import HoverTiltCard from "../HoverTiltCard";
import IconCloud from "../IconCloud";
import { skills } from "@/data/skills";

export default function SkillTreeSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4">
      <Reveal3D className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <IconCloud />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-4xl font-bold text-[#ffd60a] mb-8 flex items-center gap-4">
              <Code2 /> Skill Tree
            </h3>
            <HoverTiltCard className="border-[#ffd60a]/20">
              <div className="space-y-6">
                {skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2 font-mono">
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-linear-to-r from-[#ffd60a]/50 to-[#ffd60a]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </HoverTiltCard>
          </div>
        </div>
      </Reveal3D>
    </section>
  );
}
