"use client";

import { useEffect, useRef } from "react";

/**
 * PremiumCursor — Apple-physics magnetic cursor
 *
 * Applied principles from Apple Design (WWDC 2018):
 * 1. Direct 1:1 tracking for the core dot (zero lag)
 * 2. Trailing ring uses exponential decay (lerp) — NOT CSS transition
 *    so it stays interruptible and velocity-aware
 * 3. On interactive elements: ring "magnetically" expands + morphs
 *    with a spring settle (no bounce — critically damped, damping=1.0)
 * 4. Click: ring compresses instantly (pointerdown) then re-expands (spring)
 *    — feedback on press, not release
 */
export default function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't mount on touch devices
    const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchOnly) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Live pointer position (updated 1:1 every pointermove)
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // Ring's lagged position (lerped each RAF frame)
    const ring_pos = { ...pos };

    let rafId: number;
    let isHovered = false;
    let isClicking = false;

    // ── Render loop — separate dot (1:1) from ring (lerped) ──
    const LERP = 0.14; // ring trailing speed: lower = more lag, higher = snappier

    const tick = () => {
      // Dot follows 1:1 (set directly from pointermove, just render here)
      dot.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;

      // Ring lerps toward dot position
      ring_pos.x += (pos.x - ring_pos.x) * LERP;
      ring_pos.y += (pos.y - ring_pos.y) * LERP;

      const ringSize = isHovered ? 40 : isClicking ? 20 : 32;
      const half = ringSize / 2;

      ring.style.transform = `translate3d(${ring_pos.x - half}px, ${ring_pos.y - half}px, 0)`;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // ── Pointer tracking — respond instantly (Apple principle 1) ──
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      // Show cursor if it was hidden (e.g. user moved mouse in from edge)
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // ── Hover detection ──
    const INTERACTIVE = 'a, button, input, select, textarea, label, [role="button"], [tabindex], .cursor-target';

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest(INTERACTIVE);
      if (target) {
        isHovered = true;
        ring.style.borderColor = "rgba(90, 138, 255, 0.85)";
        ring.style.boxShadow = "0 0 16px rgba(90,138,255,0.5), 0 0 32px rgba(90,138,255,0.2)";
        dot.style.background = "#C4D4FF";
      }
    };

    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest(INTERACTIVE);
      if (target) {
        isHovered = false;
        ring.style.borderColor = "rgba(90, 138, 255, 0.45)";
        ring.style.boxShadow = "0 0 8px rgba(90,138,255,0.2)";
        dot.style.background = "#5A8AFF";
      }
    };

    // ── Click — feedback on press not release (Apple principle) ──
    const onDown = () => {
      isClicking = true;
      dot.style.transform += " scale(0.7)";
      ring.style.borderColor = "rgba(155, 127, 255, 0.9)";
    };

    const onUp = () => {
      isClicking = false;
      ring.style.borderColor = isHovered
        ? "rgba(90, 138, 255, 0.85)"
        : "rgba(90, 138, 255, 0.45)";
    };

    // Hide when cursor leaves window
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    // Hide system cursor
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Core dot — 1:1 with pointer */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#5A8AFF",
          boxShadow: "0 0 10px rgba(90,138,255,0.8), 0 0 4px rgba(90,138,255,1)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          // NO transition on dot — must be 1:1
        }}
      />

      {/* Trailing ring — lerped in RAF, spring-settle size change */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "1.5px solid rgba(90, 138, 255, 0.45)",
          boxShadow: "0 0 8px rgba(90,138,255,0.2)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform, width, height",
          // Apple spring-settle: size changes use spring (width/height only)
          transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.15s ease, box-shadow 0.15s ease",
        }}
      />
    </>
  );
}
