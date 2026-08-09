"use client";

import { useEffect, useRef } from "react";

export interface HolographicGlobeProps {
  diameter?: number;
  speed?: number;
  maxTilt?: number;
  className?: string;
}

// Simplified real continent outlines as normalized lat/lon coordinates [lat, lon] in degrees
// These trace approximate continent edges as dense point clouds
const CONTINENT_POINTS: [number, number][] = [
  // North America (west coast)
  [70, -140],[68, -136],[65, -168],[63, -162],[60, -155],[58, -152],[55, -133],[52, -128],[48, -124],[45, -124],[42, -124],[38, -122],[36, -121],[33, -117],[30, -115],
  // North America (east coast)
  [47, -53],[45, -63],[44, -66],[43, -70],[42, -70],[41, -72],[40, -74],[38, -75],[35, -76],[32, -80],[29, -81],[25, -80],[24, -82],
  // North America (south)
  [20, -87],[18, -88],[16, -90],[15, -87],[12, -84],[10, -83],[9, -79],[8, -77],
  // Interior NA
  [50, -95],[48, -84],[45, -75],[42, -83],[40, -80],[38, -77],[36, -79],[33, -84],[30, -90],[27, -97],[25, -100],[30, -105],[35, -106],[40, -104],[44, -103],[48, -100],
  // Greenland
  [76, -18],[72, -22],[70, -25],[68, -28],[65, -38],[63, -45],[61, -48],[60, -44],[65, -52],[70, -51],[74, -57],[77, -60],[80, -26],[83, -30],[76, -18],
  // South America (west)
  [10, -72],[5, -77],[0, -80],[-5, -81],[-10, -77],[-15, -75],[-20, -70],[-25, -71],[-30, -71],[-35, -72],[-40, -73],[-45, -73],[-50, -75],[-55, -68],
  // South America (east)
  [8, -60],[5, -52],[2, -50],[0, -51],[-3, -41],[-8, -35],[-12, -37],[-15, -39],[-20, -41],[-25, -48],[-30, -52],[-33, -53],[-35, -57],[-40, -62],[-45, -65],
  // South America (interior)
  [-5, -65],[-10, -60],[-15, -55],[-20, -58],[-10, -70],[-5, -74],
  // Europe (west)
  [58, -5],[55, -8],[53, -10],[50, -5],[48, -2],[45, -2],[43, 3],[41, 1],[40, 0],[37, -9],[36, -6],[35, -5],[36, -2],[38, 0],[40, 3],
  // Europe (north/scandinavia)
  [71, 26],[70, 18],[68, 14],[65, 14],[62, 5],[60, 5],[59, 11],[56, 10],[55, 12],[57, 10],[60, 5],[63, 8],[66, 14],[68, 18],[70, 25],[71, 28],
  // Europe (east/balkans)
  [46, 14],[45, 18],[44, 16],[42, 20],[41, 20],[40, 22],[38, 22],[37, 22],[36, 23],[36, 28],[38, 26],[40, 27],[42, 28],[44, 29],[46, 30],[48, 37],[50, 38],[52, 32],[54, 20],[56, 21],[58, 22],[59, 24],[60, 25],
  // British Isles
  [58, -5],[57, -2],[55, -3],[53, -4],[52, -5],[51, -3],[51, 1],[53, 0],[54, -2],[56, -3],[58, -3],[60, -2],[58, -5],
  // Africa (west)
  [37, -5],[35, -6],[32, -9],[28, -13],[20, -17],[15, -17],[10, -17],[5, -5],[0, 9],[2, 9],[-5, 10],[-10, 14],[-15, 12],[-20, 14],[-25, 15],[-30, 18],[-34, 18],
  // Africa (east)
  [37, 11],[30, 32],[20, 38],[15, 42],[10, 44],[5, 42],[0, 42],[-5, 39],[-10, 38],[-15, 36],[-20, 35],[-25, 34],[-30, 30],[-34, 27],
  // Africa (interior)
  [20, 17],[15, 22],[10, 20],[5, 25],[0, 28],[-5, 30],[-10, 30],[-15, 25],[-20, 25],[-25, 25],[0, 20],[5, 15],[10, 13],[15, 13],[20, 17],
  // North Africa (coast)
  [37, 10],[36, 2],[30, -5],[25, 0],[22, 5],[18, 15],[22, 37],[31, 32],[37, 25],[38, 20],[37, 13],[37, 10],
  // Arabian Peninsula
  [30, 32],[28, 34],[24, 38],[20, 40],[16, 43],[12, 44],[14, 49],[18, 56],[22, 59],[24, 58],[28, 58],[30, 48],[32, 44],[33, 36],[30, 32],
  // Asia (south coast)
  [24, 66],[22, 68],[20, 73],[18, 72],[15, 74],[12, 77],[8, 77],[8, 80],[10, 80],[14, 80],[18, 84],[20, 86],[22, 91],[22, 92],[24, 92],[22, 92],[20, 87],[18, 84],
  [10, 79],[8, 77],[5, 80],[1, 104],[1, 109],[0, 110],[1, 109],
  // Asia (east coast)
  [22, 114],[25, 121],[29, 122],[33, 120],[37, 121],[40, 122],[44, 132],[48, 140],[50, 140],[55, 135],[55, 162],[60, 162],[65, 170],[66, 162],[65, 145],[63, 142],
  // Asia (north)
  [72, 140],[70, 130],[68, 100],[66, 70],[65, 60],[62, 55],[58, 52],[56, 58],[55, 72],[55, 84],[55, 100],[56, 114],[58, 125],[62, 135],[66, 142],[70, 160],
  // Asia (interior)
  [45, 60],[42, 70],[40, 80],[38, 90],[37, 100],[40, 112],[42, 105],[45, 95],[48, 88],[50, 80],[50, 65],[48, 60],
  // Japan
  [44, 142],[42, 140],[38, 141],[35, 136],[34, 132],[33, 131],[35, 135],[37, 138],[40, 140],[43, 141],[44, 142],
  // Southeast Asia
  [15, 98],[13, 100],[10, 100],[5, 103],[1, 104],[4, 114],[10, 124],[15, 120],[18, 108],[20, 107],[22, 108],[20, 107],
  // Australia (west)
  [-22, 114],[-26, 114],[-30, 115],[-34, 118],[-35, 117],[-31, 115],[-28, 114],[-22, 114],
  // Australia (south/east)
  [-38, 146],[-38, 140],[-36, 137],[-34, 135],[-32, 134],[-31, 130],[-26, 114],[-22, 114],[-18, 122],[-14, 128],[-12, 130],[-12, 136],[-14, 135],[-18, 140],[-22, 150],[-28, 153],[-32, 152],[-35, 150],[-38, 147],[-38, 146],
  // Australia (north)
  [-12, 130],[-14, 135],[-18, 140],[-14, 142],[-12, 143],[-14, 145],[-12, 143],[-12, 136],[-12, 130],
  // New Zealand (rough)
  [-36, 174],[-38, 175],[-41, 174],[-44, 170],[-46, 168],[-44, 170],[-41, 173],[-38, 176],[-36, 174],
];

// Generate node positions for glowing connection points
const NODE_POSITIONS: [number, number][] = [
  [40, -74],   // New York
  [51, 0],     // London
  [48, 2],     // Paris
  [35, 139],   // Tokyo
  [22, 114],   // Hong Kong
  [28, 77],    // Delhi
  [-23, -46],  // São Paulo
  [37, -122],  // San Francisco
  [-33, 151],  // Sydney
  [55, 37],    // Moscow
  [30, 31],    // Cairo
  [1, 103],    // Singapore
];

function latLonToXYZ(lat: number, lon: number, R: number, angle: number): { x: number; y: number; z: number } {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = ((lon + angle * (180 / Math.PI)) * Math.PI) / 180;
  return {
    x: R * Math.cos(latRad) * Math.cos(lonRad),
    y: -R * Math.sin(latRad),
    z: R * Math.cos(latRad) * Math.sin(lonRad),
  };
}

export default function HolographicGlobe({
  diameter = 520,
  speed = 0.0020,
  maxTilt = 0.28,
  className = "",
}: HolographicGlobeProps) {
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
    const LON_RINGS = 18;
    const POINTS_PER_RING = 80;

    let width = 0, height = 0, R = 0, cx = 0, cy = 0;
    let latPoints: { x: number; y: number; z: number }[][] = [];
    let lonPoints: { x: number; y: number; z: number }[][] = [];

    const buildSphere = () => {
      const diam = Math.min(width, height, diameter);
      R = diam * 0.44;
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
          ring.push({ x: ringR * Math.cos(phi), y: R * Math.cos(theta), z: ringR * Math.sin(phi) });
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

    // Cursor tilt
    let targetTiltX = 0, targetTiltY = 0, tiltX = 0, tiltY = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = nx * maxTilt;
      targetTiltX = -ny * maxTilt;
    };
    const handlePointerLeave = () => { targetTiltX = 0; targetTiltY = 0; };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    let angle = 0;
    let raf: number;
    let t = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rotatePoint = (p: { x: number; y: number; z: number }, ax: number, ay: number) => {
      const x = p.x * Math.cos(ay) + p.z * Math.sin(ay);
      const z0 = -p.x * Math.sin(ay) + p.z * Math.cos(ay);
      const y = p.y * Math.cos(ax) - z0 * Math.sin(ax);
      const z = p.y * Math.sin(ax) + z0 * Math.cos(ax);
      return { x, y, z };
    };

    const drawWireRing = (ring: { x: number; y: number; z: number }[], ax: number, ay: number) => {
      ctx.beginPath();
      let started = false;
      ring.forEach((p) => {
        const rp = rotatePoint(p, ax, ay);
        const px = cx + rp.x;
        const py = cy + rp.y;
        const depth = (rp.z + R) / (2 * R); // 0 = back, 1 = front
        ctx.strokeStyle = `rgba(0, 71, 171, ${0.03 + depth * 0.10})`;
        if (!started) { ctx.moveTo(px, py); started = true; }
        else ctx.lineTo(px, py);
      });
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    const drawAtmosphere = () => {
      // Outer atmospheric glow
      const gradient = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
      gradient.addColorStop(0, "rgba(100, 120, 220, 0.06)");
      gradient.addColorStop(0.5, "rgba(80, 80, 200, 0.03)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawContinents = (ax: number, ay: number) => {
      CONTINENT_POINTS.forEach(([lat, lon]) => {
        const p3 = latLonToXYZ(lat, lon, R, angle + tiltY);
        const rp = rotatePoint(p3, ax, 0); // tilt already baked into angle
        const depth = (rp.z + R) / (2 * R);
        if (rp.z < -R * 0.05) return; // backface cull
        const px = cx + rp.x;
        const py = cy + rp.y;

        // Scatter a few dots around each point for stipple density
        for (let i = 0; i < 3; i++) {
          const ox = (Math.random() - 0.5) * R * 0.04;
          const oy = (Math.random() - 0.5) * R * 0.04;
          const opacity = 0.10 + depth * 0.25;
          ctx.fillStyle = `rgba(80, 0, 220, ${opacity})`;
          ctx.beginPath();
          ctx.arc(px + ox, py + oy, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawNodes = (ax: number, ay: number) => {
      NODE_POSITIONS.forEach(([lat, lon], i) => {
        const p3 = latLonToXYZ(lat, lon, R, angle + tiltY);
        const rp = rotatePoint(p3, ax, 0);
        if (rp.z < 0) return; // backface cull
        const depth = (rp.z + R) / (2 * R);
        const px = cx + rp.x;
        const py = cy + rp.y;

        // Pulsing glow
        const pulse = 0.4 + 0.6 * Math.sin(t * 0.8 + i * 1.1);
        const glowR = R * 0.04 + R * 0.02 * pulse;
        const nodeGlow = ctx.createRadialGradient(px, py, 0, px, py, glowR * 2.5);
        nodeGlow.addColorStop(0, `rgba(80, 0, 255, ${0.4 * depth * pulse})`);
        nodeGlow.addColorStop(1, "rgba(80, 0, 255, 0)");
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(px, py, glowR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Node dot
        ctx.fillStyle = `rgba(100, 50, 255, ${0.6 * depth + 0.2})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1.5, R * 0.012), 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawOrbitalRings = () => {
      const baseY = cy + R * 0.88; // position below globe center
      const ringSpecs = [
        { rx: R * 0.50, ry: R * 0.08, delay: 0 },
        { rx: R * 0.75, ry: R * 0.12, delay: 0.6 },
        { rx: R * 1.00, ry: R * 0.16, delay: 1.2 },
        { rx: R * 1.25, ry: R * 0.20, delay: 1.8 },
        { rx: R * 1.50, ry: R * 0.24, delay: 2.4 },
      ];

      ringSpecs.forEach(({ rx, ry, delay }) => {
        const pulse = 0.3 + 0.5 * Math.sin(t * 0.5 + delay);
        ctx.beginPath();
        ctx.ellipse(cx, baseY, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 60, 230, ${0.08 + pulse * 0.12})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Contact point glow
      const contactPulse = 0.5 + 0.5 * Math.sin(t * 1.2);
      const contactGlow = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, R * 0.06);
      contactGlow.addColorStop(0, `rgba(120, 60, 255, ${0.5 * contactPulse})`);
      contactGlow.addColorStop(1, "rgba(120, 60, 255, 0)");
      ctx.fillStyle = contactGlow;
      ctx.beginPath();
      ctx.arc(cx, baseY, R * 0.06, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      const spin = angle; // continent function handles angle internally
      const ax = tiltX;
      const ay = spin + tiltY;

      // Layer order: atmosphere → orbital rings → wireframe → continents → nodes
      drawAtmosphere();
      drawOrbitalRings();

      latPoints.forEach((ring) => drawWireRing(ring, ax, ay));
      lonPoints.forEach((ring) => drawWireRing(ring, ax, ay));

      // Save/restore for continent scatter dots (they use random offsets)
      ctx.save();
      drawContinents(ax, ay);
      ctx.restore();

      drawNodes(ax, ay);

      if (!reduceMotion) {
        angle += speed;
        t += 0.016;
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [diameter, speed, maxTilt]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none select-none" />
    </div>
  );
}
