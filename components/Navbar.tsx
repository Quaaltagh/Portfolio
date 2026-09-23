"use client";

import React from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "#hero", label: "START" },
  { href: "#bio", label: "BIO" },
  { href: "#quests", label: "QUESTS" },
];

export default function Navbar() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-8 py-3 flex gap-8 text-xs tracking-widest text-[#4cc9f0] font-bold"
    >
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href} data-cursor="hover" className="hover:text-white transition-colors">
          {link.label}
        </a>
      ))}
    </motion.div>
  );
}
