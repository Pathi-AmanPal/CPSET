"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import DecryptedText from "@/components/ui/DecryptedText";
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
  radiusX: number,
  radiusY: number
) {
  const offset = index - activeIndex;
  const half = Math.floor(VISIBLE_COUNT / 2);
  let adjustedOffset = offset;

  if (offset > half) adjustedOffset = offset - total;
  if (offset < -half) adjustedOffset = offset + total;

  if (Math.abs(adjustedOffset) > half * 2) return null;

  const angle = (adjustedOffset / VISIBLE_COUNT) * Math.PI;
  const x = Math.sin(angle) * radiusX;
  const y = -Math.cos(angle) * radiusY;

  const distance = Math.abs(adjustedOffset);
  const maxDistance = half + 1;
  const scale = Math.max(0, 1 - (distance / maxDistance) * 0.28);
  const opacity = Math.max(0.25, 1 - (distance / maxDistance) * 0.65);
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
  const cardRef = useRef<HTMLButtonElement>(null);
  const IconComponent = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.15,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <motion.button
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        opacity: pos.opacity,
        zIndex: pos.zIndex,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={item.title}
      aria-selected={isActive}
      role="option"
      className={cn(
        "absolute left-1/2 top-1/2 flex h-52 w-72 sm:w-80 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-start justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 select-none text-left group",
        isActive
          ? "border-purple-500/60 bg-[#0c102a]/95 shadow-[0_0_35px_rgba(168,85,247,0.35),0_15px_40px_rgba(0,0,0,0.6)]"
          : "border-slate-800/80 bg-[#070a1a]/90 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-purple-500/40 hover:shadow-[0_12px_32px_rgba(147,51,234,0.2)]"
      )}
      style={{ transformOrigin: "center center" }}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2.5">
          {IconComponent && (
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <IconComponent className="w-5 h-5 text-purple-300" />
            </div>
          )}
        </div>
        {item.tag && (
          <span className="rounded-full bg-purple-500/20 border border-purple-400/30 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-300">
            {item.tag}
          </span>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col justify-center">
        <h3
          className={cn(
            "font-heading font-bold leading-tight transition-colors duration-300 mb-1.5",
            isActive ? "text-white text-base" : "text-slate-200 text-sm"
          )}
        >
          <DecryptedText
            text={item.title}
            animateOn="hover"
            speed={50}
            maxIterations={4}
            className="text-slate-100 font-bold"
            encryptedClassName="text-purple-300 font-mono opacity-80"
          />
        </h3>
        <p
          className={cn(
            "line-clamp-3 text-xs leading-relaxed transition-colors duration-300",
            isActive ? "text-slate-300" : "text-slate-400"
          )}
        >
          <DecryptedText
            text={item.description}
            animateOn="hover"
            speed={45}
            maxIterations={4}
            className="text-slate-300"
            encryptedClassName="text-indigo-400 font-mono opacity-75"
          />
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
  const [radiusX, setRadiusX] = useState(260);
  const [radiusY, setRadiusY] = useState(90);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = controlledIndex ?? internalIndex;
  const total = items.length;

  // Responsive radius adjustments
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setRadiusX(140);
        setRadiusY(60);
      } else if (w < 1024) {
        setRadiusX(200);
        setRadiusY(75);
      } else {
        setRadiusX(280);
        setRadiusY(90);
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
      aria-label="Circular carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-6 outline-none py-10 min-h-[460px] w-full",
        className
      )}
    >
      {/* Circular track */}
      <div className="relative h-[320px] w-full max-w-4xl flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const pos = getItemPosition(i, activeIndex, total, radiusX, radiusY);
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

      {/* Center counter badge */}
      <motion.div
        key={activeItem?.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center pointer-events-none mt-2"
      >
        <span className="text-3xl font-mono font-bold tracking-tight text-purple-300">
          {String(activeIndex + 1).padStart(2, "0")}
          <span className="text-slate-500 font-normal text-sm ml-1">
            / {String(total).padStart(2, "0")}
          </span>
        </span>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-5 mt-2 z-20">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          aria-label="Previous item"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20 hover:border-purple-400 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 backdrop-blur-md transition-all hover:bg-purple-500/20 hover:border-purple-400 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <ChevronRight className="size-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default CircularCarousel;
