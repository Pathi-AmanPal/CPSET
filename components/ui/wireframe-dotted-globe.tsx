"use client";

import { useEffect, useRef } from "react";

export interface GlobeAnchor {
  id: string;
  lng: number;
  lat: number;
}

export interface GlobeAnchorPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  scaleFactor: number;
}

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
  anchors?: GlobeAnchor[];
  onAnchorPositionsChange?: (positions: GlobeAnchorPosition[]) => void;
  interactive?: boolean;
}

// ── Static continent polygon outlines [lng, lat] ──────────────────────────────
const CONTINENT_SHAPES: [number, number][][] = [
  // North America
  [[-168, 70], [-145, 72], [-125, 56], [-104, 50], [-88, 48], [-78, 28], [-95, 14], [-117, 20], [-135, 34], [-154, 51]],
  // South America
  [[-82, 12], [-58, 9], [-48, -7], [-55, -27], [-68, -55], [-79, -29]],
  // Europe
  [[-12, 59], [9, 70], [36, 64], [43, 51], [27, 37], [4, 38], [-12, 45]],
  // Africa
  [[-17, 35], [35, 36], [50, 10], [38, -35], [10, -35], [-15, 0]],
  // Asia
  [[35, 70], [80, 78], [150, 60], [178, 40], [135, 18], [95, 5], [55, 20], [35, 42]],
  // Australia
  [[112, -11], [153, -10], [155, -39], [120, -42], [108, -25]],
];

// Ray-casting point-in-polygon test
function insidePolygon(point: [number, number], poly: [number, number][]): boolean {
  return poly.reduce((inside, cur, i) => {
    const prev = poly[(i + poly.length - 1) % poly.length];
    const crosses =
      cur[1] > point[1] !== prev[1] > point[1] &&
      point[0] < ((prev[0] - cur[0]) * (point[1] - cur[1])) / (prev[1] - cur[1]) + cur[0];
    return crosses ? !inside : inside;
  }, false);
}

// Pre-rasterize all land dots at module level (runs once)
const LAND_DOTS: [number, number][] = CONTINENT_SHAPES.flatMap((polygon, si) => {
  const lons = polygon.map(([lon]) => lon);
  const lats = polygon.map(([, lat]) => lat);
  const pts: [number, number][] = [];
  for (let lat = Math.floor(Math.min(...lats)); lat <= Math.ceil(Math.max(...lats)); lat += 3.5) {
    for (let lon = Math.floor(Math.min(...lons)); lon <= Math.ceil(Math.max(...lons)); lon += 3.8) {
      const p: [number, number] = [lon + ((lat * 3 + si) % 3), lat + ((lon + si) % 2)];
      if (insidePolygon(p, polygon)) pts.push(p);
    }
  }
  return pts;
});

// Graticule parameters
const LAT_LINES = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
const LON_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
const GRAT_SAMPLES = 64;

// Project a geographic coordinate to canvas 2D using orthographic projection
function project(
  lngDeg: number,
  latDeg: number,
  rotX: number,
  rotY: number,
  cx: number,
  cy: number,
  radius: number
): [number, number, number] | null {
  const lng = (lngDeg * Math.PI) / 180 + rotX;
  const lat = (latDeg * Math.PI) / 180 + rotY;
  const x3 = Math.cos(lat) * Math.cos(lng);
  const y3 = Math.sin(lat);
  const z3 = Math.cos(lat) * Math.sin(lng);
  if (z3 < 0) return null; // back hemisphere — not visible
  return [cx + x3 * radius, cy - y3 * radius, z3];
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  anchors = [],
  onAnchorPositionsChange,
  interactive = true,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onChangeRef = useRef(onAnchorPositionsChange);
  const anchorsRef = useRef(anchors);

  useEffect(() => { onChangeRef.current = onAnchorPositionsChange; }, [onAnchorPositionsChange]);
  useEffect(() => { anchorsRef.current = anchors; }, [anchors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = Math.min(width, window.innerWidth - 40);
    const ch = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(cw, ch) / 2.5;
    const cx = cw / 2;
    const cy = ch / 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.scale(dpr, dpr);

    let rotX = 0;
    let rotY = (-10 * Math.PI) / 180;
    let autoRotate = true;
    const ROT_SPEED = 0.004;
    let rafId = 0;

    function draw() {
      ctx!.clearRect(0, 0, cw, ch);

      // ── Globe sphere ──
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx!.fillStyle = "rgba(7, 11, 26, 0.95)";
      ctx!.fill();
      ctx!.strokeStyle = "rgba(90, 138, 255, 0.6)";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // ── Graticule latitude rings ──
      ctx!.strokeStyle = "rgba(120, 150, 255, 0.18)";
      ctx!.lineWidth = 0.7;
      for (const latDeg of LAT_LINES) {
        let started = false;
        ctx!.beginPath();
        for (let i = 0; i <= GRAT_SAMPLES; i++) {
          const lngDeg = (i / GRAT_SAMPLES) * 360 - 180;
          const pt = project(lngDeg, latDeg, rotX, rotY, cx, cy, radius);
          if (!pt) { started = false; continue; }
          if (!started) { ctx!.moveTo(pt[0], pt[1]); started = true; }
          else ctx!.lineTo(pt[0], pt[1]);
        }
        ctx!.stroke();
      }

      // ── Graticule longitude meridians ──
      for (const lngDeg of LON_LINES) {
        let started = false;
        ctx!.beginPath();
        for (let i = 0; i <= GRAT_SAMPLES; i++) {
          const latDeg = (i / GRAT_SAMPLES) * 180 - 90;
          const pt = project(lngDeg, latDeg, rotX, rotY, cx, cy, radius);
          if (!pt) { started = false; continue; }
          if (!started) { ctx!.moveTo(pt[0], pt[1]); started = true; }
          else ctx!.lineTo(pt[0], pt[1]);
        }
        ctx!.stroke();
      }

      // ── Land halftone dots ──
      for (const [lngDeg, latDeg] of LAND_DOTS) {
        const pt = project(lngDeg, latDeg, rotX, rotY, cx, cy, radius);
        if (!pt) continue;
        const alpha = Math.max(0.2, pt[2] * 0.85);
        ctx!.beginPath();
        ctx!.arc(pt[0], pt[1], 1.4, 0, 2 * Math.PI);
        ctx!.fillStyle = `rgba(160, 185, 255, ${alpha})`;
        ctx!.fill();
      }

      // ── Anchor nodes + position tracking ──
      const curAnchors = anchorsRef.current;
      if (curAnchors.length > 0 && onChangeRef.current) {
        const positions: GlobeAnchorPosition[] = curAnchors.map((anchor) => {
          const pt = project(anchor.lng, anchor.lat, rotX, rotY, cx, cy, radius);
          if (pt) {
            const [px, py, z] = pt;
            const alpha = Math.max(0.3, z * 0.9);
            // Pulse dot
            ctx!.beginPath();
            ctx!.arc(px, py, 4, 0, 2 * Math.PI);
            ctx!.fillStyle = `rgba(122, 154, 255, ${alpha})`;
            ctx!.shadowColor = "rgba(122, 154, 255, 0.9)";
            ctx!.shadowBlur = 12;
            ctx!.fill();
            ctx!.shadowBlur = 0;
            // Ring
            ctx!.beginPath();
            ctx!.arc(px, py, 7, 0, 2 * Math.PI);
            ctx!.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.8})`;
            ctx!.lineWidth = 1.5;
            ctx!.stroke();
            return { id: anchor.id, x: px, y: py, visible: true, scaleFactor: 1 };
          }
          return { id: anchor.id, x: cx, y: cy, visible: false, scaleFactor: 1 };
        });
        onChangeRef.current(positions);
      }
    }

    function animate() {
      if (autoRotate) rotX += ROT_SPEED;
      draw();
      rafId = requestAnimationFrame(animate);
    }

    animate();

    // ── Drag to rotate ──
    let cleanupDrag: (() => void) | null = null;
    let cleanupWheel: (() => void) | null = null;

    if (interactive) {
      const onMouseDown = (e: MouseEvent) => {
        autoRotate = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const startRotX = rotX;
        const startRotY = rotY;
        const onMove = (me: MouseEvent) => {
          rotX = startRotX + ((me.clientX - startX) * Math.PI) / 360;
          rotY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
            startRotY - ((me.clientY - startY) * Math.PI) / 360
          ));
        };
        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          setTimeout(() => { autoRotate = true; }, 150);
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      };
      const onWheel = (e: WheelEvent) => e.preventDefault();
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("wheel", onWheel, { passive: false });
      cleanupDrag = () => canvas.removeEventListener("mousedown", onMouseDown);
      cleanupWheel = () => canvas.removeEventListener("wheel", onWheel);
    }

    return () => {
      cancelAnimationFrame(rafId);
      cleanupDrag?.();
      cleanupWheel?.();
    };
  }, [width, height, interactive]);

  return <canvas ref={canvasRef} className={className} style={{ display: "block" }} />;
}
