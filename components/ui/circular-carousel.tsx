"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  icon?: ElementType;
}

export interface CircularCarouselProps {
  items: CarouselItem[];
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const VISIBLE_COUNT = 5;

function getItemPosition(
  index: number,
  activeIndex: number,
  total: number,
  stepX: number
) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  if (Math.abs(adjustedOffset) > half) return null;

  const distance = Math.abs(adjustedOffset);
  const sign = Math.sign(adjustedOffset);

  // Active card is at (0,0) dead center.
  // Flanking cards step outward smoothly and drop slightly for 3D stage depth.
  const x = sign * Math.pow(distance, 0.92) * stepX;
  const y = Math.pow(distance, 1.5) * 16;

  const scale = Math.max(0.7, 1 - distance * 0.14);
  const opacity = Math.max(0.25, 1 - distance * 0.35);
  const zIndex = VISIBLE_COUNT - distance;

  return { x, y, scale, opacity, zIndex, adjustedOffset };
}

function CarouselCard({
  item,
  isActive,
  onClick,
  pos,
}: {
  item: CarouselItem;
  isActive: boolean;
  onClick: () => void;
  pos: { x: number; y: number; scale: number; opacity: number; zIndex: number };
}) {
  const IconComponent = item.icon;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        opacity: pos.opacity,
        zIndex: pos.zIndex,
      }}
      whileHover={
        isActive
          ? { scale: pos.scale * 1.03 }
          : { scale: pos.scale * 1.05 }
      }
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1],
      }}
      onClick={onClick}
      aria-label={item.title}
      aria-selected={isActive}
      role="option"
      className={cn(
        "absolute left-1/2 top-1/2 flex h-56 w-72 sm:w-80 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-between rounded-2xl border p-6 backdrop-blur-xl transition-colors duration-300 select-none text-left group",
        isActive
          ? "border-purple-500/70 bg-[#0b0f28]/95 shadow-[0_0_40px_rgba(168,85,247,0.35),0_15px_40px_rgba(0,0,0,0.7)]"
          : "border-slate-800/80 bg-[#070a1a]/90 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-purple-500/40 hover:shadow-[0_12px_32px_rgba(147,51,234,0.2)]"
      )}
      style={{ transformOrigin: "center center" }}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2.5">
          {IconComponent && (
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <IconComponent className="w-5 h-5 text-purple-300" />
            </div>
          )}
        </div>
        {item.tag && (
          <span className="rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-300">
            {item.tag}
          </span>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col justify-center">
        <h3
          className={cn(
            "font-heading font-bold leading-snug transition-colors duration-300 mb-2",
            isActive ? "text-white text-lg sm:text-xl" : "text-slate-200 text-base"
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "line-clamp-3 text-xs sm:text-sm leading-relaxed transition-colors duration-300",
            isActive ? "text-slate-300" : "text-slate-400"
          )}
        >
          {item.description}
        </p>
      </div>
    </motion.button>
  );
}

export function CircularCarousel({
  items,
  activeIndex: controlledIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 4500,
  className,
}: CircularCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [stepX, setStepX] = useState(260);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  // Responsive stepX adjustments
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStepX(120);
      } else if (w < 1024) {
        setStepX(185);
      } else {
        setStepX(260);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const newIndex = ((index % total) + total) % total;
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex);
      }
      onActiveChange?.(newIndex);
    },
    [total, controlledIndex, onActiveChange]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoPlay || isHovered || isFocused) return;
    intervalRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, isHovered, isFocused, next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const el = containerRef.current;
    el?.addEventListener("keydown", handler);
    return () => el?.removeEventListener("keydown", handler);
  }, [next, prev]);

  const activeItem = items[activeIndex];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Mission Pillars Carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center justify-center outline-none py-4 w-full overflow-hidden min-h-[520px]",
        className
      )}
    >
      {/* 3D Cards Stage — Fixed height stage centered vertically */}
      <div className="relative h-[340px] w-full max-w-6xl flex items-center justify-center mb-8">
        <AnimatePresence>
          {items.map((item, i) => {
            const pos = getItemPosition(i, activeIndex, total, stepX);
            if (!pos) return null;

            const isActive = i === activeIndex;

            return (
              <CarouselCard
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={() => goTo(i)}
                pos={pos}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Pagination & Navigation Controls — Placed cleanly BELOW the stage */}
      <div className="flex flex-col items-center justify-center gap-4 z-20">
        <motion.div
          key={activeItem?.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center pointer-events-none"
        >
          <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-purple-300">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="text-slate-500 font-normal text-sm ml-1">
              / {String(total).padStart(2, "0")}
            </span>
          </span>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={prev}
            aria-label="Previous item"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20 hover:border-purple-400 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <ChevronLeft className="size-5" />
          </motion.button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist">
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer",
                  i === activeIndex
                    ? "w-7 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                    : "w-2 bg-slate-700 hover:bg-purple-400/50"
                )}
                aria-label={`Go to item ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={next}
            aria-label="Next item"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20 hover:border-purple-400 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <ChevronRight className="size-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default CircularCarousel;
