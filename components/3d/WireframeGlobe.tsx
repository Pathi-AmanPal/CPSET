"use client";

import { useEffect, useRef, useState } from "react";

export interface WireframeGlobeProps {
  diameter?: number;
  speed?: number;
  maxTilt?: number;
  className?: string;
}

// Continent polygon outlines (simplified) [lon, lat]
const continentShapes: [number, number][][] = [
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

// Point-in-polygon test (Ray casting)
function insidePolygon(point: [number, number], polygon: [number, number][]): boolean {
  return polygon.reduce((inside, current, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const intersects =
      current[1] > point[1] !== previous[1] > point[1] &&
      point[0] < ((previous[0] - current[0]) * (point[1] - current[1])) / (previous[1] - current[1]) + current[0];
    return intersects ? !inside : inside;
  }, false);
}

// Pre-rasterize continent land points
const landPoints: { lonRad: number; latRad: number; size: number }[] = continentShapes.flatMap((polygon, shapeIndex) => {
  const lons = polygon.map(([lon]) => lon);
  const lats = polygon.map(([, lat]) => lat);
  const points: { lonRad: number; latRad: number; size: number }[] = [];
  for (let lat = Math.floor(Math.min(...lats)); lat <= Math.ceil(Math.max(...lats)); lat += 3.5) {
    for (let lon = Math.floor(Math.min(...lons)); lon <= Math.ceil(Math.max(...lons)); lon += 3.8) {
      const jittered: [number, number] = [
        lon + ((lat * 3 + shapeIndex) % 3),
        lat + ((lon + shapeIndex) % 2),
      ];
      if (insidePolygon(jittered, polygon)) {
        points.push({
          lonRad: (jittered[0] * Math.PI) / 180,
          latRad: (jittered[1] * Math.PI) / 180,
          size: 1.3,
        });
      }
    }
  }
  return points;
});

// Pre-generate 3D grid line point samples
const LAT_RINGS = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
const LON_MERIDIANS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
const SAMPLES = 64;

const latRingSamples = LAT_RINGS.map((latDeg) => {
  const latRad = (latDeg * Math.PI) / 180;
  const samples: { lonRad: number; latRad: number }[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const lonRad = (i / SAMPLES) * Math.PI * 2;
    samples.push({ lonRad, latRad });
  }
  return samples;
});

const lonMeridianSamples = LON_MERIDIANS.map((lonDeg) => {
  const lonRad = (lonDeg * Math.PI) / 180;
  const samples: { lonRad: number; latRad: number }[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const latRad = -Math.PI / 2 + (i / SAMPLES) * Math.PI;
    samples.push({ lonRad, latRad });
  }
  return samples;
});

// ── 3D Network Arc Definitions (Connecting dots across global hubs) ──────────
interface ConnectionArc {
  from: [number, number]; // [lng, lat]
  to: [number, number];   // [lng, lat]
  colorRgb: string;       // "140, 190, 255" or "180, 110, 255"
  speed: number;
  height: number;
  phase: number;
}

const ARC_CONNECTIONS: ConnectionArc[] = [
  { from: [-74.006, 40.7128], to: [-0.1276, 51.5074], colorRgb: "140, 190, 255", speed: 0.75, height: 0.22, phase: 0.0 },
  { from: [-0.1276, 51.5074], to: [2.3522, 48.8566], colorRgb: "180, 110, 255", speed: 1.10, height: 0.15, phase: 0.25 },
  { from: [76.5746, 30.7688], to: [-0.1276, 51.5074], colorRgb: "120, 160, 255", speed: 0.65, height: 0.28, phase: 0.50 },
  { from: [76.5746, 30.7688], to: [103.8198, 1.3521], colorRgb: "160, 130, 255", speed: 0.85, height: 0.20, phase: 0.15 },
  { from: [103.8198, 1.3521], to: [139.6917, 35.6895], colorRgb: "140, 200, 255", speed: 0.95, height: 0.24, phase: 0.40 },
  { from: [139.6917, 35.6895], to: [-122.4194, 37.7749], colorRgb: "180, 120, 255", speed: 0.60, height: 0.32, phase: 0.70 },
  { from: [-122.4194, 37.7749], to: [-74.006, 40.7128], colorRgb: "130, 180, 255", speed: 1.15, height: 0.18, phase: 0.30 },
  { from: [-58.3816, -34.6037], to: [18.4241, -33.9249], colorRgb: "170, 100, 255", speed: 0.70, height: 0.26, phase: 0.85 },
  { from: [18.4241, -33.9249], to: [76.5746, 30.7688], colorRgb: "120, 170, 255", speed: 0.80, height: 0.27, phase: 0.60 },
  { from: [151.2093, -33.8688], to: [139.6917, 35.6895], colorRgb: "160, 140, 255", speed: 0.90, height: 0.22, phase: 0.10 },
];

function get3DVector(lngDeg: number, latDeg: number, yaw: number): [number, number, number] {
  const lng = (lngDeg * Math.PI) / 180 + yaw;
  const lat = (latDeg * Math.PI) / 180;
  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  return [cosLat * Math.sin(lng), -sinLat, cosLat * Math.cos(lng)];
}

function projectVector(
  v: [number, number, number],
  heightMult: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number
): { sx: number; sy: number; depth: number } {
  const r = radius * heightMult;
  const x0 = v[0];
  const y0 = v[1];
  const z0 = v[2];

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const y1 = y0 * cosP - z0 * sinP;
  const z1 = y0 * sinP + z0 * cosP;

  return {
    sx: cx + x0 * r,
    sy: cy + y1 * r,
    depth: z1,
  };
}

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

// 3D Point Projection Helper for surface samples
function project3D(
  latRad: number,
  lonRad: number,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number
) {
  const cosLat = Math.cos(latRad);
  const sinLat = Math.sin(latRad);
  const cosLon = Math.cos(lonRad + yaw);
  const sinLon = Math.sin(lonRad + yaw);

  const x0 = cosLat * sinLon;
  const y0 = -sinLat;
  const z0 = cosLat * cosLon;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);

  const x = x0;
  const y = y0 * cosP - z0 * sinP;
  const z = y0 * sinP + z0 * cosP;

  return {
    sx: cx + radius * x,
    sy: cy + radius * y,
    depth: z,
  };
}

export default function WireframeGlobe({
  diameter = 680,
  speed = 0.0018,
  maxTilt = 0.28,
  className = "",
}: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Rotation physics states
  const yawRef = useRef(0);
  const pitchRef = useRef(0.18);

  // Interactive drag & hover physics refs
  const draggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const lastMouseYRef = useRef(0);
  const velYawRef = useRef(0);
  const velPitchRef = useRef(0);

  const targetHoverPitchRef = useRef(0.18);
  const targetHoverYawOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let width = 0;
    let height = 0;
    let animTime = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      animTime += 16;
      const cx = width / 2;
      const cy = height * 0.46;
      const radius = Math.min(width * 0.45, height * 0.42, diameter / 2);

      ctx.clearRect(0, 0, width, height);

      if (!width) {
        resize();
        frame = requestAnimationFrame(draw);
        return;
      }

      // Physics update step
      if (draggingRef.current) {
        velYawRef.current *= 0.85;
        velPitchRef.current *= 0.85;
      } else {
        if (Math.abs(velYawRef.current) > 0.0001 || Math.abs(velPitchRef.current) > 0.0001) {
          yawRef.current += velYawRef.current;
          pitchRef.current += velPitchRef.current;
          velYawRef.current *= 0.93;
          velPitchRef.current *= 0.93;
        } else {
          yawRef.current += speed;
          pitchRef.current += (targetHoverPitchRef.current - pitchRef.current) * 0.06;
        }
      }

      pitchRef.current = Math.max(-0.6, Math.min(0.6, pitchRef.current));

      const yaw = yawRef.current;
      const pitch = pitchRef.current;

      // ── 1. Ambient page glow ──
      const pageGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
      pageGlow.addColorStop(0, "rgba(30, 60, 180, 0.18)");
      pageGlow.addColorStop(0.5, "rgba(20, 40, 130, 0.08)");
      pageGlow.addColorStop(1, "rgba(10, 20, 80, 0)");
      ctx.fillStyle = pageGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Atmospheric halo ──
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.42);
      halo.addColorStop(0, "rgba(60, 120, 255, 0.0)");
      halo.addColorStop(0.4, "rgba(80, 130, 255, 0.18)");
      halo.addColorStop(0.75, "rgba(100, 80, 220, 0.10)");
      halo.addColorStop(1, "rgba(60, 40, 180, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.42, 0, Math.PI * 2);
      ctx.fill();

      // ── 3. Globe clipping ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // ── 4. Sphere fill ──
      const globeFill = ctx.createRadialGradient(
        cx - radius * 0.28, cy - radius * 0.32, radius * 0.06,
        cx + radius * 0.15, cy + radius * 0.15, radius * 1.15
      );
      globeFill.addColorStop(0, "rgba(8, 18, 55, 0.97)");
      globeFill.addColorStop(0.30, "rgba(6, 14, 44, 0.92)");
      globeFill.addColorStop(0.68, "rgba(10, 22, 65, 0.55)");
      globeFill.addColorStop(1, "rgba(5, 12, 40, 0.30)");
      ctx.fillStyle = globeFill;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 5. Ambient side light ──
      const shade = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      shade.addColorStop(0, "rgba(60, 130, 255, 0.10)");
      shade.addColorStop(0.45, "rgba(20, 60, 180, 0.02)");
      shade.addColorStop(1, "rgba(5, 20, 80, 0.06)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 6. Latitude Wireframe Rings ──
      latRingSamples.forEach((ringSamples) => {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < ringSamples.length - 1; i++) {
          const p1 = project3D(ringSamples[i].latRad, ringSamples[i].lonRad, yaw, pitch, cx, cy, radius);
          const p2 = project3D(ringSamples[i + 1].latRad, ringSamples[i + 1].lonRad, yaw, pitch, cx, cy, radius);

          const avgDepth = (p1.depth + p2.depth) / 2;
          if (avgDepth < -0.2) continue;

          const alpha = 0.22 + Math.max(0, avgDepth) * 0.42;
          ctx.strokeStyle = `rgba(90, 150, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      });

      // ── 7. Longitude Wireframe Meridians ──
      lonMeridianSamples.forEach((meridianSamples) => {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < meridianSamples.length - 1; i++) {
          const p1 = project3D(meridianSamples[i].latRad, meridianSamples[i].lonRad, yaw, pitch, cx, cy, radius);
          const p2 = project3D(meridianSamples[i + 1].latRad, meridianSamples[i + 1].lonRad, yaw, pitch, cx, cy, radius);

          const avgDepth = (p1.depth + p2.depth) / 2;
          if (avgDepth < -0.2) continue;

          const alpha = 0.25 + Math.max(0, avgDepth) * 0.40;
          ctx.strokeStyle = `rgba(100, 155, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      });

      const visibleHubs: { x: number; y: number; z: number }[] = [];

      // ── 8. Land Points ──
      landPoints.forEach(({ lonRad, latRad, size }, dotIndex) => {
        const { sx, sy, depth } = project3D(latRad, lonRad, yaw, pitch, cx, cy, radius);
        if (depth < -0.06) return;

        const isHub = dotIndex % 13 === 0;
        const opacity = 0.55 + depth * 0.40;
        const scaleSize = size * (0.9 + depth * 0.32);

        if (isHub) {
          if (depth > 0.25) visibleHubs.push({ x: sx, y: sy, z: depth });

          const hubGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, scaleSize * 4.5);
          hubGlow.addColorStop(0, `rgba(200, 230, 255, ${Math.min(opacity * 1.1, 1.0)})`);
          hubGlow.addColorStop(0.35, `rgba(140, 195, 255, ${opacity * 0.55})`);
          hubGlow.addColorStop(1, "rgba(80, 160, 255, 0)");
          ctx.fillStyle = hubGlow;
          ctx.beginPath();
          ctx.arc(sx, sy, scaleSize * 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(220, 240, 255, ${Math.min(opacity * 1.15, 1.0)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, scaleSize * 1.7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(140, 195, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(sx, sy, scaleSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ── 8B. Inter-Hub Constellation Links ──
      const maxMeshDist = radius * 0.28;
      for (let i = 0; i < visibleHubs.length; i++) {
        for (let j = i + 1; j < visibleHubs.length; j++) {
          const h1 = visibleHubs[i];
          const h2 = visibleHubs[j];
          const dist = Math.hypot(h2.x - h1.x, h2.y - h1.y);
          if (dist < maxMeshDist) {
            const meshAlpha = (1 - dist / maxMeshDist) * 0.28 * Math.min(h1.z, h2.z);
            ctx.strokeStyle = `rgba(120, 175, 255, ${meshAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(h1.x, h1.y);
            ctx.lineTo(h2.x, h2.y);
            ctx.stroke();
          }
        }
      }

      // ── 8C. 3D Great-Circle Network Arcs & Travelling Dots ──
      const ARC_SAMPLES = 36;
      for (const arc of ARC_CONNECTIONS) {
        const v1 = get3DVector(arc.from[0], arc.from[1], yaw);
        const v2 = get3DVector(arc.to[0], arc.to[1], yaw);

        const points: { sx: number; sy: number; depth: number }[] = [];
        let anyVisible = false;

        for (let s = 0; s <= ARC_SAMPLES; s++) {
          const t = s / ARC_SAMPLES;
          const vt = slerp(v1, v2, t);
          const heightMult = 1.0 + arc.height * Math.sin(Math.PI * t);
          const pt = projectVector(vt, heightMult, pitch, cx, cy, radius);
          points.push(pt);
          if (pt.depth > -0.05) anyVisible = true;
        }

        if (!anyVisible) continue;

        for (let s = 0; s < ARC_SAMPLES; s++) {
          const pA = points[s];
          const pB = points[s + 1];
          const avgZ = (pA.depth + pB.depth) / 2;
          if (avgZ < -0.1) continue;

          const arcAlpha = Math.max(0.05, Math.min(0.75, (avgZ + 0.1) * 0.65));
          ctx.strokeStyle = `rgba(${arc.colorRgb}, ${arcAlpha})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(pA.sx, pA.sy);
          ctx.lineTo(pB.sx, pB.sy);
          ctx.stroke();
        }

        const dotT = ((animTime * 0.0003 * arc.speed + arc.phase) % 1.0 + 1.0) % 1.0;
        const vtDot = slerp(v1, v2, dotT);
        const heightMultDot = 1.0 + arc.height * Math.sin(Math.PI * dotT);
        const ptDot = projectVector(vtDot, heightMultDot, pitch, cx, cy, radius);

        if (ptDot.depth > -0.05) {
          const dotAlpha = Math.min(1.0, (ptDot.depth + 0.1) * 1.2);

          // Glowing tail behind travelling dot
          const TAIL_STEPS = 6;
          for (let k = 1; k <= TAIL_STEPS; k++) {
            const tailT = Math.max(0, dotT - k * 0.02);
            const vtTail = slerp(v1, v2, tailT);
            const hTail = 1.0 + arc.height * Math.sin(Math.PI * tailT);
            const ptTail = projectVector(vtTail, hTail, pitch, cx, cy, radius);
            if (ptTail.depth > -0.05) {
              const tailAlpha = dotAlpha * (1 - k / TAIL_STEPS) * 0.55;
              ctx.fillStyle = `rgba(${arc.colorRgb}, ${tailAlpha})`;
              ctx.beginPath();
              ctx.arc(ptTail.sx, ptTail.sy, 1.8 * (1 - k / (TAIL_STEPS * 1.5)), 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Particle outer glow
          const particleGlow = ctx.createRadialGradient(ptDot.sx, ptDot.sy, 0, ptDot.sx, ptDot.sy, 14);
          particleGlow.addColorStop(0, `rgba(240, 248, 255, ${dotAlpha})`);
          particleGlow.addColorStop(0.35, `rgba(${arc.colorRgb}, ${dotAlpha * 0.85})`);
          particleGlow.addColorStop(1, `rgba(${arc.colorRgb}, 0)`);
          ctx.fillStyle = particleGlow;
          ctx.beginPath();
          ctx.arc(ptDot.sx, ptDot.sy, 14, 0, Math.PI * 2);
          ctx.fill();

          // Particle core
          ctx.fillStyle = `rgba(255, 255, 255, ${dotAlpha})`;
          ctx.beginPath();
          ctx.arc(ptDot.sx, ptDot.sy, 3.2, 0, Math.PI * 2);
          ctx.fill();

          // Endpoint pulse ripples
          if (dotT < 0.12 || dotT > 0.88) {
            const isNearDest = dotT > 0.88;
            const targetV = isNearDest ? v2 : v1;
            const targetPt = projectVector(targetV, 1.0, pitch, cx, cy, radius);
            if (targetPt.depth > 0.0) {
              const pulsePhase = isNearDest ? (dotT - 0.88) / 0.12 : (0.12 - dotT) / 0.12;
              const pulseRadius = 5 + pulsePhase * 16;
              const pulseAlpha = (1 - pulsePhase) * 0.70;

              ctx.strokeStyle = `rgba(${arc.colorRgb}, ${pulseAlpha})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(targetPt.sx, targetPt.sy, pulseRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      ctx.restore(); // end clip

      // ── 9. Rim Highlight ──
      const rim = ctx.createRadialGradient(
        cx - radius * 0.22, cy - radius * 0.28, radius * 0.52,
        cx, cy, radius * 1.03
      );
      rim.addColorStop(0, "rgba(120, 200, 255, 0)");
      rim.addColorStop(0.80, "rgba(100, 180, 255, 0)");
      rim.addColorStop(0.92, "rgba(120, 195, 255, 0.40)");
      rim.addColorStop(1, "rgba(160, 210, 255, 0.55)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // ── 10. Outer Sphere Border ──
      ctx.strokeStyle = "rgba(100, 160, 255, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [speed, diameter]);

  // Pointer drag & hover events
  const onPointerDown = (e: React.PointerEvent) => {
    lastMouseXRef.current = e.clientX;
    lastMouseYRef.current = e.clientY;
    draggingRef.current = true;
    velYawRef.current = 0;
    velPitchRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      const dx = e.clientX - lastMouseXRef.current;
      const dy = e.clientY - lastMouseYRef.current;

      const dYaw = dx * 0.005;
      const dPitch = dy * 0.005;

      yawRef.current += dYaw;
      pitchRef.current += dPitch;

      velYawRef.current = dYaw;
      velPitchRef.current = dPitch;

      lastMouseXRef.current = e.clientX;
      lastMouseYRef.current = e.clientY;
      return;
    }

    const bounds = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - bounds.left) / bounds.width - 0.5;
    const ny = (e.clientY - bounds.top) / bounds.height - 0.5;

    targetHoverPitchRef.current = 0.18 + ny * maxTilt;
    targetHoverYawOffsetRef.current = nx * maxTilt;
  };

  const stopDragging = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`globe-scene ${isDragging ? "is-dragging" : ""} ${className}`}
      onPointerLeave={() => {
        targetHoverPitchRef.current = 0.18;
        targetHoverYawOffsetRef.current = 0;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="globe-halo" />
      <div className="globe-rotation">
        <canvas
          ref={canvasRef}
          className="globe-canvas"
          aria-label="Rotating three-dimensional holographic globe"
        />
      </div>
      {/* Orbital rings — CSS animated */}
      <div className="orbit-rings" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      {/* Water ripples — CSS animated */}
      <div className="water-ripples" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>
    </div>
  );
}
