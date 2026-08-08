"use client";

import { useEffect, useRef } from "react";

export interface WireframeGlobeProps {
  color?: string; // e.g. "0, 71, 171" (Electric Cobalt) or "139, 0, 255" (Violet)
  speed?: number;
  maxTilt?: number; // radians of tilt toward cursor
  className?: string;
}

export default function WireframeGlobe({
  color = "0, 71, 171",
  speed = 0.0025,
  maxTilt = 0.35,
  className = "",
}: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const LAT_RINGS = 10;
    const LON_RINGS = 14;
    const POINTS_PER_RING = 60;

    let width = 0;
    let height = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let latPoints: { x: number; y: number; z: number }[][] = [];
    let lonPoints: { x: number; y: number; z: number }[][] = [];

    const buildSphere = () => {
      R = Math.min(width, height) * 0.42;
      cx = width / 2;
      cy = height / 2;

      latPoints = [];
      for (let i = 0; i <= LAT_RINGS; i++) {
        const theta = (Math.PI * i) / LAT_RINGS;
        const ringR = R * Math.sin(theta);
        const y = R * Math.cos(theta);
        const ring: { x: number; y: number; z: number }[] = [];
        for (let j = 0; j <= POINTS_PER_RING; j++) {
          const phi = (2 * Math.PI * j) / POINTS_PER_RING;
          ring.push({ x: ringR * Math.cos(phi), y, z: ringR * Math.sin(phi) });
        }
        latPoints.push(ring);
      }

      lonPoints = [];
      for (let j = 0; j < LON_RINGS; j++) {
        const phi = (2 * Math.PI * j) / LON_RINGS;
        const ring: { x: number; y: number; z: number }[] = [];
        for (let i = 0; i <= POINTS_PER_RING; i++) {
          const theta = (Math.PI * i) / POINTS_PER_RING;
          const ringR = R * Math.sin(theta);
          ring.push({
            x: ringR * Math.cos(phi),
            y: R * Math.cos(theta),
            z: ringR * Math.sin(phi),
          });
        }
        lonPoints.push(ring);
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildSphere();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Pointer reactivity: target tilt follows cursor position within window
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = nx * maxTilt;
      targetTiltX = -ny * maxTilt;
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    let angle = 0;
    let raf: number;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rotate = (p: { x: number; y: number; z: number }, ax: number, ay: number) => {
      // rotate around Y (auto-spin), then around X (cursor tilt)
      const x = p.x * Math.cos(ay) + p.z * Math.sin(ay);
      const z0 = -p.x * Math.sin(ay) + p.z * Math.cos(ay);
      const y = p.y * Math.cos(ax) - z0 * Math.sin(ax);
      const z = p.y * Math.sin(ax) + z0 * Math.cos(ax);
      return { x, y, z };
    };

    const drawRing = (ring: { x: number; y: number; z: number }[], ax: number, ay: number) => {
      ctx.beginPath();
      ring.forEach((p, idx) => {
        const rp = rotate(p, ax, ay);
        const px = cx + rp.x;
        const py = cy + rp.y;
        const depth = (rp.z + R) / (2 * R);
        ctx.strokeStyle = `rgba(${color}, ${0.04 + depth * 0.22})`;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      const spin = angle + tiltY;
      latPoints.forEach((ring) => drawRing(ring, tiltX, spin));
      lonPoints.forEach((ring) => drawRing(ring, tiltX, spin));
      if (!reduceMotion) angle += speed;
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [color, speed, maxTilt]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none select-none" />
    </div>
  );
}
