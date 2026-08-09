"use client";

import { useEffect, useRef } from "react";

export interface WireframeGlobeProps {
  diameter?: number;
  speed?: number;
  maxTilt?: number;
  className?: string;
}

// Dense continent outline points [lat, lon] — real geography, stipple dot cloud
const CONTINENT_POINTS: [number, number][] = [
  // ── North America ──
  [70,-140],[68,-136],[65,-168],[63,-162],[60,-155],[58,-152],[55,-133],[52,-128],[48,-124],[46,-124],[44,-124],[42,-124],[40,-122],[38,-122],[36,-121],[34,-120],[33,-117],[30,-115],[28,-115],[25,-110],[22,-106],
  [20,-87],[18,-88],[16,-90],[15,-88],[13,-87],[12,-84],[10,-84],[9,-79],[8,-77],
  [50,-55],[48,-53],[47,-54],[45,-63],[44,-66],[43,-70],[42,-70],[41,-72],[40,-74],[38,-75],[36,-76],[35,-76],[32,-80],[30,-81],[28,-80],[25,-80],[24,-82],[22,-82],[20,-87],
  [50,-95],[48,-84],[46,-84],[45,-75],[42,-83],[40,-80],[38,-77],[36,-79],[33,-84],[30,-90],[28,-97],[25,-97],[22,-98],[30,-105],[35,-106],[40,-104],[44,-103],[48,-100],[50,-97],[52,-97],[55,-97],[58,-95],[60,-93],[62,-94],[65,-87],[68,-88],[70,-90],
  [55,-75],[57,-77],[60,-78],[63,-90],[65,-80],[68,-75],[70,-65],[72,-78],[74,-80],[72,-100],[70,-110],[68,-120],[66,-130],[65,-140],
  // Greenland
  [76,-18],[72,-22],[70,-26],[68,-28],[65,-38],[63,-45],[61,-48],[60,-44],[62,-51],[65,-52],[68,-51],[71,-51],[74,-57],[77,-60],[80,-26],[83,-30],[80,-18],[76,-18],
  // ── South America ──
  [10,-72],[8,-62],[5,-52],[2,-50],[0,-51],[0,-48],[-3,-41],[-5,-35],[-8,-35],[-12,-37],[-14,-39],[-18,-39],[-20,-40],[-22,-43],[-23,-44],[-25,-48],[-28,-49],[-30,-50],[-32,-52],[-33,-53],[-35,-57],[-38,-57],[-40,-62],[-42,-64],[-45,-65],[-48,-65],[-50,-68],[-52,-69],[-54,-68],[-55,-66],
  [-50,-75],[-45,-73],[-40,-73],[-36,-72],[-30,-71],[-25,-71],[-20,-70],[-15,-75],[-10,-77],[-6,-81],[-2,-80],[0,-80],[3,-77],[5,-77],[7,-77],[10,-72],
  [-5,-65],[-10,-60],[-15,-55],[-20,-58],[-10,-70],[-5,-74],[-8,-68],[-15,-65],[-20,-60],[-25,-55],[-20,-50],[-15,-50],[-10,-55],[-5,-60],
  // ── Europe ──
  [36,-9],[35,-6],[36,-5],[37,-2],[38,0],[40,3],[41,1],[42,3],[43,3],[44,5],[45,6],[46,7],[47,9],[47,12],[47,14],[48,16],[48,18],[48,22],[47,22],[46,22],[45,18],[44,18],[44,16],[43,18],[42,20],[41,20],[40,22],[38,22],[37,22],[36,23],[36,28],[38,26],[40,27],[41,29],[42,28],[44,29],[46,30],[48,37],[50,38],[52,32],[54,20],[56,21],[57,22],[58,22],[59,24],[60,25],[59,26],[60,24],[61,24],[62,26],[64,24],[65,22],[66,20],[66,14],[68,14],[69,16],[70,18],[71,26],[71,28],[70,25],[68,18],[66,14],[65,14],[63,9],[62,5],[61,5],[60,5],[59,8],[58,6],[57,8],[55,12],[54,10],[55,10],[56,10],[57,10],[58,11],[59,11],[60,5],[61,5],[62,5],[63,9],[64,10],[66,14],[68,18],
  [58,-5],[57,-2],[55,-3],[53,-4],[52,-5],[51,-3],[51,1],[52,2],[53,0],[54,-2],[56,-3],[57,-4],[58,-3],[60,-2],[58,-5],
  [53,-6],[52,-6],[51,-5],[51,-9],[52,-10],[53,-10],[54,-8],[55,-7],[54,-6],[53,-6],
  // ── Africa ──
  [37,10],[36,2],[35,0],[33,-5],[30,-5],[28,-13],[22,-17],[18,-16],[15,-17],[12,-16],[10,-17],[7,-11],[5,-5],[3,-1],[0,8],[0,9],[2,9],[-2,9],[-5,10],[-8,14],[-10,14],[-12,14],[-15,12],[-18,13],[-20,14],[-22,14],[-24,14],[-25,15],[-28,16],[-30,17],[-34,18],[-34,26],[-30,30],[-25,33],[-20,35],[-15,36],[-10,38],[-8,38],[-5,39],[-2,40],[0,42],[2,42],[5,42],[8,45],[10,44],[12,44],[15,41],[18,40],[20,38],[22,37],[24,37],[28,34],[30,32],[32,32],[35,36],[37,36],[37,25],[38,20],[38,15],[37,13],[37,11],[37,10],
  [0,20],[5,15],[10,13],[15,13],[20,17],[20,25],[15,27],[10,22],[5,22],[0,22],[-5,22],[-8,25],[-10,28],[-12,30],[-15,28],[-18,26],[-20,25],[-10,35],[-5,38],[0,35],[5,35],[10,32],[15,32],[18,35],[20,34],[22,35],[24,32],[20,30],[15,28],[20,25],
  // ── Asia ──
  // Arabian Peninsula
  [30,32],[28,34],[24,38],[22,39],[20,40],[18,41],[15,43],[12,44],[14,49],[18,52],[20,58],[22,59],[24,58],[24,54],[26,56],[28,58],[30,48],[32,44],[33,38],[31,35],[30,32],
  // South Asia coast
  [24,66],[22,68],[20,73],[18,72],[16,74],[14,74],[12,77],[10,77],[8,77],[6,80],[8,80],[10,80],[12,80],[14,80],[16,82],[18,84],[20,86],[22,89],[22,91],[24,92],[22,92],[20,87],[18,84],
  // Sri Lanka
  [10,80],[8,81],[6,81],[8,80],[10,80],
  // SE Asia
  [14,100],[12,101],[10,100],[8,99],[5,100],[2,104],[1,104],[0,104],[1,109],[1,110],[-1,110],[-5,105],[-8,115],[-8,117],[-8,120],[-8,125],[-5,120],[-2,120],[0,120],[3,117],[5,116],[8,118],[10,122],[12,121],[15,121],[18,110],[20,109],[22,112],[20,108],
  [14,100],[14,98],[15,98],[16,98],[18,98],[20,99],[22,100],[23,100],[25,98],[26,95],[26,92],[24,92],
  [5,100],[3,100],[1,104],
  // East Asia coast
  [22,114],[24,118],[26,120],[28,121],[30,122],[32,122],[34,120],[36,122],[38,120],[40,122],[42,122],[44,132],[46,136],[48,140],[50,140],[52,142],[54,142],[56,135],[58,135],[60,150],[62,162],[64,170],[65,170],[66,162],[65,145],[63,142],[62,140],[60,140],
  // Russia/North Asia
  [70,140],[68,132],[66,130],[64,128],[62,128],[60,130],[58,125],[55,120],[55,100],[55,85],[55,73],[56,65],[57,60],[58,52],[56,50],[54,48],[52,48],[50,52],[48,54],[46,52],[44,52],[42,52],[40,52],[38,55],[36,52],[35,36],[36,32],[38,27],
  [70,55],[68,62],[65,55],[62,58],[60,55],[58,52],
  [70,100],[72,110],[72,130],[70,120],[68,110],[66,100],[65,90],[67,80],[68,68],[70,60],[72,58],[74,68],[72,80],[70,90],[72,100],[74,104],[76,108],[78,120],[80,130],[78,142],[76,140],[72,140],
  // Japan
  [44,142],[42,140],[40,140],[38,141],[36,138],[34,134],[33,131],[35,135],[36,136],[38,138],[40,140],[42,141],[44,142],
  [34,129],[33,131],[33,132],[34,132],[35,134],[34,132],
  // Korea
  [38,128],[36,128],[34,128],[35,126],[37,126],[38,128],
  // ── Australia ──
  [-22,114],[-26,114],[-30,115],[-32,116],[-34,118],[-34,120],[-32,116],[-28,114],[-22,114],
  [-38,146],[-38,140],[-36,138],[-34,136],[-32,133],[-30,130],[-28,128],[-26,114],[-22,114],[-18,122],[-16,126],[-14,128],[-12,130],[-14,131],[-14,136],[-16,136],[-14,135],[-12,136],[-12,142],[-14,143],[-16,145],[-18,148],[-22,150],[-26,153],[-28,153],[-30,153],[-32,152],[-34,151],[-36,150],[-38,148],[-38,146],
  [-12,130],[-12,136],[-14,135],[-14,128],[-12,130],
  // New Zealand
  [-36,174],[-38,175],[-40,175],[-42,173],[-44,170],[-46,168],[-44,171],[-42,172],[-40,174],[-38,176],[-36,175],[-36,174],
  [-46,168],[-44,167],[-42,172],
];

// Glowing city/network nodes [lat, lon]
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

function latLonToXYZ(lat: number, lon: number, R: number, angle: number) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = ((lon + (angle * 180) / Math.PI) * Math.PI) / 180;
  return {
    x: R * Math.cos(latRad) * Math.cos(lonRad),
    y: -R * Math.sin(latRad),
    z: R * Math.cos(latRad) * Math.sin(lonRad),
  };
}

export default function WireframeGlobe({
  diameter = 530,
  speed = 0.0018,
  maxTilt = 0.28,
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
    const LON_RINGS = 18;
    const POINTS_PER_RING = 80;

    let width = 0, height = 0, R = 0, cx = 0, cy = 0;
    let latPoints: { x: number; y: number; z: number }[][] = [];
    let lonPoints: { x: number; y: number; z: number }[][] = [];

    const buildSphere = () => {
      const diam = Math.min(width * 0.8, height, diameter);
      R = diam * 0.47;
      cx = width / 2;
      cy = height * 0.46;

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
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = nx * maxTilt;
      targetTiltX = -ny * maxTilt;
    };
    const onPointerLeave = () => { targetTiltX = 0; targetTiltY = 0; };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    let angle = 0, t = 0, raf: number;
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
        const depth = (rp.z + R) / (2 * R);
        ctx.strokeStyle = `rgba(120, 80, 230, ${0.05 + depth * 0.14})`;
        if (!started) { ctx.moveTo(cx + rp.x, cy + rp.y); started = true; }
        else ctx.lineTo(cx + rp.x, cy + rp.y);
      });
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    const drawAtmosphere = () => {
      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.5);
      g.addColorStop(0, "rgba(140, 100, 250, 0.10)");
      g.addColorStop(0.5, "rgba(120, 80, 240, 0.06)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawContinents = (ax: number) => {
      // Pre-rotate all continent points by current angle
      CONTINENT_POINTS.forEach(([lat, lon]) => {
        const p3 = latLonToXYZ(lat, lon, R, angle + tiltY);
        const rp = rotatePoint(p3, ax, 0);
        if (rp.z < -R * 0.02) return; // backface cull
        const depth = (rp.z + R) / (2 * R);
        const px = cx + rp.x;
        const py = cy + rp.y;
        const opacity = 0.30 + depth * 0.55;

        // Core dot
        ctx.fillStyle = `rgba(110, 60, 230, ${opacity})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Scatter halo dots for density
        for (let i = 0; i < 2; i++) {
          const ox = (Math.random() - 0.5) * R * 0.055;
          const oy = (Math.random() - 0.5) * R * 0.055;
          ctx.fillStyle = `rgba(130, 80, 240, ${opacity * 0.55})`;
          ctx.beginPath();
          ctx.arc(px + ox, py + oy, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const drawNodes = (ax: number) => {
      NODE_POSITIONS.forEach(([lat, lon], i) => {
        const p3 = latLonToXYZ(lat, lon, R, angle + tiltY);
        const rp = rotatePoint(p3, ax, 0);
        if (rp.z < 0) return;
        const depth = (rp.z + R) / (2 * R);
        const px = cx + rp.x;
        const py = cy + rp.y;
        const pulse = 0.4 + 0.6 * Math.sin(t * 0.8 + i * 1.1);

        // Glow
        const glowR = R * 0.06 * (0.8 + 0.4 * pulse);
        const g = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        g.addColorStop(0, `rgba(130, 60, 255, ${0.5 * depth * pulse})`);
        g.addColorStop(1, "rgba(130, 60, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.fillStyle = `rgba(130, 60, 255, ${0.75 * depth + 0.15})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(2.5, R * 0.016), 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Six surface connector nodes — fixed on silhouette edge (left + right), 3 each
    const drawSilhouetteNodes = () => {
      const yOffsets = [-R * 0.35, 0, R * 0.35];
      const sides: { side: "left" | "right"; xSign: number }[] = [
        { side: "left", xSign: -1 },
        { side: "right", xSign: 1 },
      ];
      sides.forEach(({ xSign }) => {
        yOffsets.forEach((yOff, j) => {
          const edgeX = cx + xSign * Math.sqrt(Math.max(0, R * R - yOff * yOff));
          const py = cy + yOff;
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.9 + j * 0.8 + (xSign > 0 ? 2 : 0));

          // Glow halo
          const glowR = R * 0.055 + R * 0.025 * pulse;
          const g = ctx.createRadialGradient(edgeX, py, 0, edgeX, py, glowR * 2.2);
          g.addColorStop(0, `rgba(130, 60, 240, ${0.55 * pulse})`);
          g.addColorStop(1, "rgba(130, 60, 240, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(edgeX, py, glowR * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Solid dot
          ctx.fillStyle = `rgba(120, 50, 240, ${0.8 + 0.2 * pulse})`;
          ctx.beginPath();
          ctx.arc(edgeX, py, Math.max(3.5, R * 0.02), 0, Math.PI * 2);
          ctx.fill();
        });
      });
    };

    const drawOrbitalRings = () => {
      // Rings sit right at the bottom of the globe: cy + R * 0.85
      const baseY = cy + R * 0.82;
      const rings = [
        { rx: R * 0.42, ry: R * 0.07, delay: 0 },
        { rx: R * 0.68, ry: R * 0.11, delay: 0.7 },
        { rx: R * 0.96, ry: R * 0.15, delay: 1.4 },
        { rx: R * 1.22, ry: R * 0.19, delay: 2.1 },
        { rx: R * 1.48, ry: R * 0.23, delay: 2.8 },
      ];

      rings.forEach(({ rx, ry, delay }) => {
        const pulse = 0.3 + 0.5 * Math.sin(t * 0.5 + delay);
        ctx.beginPath();
        ctx.ellipse(cx, baseY, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 70, 230, ${0.09 + pulse * 0.14})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // Contact point glow
      const cpulse = 0.5 + 0.5 * Math.sin(t * 1.3);
      const g = ctx.createRadialGradient(cx, baseY, 0, cx, baseY, R * 0.08);
      g.addColorStop(0, `rgba(130, 60, 255, ${0.60 * cpulse})`);
      g.addColorStop(1, "rgba(130, 60, 255, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, baseY, R * 0.07, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      const ax = tiltX;

      drawAtmosphere();
      drawOrbitalRings();

      latPoints.forEach((ring) => drawWireRing(ring, ax, angle + tiltY));
      lonPoints.forEach((ring) => drawWireRing(ring, ax, angle + tiltY));

      ctx.save();
      drawContinents(ax);
      ctx.restore();

      drawNodes(ax);
      drawSilhouetteNodes();

      if (!reduceMotion) { angle += speed; t += 0.016; }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [diameter, speed, maxTilt]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none select-none" />
    </div>
  );
}
