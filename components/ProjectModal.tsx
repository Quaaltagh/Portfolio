"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ImageOff } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Tutup modal dengan tombol Escape
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative"
          >
            <button
              onClick={onClose}
              data-cursor="hover"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-[#f72585]/30 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="w-full h-56 md:h-72 bg-slate-800/60 flex items-center justify-center overflow-hidden rounded-t-2xl">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <ImageOff size={40} />
                  <span className="text-xs font-mono">No preview image</span>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                {/* <span className={`px-2 py-1 ${project.rankColorClass} text-xs font-mono rounded whitespace-nowrap`}>{project.rankLabel}</span> */}
              </div>
              <p className="text-xs text-slate-500 font-mono mb-6">
                {project.role} · {project.year}
              </p>

              <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>

              <div className="flex gap-2 flex-wrap mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-slate-400 border border-slate-700 px-2 py-1 rounded">
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
                      className="inline-flex items-center gap-1 text-sm text-[#4cc9f0] hover:text-white transition-colors font-mono"
                    >
                      <ExternalLink size={14} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}