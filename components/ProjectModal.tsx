"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ImageOff, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const slideVariants = {
  enter: (d: number) => ({ x: d * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -40, opacity: 0 }),
};

/** Tampilan layar penuh: gambar utuh (object-contain), tanpa crop. */
function Lightbox({
  open,
  onClose,
  images,
  index,
  direction,
  title,
  onPaginate,
  onGoTo,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  index: number;
  direction: number;
  title: string;
  onPaginate: (delta: number) => void;
  onGoTo: (i: number) => void;
}) {
  const len = images.length;
  const multiple = len > 1;
  const src = images[index];

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-250 bg-black/90"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
                className="fixed inset-0 z-250 flex items-center justify-center p-3 sm:p-8 outline-none"
              >
                <Dialog.Title className="sr-only">{`${title} — gambar ${index + 1} dari ${len}`}</Dialog.Title>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    data-cursor="hover"
                    aria-label="Tutup gambar"
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-[#f72585]/50 backdrop-blur flex items-center justify-center text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Close>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={src}
                    src={src}
                    alt={`${title} — ${index + 1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    drag={multiple ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) onPaginate(1);
                      else if (info.offset.x > 60) onPaginate(-1);
                    }}
                    decoding="async"
                    draggable={false}
                    className="max-w-[94vw] max-h-[82vh] w-auto h-auto object-contain rounded-lg select-none shadow-2xl"
                  />
                </AnimatePresence>

                {multiple && (
                  <>
                    <button
                      type="button"
                      onClick={() => onPaginate(-1)}
                      data-cursor="hover"
                      aria-label="Gambar sebelumnya"
                      className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#f72585]/50 backdrop-blur flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onPaginate(1)}
                      data-cursor="hover"
                      aria-label="Gambar berikutnya"
                      className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#f72585]/50 backdrop-blur flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight size={22} />
                    </button>

                    <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[11px] font-mono text-white/80">
                        {index + 1} / {len}
                      </span>
                      <div className="flex gap-1.5 pointer-events-auto">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onGoTo(i)}
                            data-cursor="hover"
                            aria-label={`Ke gambar ${i + 1}`}
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              i === index ? "w-5 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function ModalBody({ project }: { project: Project }) {
  const images = project.gallery;
  const len = images.length;
  const multiple = len > 1;

  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(false);

  const paginate = useCallback(
    (delta: number) => setPage(([cur]) => [(cur + delta + len) % len, delta]),
    [len]
  );
  const goTo = useCallback((target: number) => setPage(([cur]) => [target, target >= cur ? 1 : -1]), []);

  useEffect(() => {
    if (!multiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [multiple, paginate]);

  const src = images[index];
  const isBroken = !src || failed.has(src);

  return (
    <>
      {/* Gambar (klik untuk melihat penuh) */}
      <div className="p-2">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-800/60 group">
          {isBroken ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
              <ImageOff size={40} />
              <span className="text-xs font-mono">No preview image</span>
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={src}
                src={src}
                alt={`${project.title} — ${index + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                onError={() => setFailed((prev) => new Set(prev).add(src))}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </AnimatePresence>
          )}

          {/* Lapisan klik untuk membuka lightbox */}
          {!isBroken && (
            <button
              type="button"
              onClick={() => setZoom(true)}
              data-cursor="hover"
              aria-label="Lihat gambar penuh"
              className="absolute inset-0 z-10 cursor-zoom-in"
            >
              <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 group-hover:bg-[#f72585]/60 backdrop-blur flex items-center justify-center text-white transition-colors">
                <ZoomIn size={16} />
              </span>
            </button>
          )}

          {multiple && (
            <>
              <button
                type="button"
                onClick={() => paginate(-1)}
                data-cursor="hover"
                aria-label="Gambar sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#f72585]/50 backdrop-blur flex items-center justify-center text-white transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                data-cursor="hover"
                aria-label="Gambar berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-[#f72585]/50 backdrop-blur flex items-center justify-center text-white transition-colors sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Konten */}
      <div className="space-y-5 px-6 pb-6 pt-3">
        <div className="space-y-1.5">
          <Dialog.Title className="text-xl font-bold text-white tracking-tight">{project.title}</Dialog.Title>
          <p className="text-xs text-slate-500 font-mono">
            {project.role} · {project.year} · {project.categoryLabel}
          </p>
        </div>

        <div>
          <Dialog.Description
            className={cn("text-sm text-slate-400 leading-relaxed", !expanded && "line-clamp-3")}
          >
            {project.description}
          </Dialog.Description>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            data-cursor="hover"
            className="mt-1.5 text-xs font-mono text-[#4cc9f0] hover:text-white transition-colors"
          >
            {expanded ? "Lebih sedikit" : "Selengkapnya"}
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-400 border border-slate-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: titik di kiri, tombol link di kanan */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {multiple ? (
            <div className="flex justify-center sm:justify-start gap-1.5 max-sm:order-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  data-cursor="hover"
                  aria-label={`Ke gambar ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/25 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          ) : (
            <span />
          )}

          {project.links.length > 0 && (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
              {project.links.map((link, i) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    i === 0
                      ? "bg-white/90 text-black hover:bg-white"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                  <ExternalLink size={14} className="opacity-60" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={zoom}
        onClose={() => setZoom(false)}
        images={images}
        index={index}
        direction={direction}
        title={project.title}
        onPaginate={paginate}
        onGoTo={goTo}
      />
    </>
  );
}

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const open = project !== null;

  const lastProject = useRef<Project | null>(null);
  if (project) lastProject.current = project;
  const shown = project ?? lastProject.current;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && shown && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-200 bg-black"
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 z-200 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
              <Dialog.Content asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 30 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className={cn(
                    "pointer-events-auto glass-lite rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative outline-none",
                    HIDE_SCROLLBAR
                  )}
                >
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      data-cursor="hover"
                      aria-label="Tutup"
                      className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-[#f72585]/40 backdrop-blur flex items-center justify-center text-white/80 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>

                  {/* key = state galeri & "Selengkapnya" di-reset tiap ganti project */}
                  <ModalBody key={shown.title} project={shown} />
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}