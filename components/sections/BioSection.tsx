"use client";

import React, { useState } from "react";
import { Terminal, User } from "lucide-react";
import Reveal3D from "../Reveal3D";
import HoverTiltCard from "../HoverTiltCard";

const PROFILE_IMAGE_SRC = "https://media.licdn.com/dms/image/v2/D5603AQEVDxh-hFCOiQ/profile-displayphoto-crop_800_800/B56ZeUNZTCHQAI-/0/1750538229344?e=1792022400&v=beta&t=MgW0nksI_jujspQdO6TS931gegaoo6ra5LNmZjECYLw";

export default function BioSection() {
  const [imgError, setImgError] = useState(false);
  const showImage = !imgError;

  return (
    <section id="bio" className="min-h-screen flex items-center px-4 md:px-20">
      <Reveal3D className="max-w-4xl mx-auto">
        <HoverTiltCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="text-8xl font-bold">01</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
            <div className="shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#4cc9f0]/40 shadow-[0_0_25px_rgba(76,201,240,0.25)] bg-slate-800/60 flex items-center justify-center">
              {showImage ? (
                <img
                  src={PROFILE_IMAGE_SRC}
                  alt="Johan Hendrawan"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <User size={40} strokeWidth={1.5} />
                  <span className="text-[9px] font-mono tracking-wide">Add photo</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#4cc9f0] mb-2 flex items-center gap-4">
                <Terminal /> Character Bio
              </h3>
              <p className="text-sm text-slate-500 font-mono">Johan Hendrawan · AI Engineer · Software Engineer</p>
            </div>
          </div>

          <div data-cursor="text" className="space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              Active student of Computer Science at BINUS University with an interest in software
              development and AI engineering. Able to work in a team as well as independently, and
              continuously developing skills in C, Python, and Unity. Interested in gaining
              professional experience through an internship or freelance project.
            </p>
          </div>
        </HoverTiltCard>
      </Reveal3D>
    </section>
  );
}