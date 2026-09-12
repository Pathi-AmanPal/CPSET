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
const LAND_DOTS: { lngDeg: number; latDeg: number; isHub: boolean }[] = CONTINENT_SHAPES.flatMap((polygon, si) => {
  const lons = polygon.map(([lon]) => lon);
  const lats = polygon.map(([, lat]) => lat);
  const pts: { lngDeg: number; latDeg: number; isHub: boolean }[] = [];
  let idx = 0;
  for (let lat = Math.floor(Math.min(...lats)); lat <= Math.ceil(Math.max(...lats)); lat += 3.5) {
    for (let lon = Math.floor(Math.min(...lons)); lon <= Math.ceil(Math.max(...lons)); lon += 3.8) {
      const p: [number, number] = [lon + ((lat * 3 + si) % 3), lat + ((lon + si) % 2)];
      if (insidePolygon(p, polygon)) {
        pts.push({ lngDeg: p[0], latDeg: p[1], isHub: idx % 11 === 0 });
        idx++;
      }
    }
  }
  return pts;
});

// Graticule parameters
const LAT_LINES = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
const LON_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
const GRAT_SAMPLES = 72;

// ── 3D Network Arc Definitions (Connecting dots across global hubs) ──────────
interface ConnectionArc {
  from: [number, number]; // [lng, lat]
  to: [number, number];   // [lng, lat]
  colorRgb: string;       // "130, 180, 255" or "168, 85, 247"
  speed: number;
  height: number;         // Max elevation multiplier (0.15 .. 0.30)
  phase: number;
}

const ARC_CONNECTIONS: ConnectionArc[] = [
  // New York <-> London
  { from: [-74.006, 40.7128], to: [-0.1276, 51.5074], colorRgb: "140, 190, 255", speed: 0.75, height: 0.22, phase: 0.0 },
  // London <-> Paris
  { from: [-0.1276, 51.5074], to: [2.3522, 48.8566], colorRgb: "180, 110, 255", speed: 1.10, height: 0.15, phase: 0.25 },
  // Chandigarh <-> London
  { from: [76.5746, 30.7688], to: [-0.1276, 51.5074], colorRgb: "120, 160, 255", speed: 0.65, height: 0.28, phase: 0.50 },
  // Chandigarh <-> Singapore
  { from: [76.5746, 30.7688], to: [103.8198, 1.3521], colorRgb: "160, 130, 255", speed: 0.85, height: 0.20, phase: 0.15 },
  // Singapore <-> Tokyo
  { from: [103.8198, 1.3521], to: [139.6917, 35.6895], colorRgb: "140, 200, 255", speed: 0.95, height: 0.24, phase: 0.40 },
  // Tokyo <-> San Francisco
  { from: [139.6917, 35.6895], to: [-122.4194, 37.7749], colorRgb: "180, 120, 255", speed: 0.60, height: 0.32, phase: 0.70 },
  // San Francisco <-> New York
  { from: [-122.4194, 37.7749], to: [-74.006, 40.7128], colorRgb: "130, 180, 255", speed: 1.15, height: 0.18, phase: 0.30 },
  // Buenos Aires <-> Cape Town
  { from: [-58.3816, -34.6037], to: [18.4241, -33.9249], colorRgb: "170, 100, 255", speed: 0.70, height: 0.26, phase: 0.85 },
  // Cape Town <-> Chandigarh
  { from: [18.4241, -33.9249], to: [76.5746, 30.7688], colorRgb: "120, 170, 255", speed: 0.80, height: 0.27, phase: 0.60 },
  // Sydney <-> Tokyo
  { from: [151.2093, -33.8688], to: [139.6917, 35.6895], colorRgb: "160, 140, 255", speed: 0.90, height: 0.22, phase: 0.10 },
  // Paris <-> Chandigarh
  { from: [2.3522, 48.8566], to: [76.5746, 30.7688], colorRgb: "140, 180, 255", speed: 0.72, height: 0.25, phase: 0.45 },
];

// ── 3D Math Helper Functions ──────────────────────────────────────────────────

// Convert [lng, lat] to unit 3D Cartesian vector with yaw rotation
function get3DVector(lngDeg: number, latDeg: number, yaw: number): [number, number, number] {
  const lng = (lngDeg * Math.PI) / 180 + yaw;
  const lat = (latDeg * Math.PI) / 180;
  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  return [cosLat * Math.sin(lng), -sinLat, cosLat * Math.cos(lng)];
}

// Project 3D vector to canvas 2D screen coordinates with radius height multiplier & pitch
function projectVector(
  v: [number, number, number],
  heightMult: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number
): [number, number, number] {
  const r = radius * heightMult;
  const x0 = v[0];
  const y0 = v[1];
  const z0 = v[2];

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const y1 = y0 * cosP - z0 * sinP;
  const z1 = y0 * sinP + z0 * cosP;

  return [cx + x0 * r, cy + y1 * r, z1];
}

// Spherical Linear Interpolation (SLERP) between two 3D vectors
function slerp(v1: [number, number, number], v2: [number, number, number], t: number): [number, number, number] {
  let dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  dot = Math.max(-1, Math.min(1, dot));

  const theta = Math.acos(dot);
  if (Math.abs(theta) < 0.001) {
    return [
      v1[0] + t * (v2[0] - v1[0]),
      v1[1] + t * (v2[1] - v1[1]),
      v1[2] + t * (v2[2] - v1[2]),
    ];
  }

  const sinTheta = Math.sin(theta);
  const w1 = Math.sin((1 - t) * theta) / sinTheta;
  const w2 = Math.sin(t * theta) / sinTheta;

  return [
    w1 * v1[0] + w2 * v2[0],
    w1 * v1[1] + w2 * v2[1],
    w1 * v1[2] + w2 * v2[2],
  ];
}

// Standard 3D Orthographic Projection for surface points
function project3D(
  lngDeg: number,
  latDeg: number,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number
): [number, number, number] | null {
  const v = get3DVector(lngDeg, latDeg, yaw);
  const pt = projectVector(v, 1.0, pitch, cx, cy, radius);
  if (pt[2] < -0.1) return null; // backface cull
  return pt;
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

    // Rotation state
    let yaw = 0;
    let pitch = 0.22; // slight tilt for 3D depth — matches Dribbble look
    const ROT_SPEED = 0.004;

    // Inertia physics
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velYaw = 0;
    let velPitch = 0;
    let rafId = 0;
    let animTime = 0;

    function draw() {
      ctx!.clearRect(0, 0, cw, ch);
      animTime += 16; // ~60fps time step in ms

      // ── 1. Ambient page background glow behind globe ──
      const pageGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.9);
      pageGlow.addColorStop(0, "rgba(30, 60, 190, 0.20)");
      pageGlow.addColorStop(0.5, "rgba(18, 35, 120, 0.09)");
      pageGlow.addColorStop(1, "rgba(8, 16, 70, 0)");
      ctx!.fillStyle = pageGlow;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.9, 0, Math.PI * 2);
      ctx!.fill();

      // ── 2. Atmospheric halo — vivid blue-purple outer ring ──
      const halo = ctx!.createRadialGradient(cx, cy, radius * 0.80, cx, cy, radius * 1.48);
      halo.addColorStop(0, "rgba(60, 120, 255, 0.0)");
      halo.addColorStop(0.38, "rgba(80, 140, 255, 0.20)");
      halo.addColorStop(0.72, "rgba(110, 80, 230, 0.12)");
      halo.addColorStop(1, "rgba(60, 40, 185, 0)");
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.48, 0, Math.PI * 2);
      ctx!.fill();

      // ── 3. Clip to globe circle ──
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.clip();

      // ── 4. Sphere fill — deep navy gradient ──
      const sphereFill = ctx!.createRadialGradient(
        cx - radius * 0.30, cy - radius * 0.35, radius * 0.05,
        cx + radius * 0.15, cy + radius * 0.15, radius * 1.18
      );
      sphereFill.addColorStop(0, "rgba(8, 18, 58, 0.98)");
      sphereFill.addColorStop(0.28, "rgba(6, 13, 44, 0.94)");
      sphereFill.addColorStop(0.65, "rgba(10, 22, 68, 0.60)");
      sphereFill.addColorStop(1, "rgba(4, 11, 38, 0.28)");
      ctx!.fillStyle = sphereFill;
      ctx!.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 5. Ambient side blue tint ──
      const sideTint = ctx!.createLinearGradient(cx - radius, cy, cx + radius, cy);
      sideTint.addColorStop(0, "rgba(60, 130, 255, 0.11)");
      sideTint.addColorStop(0.45, "rgba(20, 60, 190, 0.02)");
      sideTint.addColorStop(1, "rgba(5, 20, 85, 0.07)");
      ctx!.fillStyle = sideTint;
      ctx!.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 6. Latitude graticule rings — depth-correct alpha ──
      for (const latDeg of LAT_LINES) {
        ctx!.beginPath();
        let pathStarted = false;
        for (let i = 0; i <= GRAT_SAMPLES; i++) {
          const lngDeg = (i / GRAT_SAMPLES) * 360 - 180;
          const pt = project3D(lngDeg, latDeg, yaw, pitch, cx, cy, radius);
          if (!pt) { pathStarted = false; continue; }
          if (!pathStarted) {
            ctx!.beginPath();
            ctx!.moveTo(pt[0], pt[1]);
            pathStarted = true;
          } else {
            ctx!.lineTo(pt[0], pt[1]);
          }
          if (i < GRAT_SAMPLES) {
            const nextLng = ((i + 1) / GRAT_SAMPLES) * 360 - 180;
            const nextPt = project3D(nextLng, latDeg, yaw, pitch, cx, cy, radius);
            if (nextPt) {
              const avgDepth = (pt[2] + nextPt[2]) / 2;
              const a = 0.16 + Math.max(0, avgDepth) * 0.48;
              ctx!.strokeStyle = `rgba(90, 155, 255, ${a})`;
              ctx!.lineWidth = 0.75;
              ctx!.stroke();
              ctx!.beginPath();
              ctx!.moveTo(pt[0], pt[1]);
            }
          }
        }
      }

      // ── 7. Longitude meridians — depth-correct alpha ──
      for (const lngDeg of LON_LINES) {
        for (let i = 0; i < GRAT_SAMPLES; i++) {
          const lat1 = (i / GRAT_SAMPLES) * 180 - 90;
          const lat2 = ((i + 1) / GRAT_SAMPLES) * 180 - 90;
          const p1 = project3D(lngDeg, lat1, yaw, pitch, cx, cy, radius);
          const p2 = project3D(lngDeg, lat2, yaw, pitch, cx, cy, radius);
          if (!p1 || !p2) continue;
          const avgDepth = (p1[2] + p2[2]) / 2;
          const alpha = 0.18 + Math.max(0, avgDepth) * 0.42;
          ctx!.strokeStyle = `rgba(105, 160, 255, ${alpha})`;
          ctx!.lineWidth = 0.75;
          ctx!.beginPath();
          ctx!.moveTo(p1[0], p1[1]);
          ctx!.lineTo(p2[0], p2[1]);
          ctx!.stroke();
        }
      }

      // Store hub node projected 2D coordinates for inter-hub constellation mesh
      const visibleHubs: { x: number; y: number; z: number }[] = [];

      // ── 8. Land dots — depth-based luminance with hub glow nodes ──
      for (const { lngDeg, latDeg, isHub } of LAND_DOTS) {
        const pt = project3D(lngDeg, latDeg, yaw, pitch, cx, cy, radius);
        if (!pt) continue;
        const [sx, sy, depth] = pt;
        if (depth < -0.04) continue;

        const opacity = 0.50 + depth * 0.42;
        const dotSize = 1.3 * (0.88 + depth * 0.30);

        if (isHub) {
          if (depth > 0.25) {
            visibleHubs.push({ x: sx, y: sy, z: depth });
          }

          // Hub glow node — larger, radial glow aura
          const hubGlow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, dotSize * 5);
          hubGlow.addColorStop(0, `rgba(205, 235, 255, ${Math.min(opacity * 1.05, 1.0)})`);
          hubGlow.addColorStop(0.30, `rgba(145, 200, 255, ${opacity * 0.55})`);
          hubGlow.addColorStop(1, "rgba(80, 165, 255, 0)");
          ctx!.fillStyle = hubGlow;
          ctx!.beginPath();
          ctx!.arc(sx, sy, dotSize * 5, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.fillStyle = `rgba(225, 242, 255, ${Math.min(opacity * 1.12, 1.0)})`;
          ctx!.beginPath();
          ctx!.arc(sx, sy, dotSize * 1.8, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          // Regular land dot — bright blue-white
          ctx!.fillStyle = `rgba(145, 200, 255, ${opacity})`;
          ctx!.beginPath();
          ctx!.arc(sx, sy, dotSize, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // ── 8B. Inter-Hub Network Mesh Constellation (Connecting nearby dots) ─────
      const maxMeshDist = radius * 0.28;
      for (let i = 0; i < visibleHubs.length; i++) {
        for (let j = i + 1; j < visibleHubs.length; j++) {
          const h1 = visibleHubs[i];
          const h2 = visibleHubs[j];
          const dx = h2.x - h1.x;
          const dy = h2.y - h1.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxMeshDist) {
            const meshAlpha = (1 - dist / maxMeshDist) * 0.28 * Math.min(h1.z, h2.z);
            ctx!.strokeStyle = `rgba(120, 175, 255, ${meshAlpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.beginPath();
            ctx!.moveTo(h1.x, h1.y);
            ctx!.lineTo(h2.x, h2.y);
            ctx!.stroke();
          }
        }
      }

      // ── 8C. 3D Elevated Great-Circle Network Arcs + Travelling Dots ───────────
      const ARC_SAMPLES = 36;
      for (const arc of ARC_CONNECTIONS) {
        const v1 = get3DVector(arc.from[0], arc.from[1], yaw);
        const v2 = get3DVector(arc.to[0], arc.to[1], yaw);

        // Project sample points along arc
        const points: { x: number; y: number; z: number }[] = [];
        let anyVisible = false;

        for (let s = 0; s <= ARC_SAMPLES; s++) {
          const t = s / ARC_SAMPLES;
          const vt = slerp(v1, v2, t);
          const heightMult = 1.0 + arc.height * Math.sin(Math.PI * t);
          const pt = projectVector(vt, heightMult, pitch, cx, cy, radius);
          points.push({ x: pt[0], y: pt[1], z: pt[2] });
          if (pt[2] > -0.05) anyVisible = true;
        }

        if (!anyVisible) continue; // skip if entire arc is hidden at the back

        // Draw curved 3D Arc line
        for (let s = 0; s < ARC_SAMPLES; s++) {
          const pA = points[s];
          const pB = points[s + 1];
          const avgZ = (pA.z + pB.z) / 2;
          if (avgZ < -0.1) continue;

          const arcAlpha = Math.max(0.05, Math.min(0.75, (avgZ + 0.1) * 0.65));
          ctx!.strokeStyle = `rgba(${arc.colorRgb}, ${arcAlpha})`;
          ctx!.lineWidth = 1.25;
          ctx!.beginPath();
          ctx!.moveTo(pA.x, pA.y);
          ctx!.lineTo(pB.x, pB.y);
          ctx!.stroke();
        }

        // Animate travelling particle dot along arc
        const dotT = ((animTime * 0.0003 * arc.speed + arc.phase) % 1.0 + 1.0) % 1.0;
        const vtDot = slerp(v1, v2, dotT);
        const heightMultDot = 1.0 + arc.height * Math.sin(Math.PI * dotT);
        const ptDot = projectVector(vtDot, heightMultDot, pitch, cx, cy, radius);

        if (ptDot[2] > -0.05) {
          const dotAlpha = Math.min(1.0, (ptDot[2] + 0.1) * 1.2);

          // 1. Draw glowing tail behind travelling particle dot
          const TAIL_STEPS = 6;
          for (let k = 1; k <= TAIL_STEPS; k++) {
            const tailT = Math.max(0, dotT - k * 0.02);
            const vtTail = slerp(v1, v2, tailT);
            const hTail = 1.0 + arc.height * Math.sin(Math.PI * tailT);
            const ptTail = projectVector(vtTail, hTail, pitch, cx, cy, radius);
            if (ptTail[2] > -0.05) {
              const tailAlpha = dotAlpha * (1 - k / TAIL_STEPS) * 0.55;
              ctx!.fillStyle = `rgba(${arc.colorRgb}, ${tailAlpha})`;
              ctx!.beginPath();
              ctx!.arc(ptTail[0], ptTail[1], 1.8 * (1 - k / (TAIL_STEPS * 1.5)), 0, Math.PI * 2);
              ctx!.fill();
            }
          }

          // 2. Travelling particle dot — outer bright glow
          const particleGlow = ctx!.createRadialGradient(ptDot[0], ptDot[1], 0, ptDot[0], ptDot[1], 14);
          particleGlow.addColorStop(0, `rgba(240, 248, 255, ${dotAlpha})`);
          particleGlow.addColorStop(0.35, `rgba(${arc.colorRgb}, ${dotAlpha * 0.85})`);
          particleGlow.addColorStop(1, `rgba(${arc.colorRgb}, 0)`);
          ctx!.fillStyle = particleGlow;
          ctx!.beginPath();
          ctx!.arc(ptDot[0], ptDot[1], 14, 0, Math.PI * 2);
          ctx!.fill();

          // 3. Travelling particle core dot
          ctx!.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`;
          ctx!.beginPath();
          ctx!.arc(ptDot[0], ptDot[1], 3.2, 0, Math.PI * 2);
          ctx!.fill();

          // 4. Ripple effect at endpoints (origin & destination nodes)
          if (dotT < 0.12 || dotT > 0.88) {
            const isNearDest = dotT > 0.88;
            const targetV = isNearDest ? v2 : v1;
            const targetPt = projectVector(targetV, 1.0, pitch, cx, cy, radius);
            if (targetPt[2] > 0.0) {
              const pulsePhase = isNearDest ? (dotT - 0.88) / 0.12 : (0.12 - dotT) / 0.12;
              const pulseRadius = 5 + pulsePhase * 16;
              const pulseAlpha = (1 - pulsePhase) * 0.70;

              ctx!.strokeStyle = `rgba(${arc.colorRgb}, ${pulseAlpha})`;
              ctx!.lineWidth = 1.5;
              ctx!.beginPath();
              ctx!.arc(targetPt[0], targetPt[1], pulseRadius, 0, Math.PI * 2);
              ctx!.stroke();
            }
          }
        }
      }

      // ── 9. Anchor pins — glowing pulse nodes ──
      const curAnchors = anchorsRef.current;
      if (curAnchors.length > 0 && onChangeRef.current) {
        const positions: GlobeAnchorPosition[] = curAnchors.map((anchor) => {
          const pt = project3D(anchor.lng, anchor.lat, yaw, pitch, cx, cy, radius);
          if (pt) {
            const [px, py, z] = pt;
            const alpha = Math.max(0.3, z * 0.9);

            // Outer glow aura
            const aura = ctx!.createRadialGradient(px, py, 0, px, py, 16);
            aura.addColorStop(0, `rgba(122, 154, 255, ${alpha * 0.45})`);
            aura.addColorStop(1, "rgba(122, 154, 255, 0)");
            ctx!.fillStyle = aura;
            ctx!.beginPath();
            ctx!.arc(px, py, 16, 0, Math.PI * 2);
            ctx!.fill();

            // Core dot
            ctx!.beginPath();
            ctx!.arc(px, py, 4, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(140, 170, 255, ${alpha})`;
            ctx!.shadowColor = "rgba(122, 154, 255, 0.9)";
            ctx!.shadowBlur = 14;
            ctx!.fill();
            ctx!.shadowBlur = 0;

            // Ring
            ctx!.beginPath();
            ctx!.arc(px, py, 8, 0, Math.PI * 2);
            ctx!.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.85})`;
            ctx!.lineWidth = 1.5;
            ctx!.stroke();

            return { id: anchor.id, x: px, y: py, visible: true, scaleFactor: z };
          }
          return { id: anchor.id, x: cx, y: cy, visible: false, scaleFactor: 1 };
        });
        onChangeRef.current(positions);
      }

      ctx!.restore(); // end clip

      // ── 10. Rim highlight — bright upper-left edge arc ──
      const rim = ctx!.createRadialGradient(
        cx - radius * 0.24, cy - radius * 0.30, radius * 0.54,
        cx, cy, radius * 1.04
      );
      rim.addColorStop(0, "rgba(130, 205, 255, 0)");
      rim.addColorStop(0.78, "rgba(110, 185, 255, 0)");
      rim.addColorStop(0.91, "rgba(130, 200, 255, 0.42)");
      rim.addColorStop(1, "rgba(170, 215, 255, 0.58)");
      ctx!.fillStyle = rim;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fill();

      // ── 11. Outer border ring — glowing cobalt ──
      ctx!.strokeStyle = "rgba(100, 165, 255, 0.55)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.stroke();
    }

    function animate() {
      // Physics update
      if (!isDragging) {
        if (Math.abs(velYaw) > 0.0001 || Math.abs(velPitch) > 0.0001) {
          // Inertia after drag
          yaw += velYaw;
          pitch += velPitch;
          velYaw *= 0.92;
          velPitch *= 0.92;
        } else {
          // Auto-spin
          yaw += ROT_SPEED;
        }
      }
      // Clamp pitch
      pitch = Math.max(-0.55, Math.min(0.55, pitch));

      draw();
      rafId = requestAnimationFrame(animate);
    }

    animate();

    // ── Drag / pointer interaction ──
    if (interactive) {
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        velYaw = 0;
        velPitch = 0;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dYaw = (dx * Math.PI) / 360;
        const dPitch = (dy * Math.PI) / 360;
        yaw += dYaw;
        pitch += dPitch;
        velYaw = dYaw;
        velPitch = dPitch;
        lastX = e.clientX;
        lastY = e.clientY;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const onWheel = (e: WheelEvent) => e.preventDefault();

      canvas.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        cancelAnimationFrame(rafId);
        canvas.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("wheel", onWheel);
      };
    }

    return () => cancelAnimationFrame(rafId);
  }, [width, height, interactive]);

  return <canvas ref={canvasRef} className={className} style={{ display: "block" }} />;
}
