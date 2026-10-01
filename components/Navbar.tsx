"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { contact } from "@/data/contact";
import DoorLoader from "./DoorLoader";

const NAV_LINKS = [
  { href: "#hero", label: "START" },
  { href: "#bio", label: "BIO" },
  { href: "#quests", label: "QUESTS" },
];

// const CV_FILE_PATH = "/CV-Johan-Hendrawan.pdf";
const GITHUB_ICON_URL = "https://cdn.simpleicons.org/github/FFFFFF";

export default function Navbar() {
  const [target, setTarget] = useState<string | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (target) return; 
    setTarget(href);
  };

  const jumpToTarget = () => {
    if (!target) return;
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-8 py-3 flex items-center gap-8 text-xs tracking-widest text-[#4cc9f0] font-bold"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            data-cursor="hover"
            className="hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}

        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="flex items-center gap-1.5 pl-4 border-l border-white/20 hover:text-white transition-colors"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GITHUB_ICON_URL} alt="" width={14} height={14} className="opacity-80" />
          GITHUB
        </a>

        {/* <a
          href={CV_FILE_PATH}
          download
          data-cursor="hover"
          className="flex items-center gap-1.5 pl-4 border-l border-white/20 text-[#f72585] hover:text-white transition-colors"
        >
          <Download size={14} />
          CV
        </a> */}
      </motion.div>

      {target && <DoorLoader onClosed={jumpToTarget} onDone={() => setTarget(null)} />}
    </>
  );
}