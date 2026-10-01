"use client";

import React from "react";
import { useScroll, useTransform } from "framer-motion";

import MorphingCursor from "@/components/MorphingCursor";
import Scene3D from "@/components/Scene3D";
import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

import HeroSection from "@/components/sections/HeroSection";
import BioSection from "@/components/sections/BioSection";
import SkillTreeSection from "@/components/sections/SkillTreeSection";
import QuestLogSection from "@/components/sections/QuestLogSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Portfolio() {
  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen selection:bg-[#f72585]/30">
      <MorphingCursor />
      <Scene3D />
      <ScrollProgressBar progress={scrollYProgress} />
      <Navbar />

      <main className="relative z-10 flex flex-col gap-32 pb-32">
        <HeroSection scale={heroScale} opacity={heroOpacity} />
        <BioSection />
        <SkillTreeSection />
        <QuestLogSection />
        <ContactSection />
      </main>
    </div>
  );
}