"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ImageOff } from "lucide-react";

export interface FanCardItem {
  imgUrl?: string;
  title: string;
  subtitle?: string;
  onSelect: () => void;
}

interface QuestFanProps {
  cards: FanCardItem[];
  /** Index kartu yang disorot otomatis (autoplay). null = tidak ada sorotan. */
  highlightIndex?: number | null;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/** Skala y-offset kalau viewport terlalu pendek untuk tinggi ideal layout. */
function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

/**
 * Posisi tiap slot. Kalau kartu < 7, susunan dibuat simetris di tengah
 * dan sebarannya dipersempit supaya tidak terlalu melebar.
 */
function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = (totalCards - 1) / 2;
  const distance = center > 0 ? (slot - center) / center : 0;
  const spread = Math.max(0.4, (totalCards - 1) / (MAX_VISIBLE - 1));
  const eff = distance * spread;
  return {
    rot: eff * 21,
    scale: 1.0 - 0.2244 * eff * eff,
    x: eff * 30,
    y: eff * eff * 7.3,
    zIndex: 10 - Math.round(Math.abs(slot - center)),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-white/10 bg-white/5 backdrop-blur-[16px] text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-[#f72585]/60 hover:text-white active:opacity-70 transition-colors duration-300";

function FanCardFace({ card }: { card: FanCardItem }) {
  const [error, setError] = useState(false);
  const showImage = Boolean(card.imgUrl) && !error;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/15 bg-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.imgUrl}
          alt={card.title}
          loading="lazy"
          decoding="async"
          onError={() => setError(true)}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600 z-10">
          <ImageOff size={28} />
          <span className="text-[10px] font-mono">No preview yet</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 z-20 p-3 pt-10 bg-linear-to-t from-black/90 to-transparent pointer-events-none">
        <p className="text-white font-bold text-sm sm:text-base leading-tight">{card.title}</p>
        {card.subtitle && <p className="text-[10px] text-[#4cc9f0] font-mono mt-0.5">{card.subtitle}</p>}
      </div>
    </div>
  );
}

export default function QuestFan({ cards, highlightIndex = null }: QuestFanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  // Jembatan antara effect utama dan sorotan autoplay
  const layoutRef = useRef<((slot: number | null) => void) | null>(null);
  const visibleMapRef = useRef<Map<number, number>>(new Map());
  const hoveringRef = useRef(false);
  const highlightRef = useRef<number | null>(highlightIndex);
  highlightRef.current = highlightIndex;

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        for (let i = 0; i < totalCards; i++) map.set(i, i);
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination]
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
      );
    },
    [totalCards, needsPagination]
  );

  /** Terapkan layout sesuai sorotan autoplay (atau layout netral kalau tidak ada). */
  const applyHighlight = useCallback(() => {
    if (hoveringRef.current || isAnimating.current) return;
    const idx = highlightRef.current;
    const slot = idx === null ? null : visibleMapRef.current.get(idx) ?? null;
    layoutRef.current?.(slot);
  }, []);

  // Sorotan berubah dari luar (autoplay)
  useEffect(() => {
    if (highlightIndex !== null && needsPagination && !visibleMapRef.current.has(highlightIndex)) {
      if (!isAnimating.current) {
        isAnimating.current = true;
        directionRef.current = "right";
        setCenterIndex(highlightIndex);
      }
      return;
    }
    applyHighlight();
  }, [highlightIndex, needsPagination, applyHighlight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    visibleMapRef.current = visibleMap;
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    /**
     * Pengali lebar: mengikuti breakpoint, tapi dibatasi lebar container
     * supaya kartu paling pinggir tidak keluar dari box.
     */
    const calcMultiplier = () => {
      const responsive = getResponsiveMultiplier(window.innerWidth);
      const containerW = container.clientWidth;
      const cardW = cardElements[0].offsetWidth;
      if (!containerW || !cardW) return responsive;

      let maxX = 0;
      for (let s = 0; s < slotCount; s++) maxX = Math.max(maxX, Math.abs(config(s).x));
      if (maxX === 0) return responsive;

      // setengah container - setengah kartu (+ ruang untuk hover & rotasi)
      const availablePx = containerW / 2 - (cardW / 2) * 1.15 - 28;
      const allowedRem = Math.max(0, availablePx) / 16;
      return Math.max(0.1, Math.min(responsive, allowedRem / maxX));
    };

    const multiplier = calcMultiplier();

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
        // Animasi masuk/pindah selesai: terapkan sorotan autoplay
        applyHighlight();
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Interaksi hover
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = (visibleEntries.length - 1) / 2;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = calcMultiplier();
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        // Kartu yang disorot/di-hover naik ke paling depan
        gsap.set(el, { zIndex: slot === hoveredSlot ? 30 : base.zIndex });
      });
    };

    layoutRef.current = updateHoverLayout;

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        hoveringRef.current = true;
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        hoveringRef.current = false;
        // Kembali ke sorotan autoplay (atau netral kalau tidak ada)
        applyHighlight();
      }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => {
      if (isAnimating.current) return;
      if (hoveringRef.current) updateHoverLayout(activeSlot);
      else applyHighlight();
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, applyHighlight]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg
      className="relative z-[2] w-4 h-4 md:w-5 md:h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <div className="flex flex-col items-center w-full py-2 lg:py-4 relative z-20">
      <div className="flex items-center justify-center w-full">
        <div ref={containerRef} className="fan-layout flex relative justify-center items-center w-full">
          {cards.map((card) => (
            <div key={card.title} className="fan-card" data-cursor="hover" onClick={card.onSelect}>
              <FanCardFace card={card} />
            </div>
          ))}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-4 mt-4 md:mt-6 z-30">
          <button className={`${ARROW_CLASSES} w-11 h-11 md:w-12 md:h-12`} onClick={() => cycle("left")} aria-label="Previous" data-cursor="hover">
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === centerIndex ? "bg-[#f72585] scale-[1.3]" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <button className={`${ARROW_CLASSES} w-11 h-11 md:w-12 md:h-12`} onClick={() => cycle("right")} aria-label="Next" data-cursor="hover">
            {chevron("right")}
          </button>
        </div>
      )}
    </div>
  );
}