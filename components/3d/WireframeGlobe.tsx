"use client";

import { useEffect, useRef, useState } from "react";

export interface WireframeGlobeProps {
  diameter?: number;
  speed?: number;
  maxTilt?: number;
  className?: string;
}

// Continent polygon outlines (simplified) [lon, lat] — same as reference source
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

// Pre-rasterize continent land points at build time
const landPoints: { lon: number; lat: number; size: number }[] = continentShapes.flatMap((polygon, shapeIndex) => {
  const lons = polygon.map(([lon]) => lon);
  const lats = polygon.map(([, lat]) => lat);
  const points: { lon: number; lat: number; size: number }[] = [];
  for (let lat = Math.floor(Math.min(...lats)); lat <= Math.ceil(Math.max(...lats)); lat += 3.8) {
    for (let lon = Math.floor(Math.min(...lons)); lon <= Math.ceil(Math.max(...lons)); lon += 4.2) {
      const jittered: [number, number] = [
        lon + ((lat * 3 + shapeIndex) % 3),
        lat + ((lon + shapeIndex) % 2),
      ];
      if (insidePolygon(jittered, polygon)) {
        points.push({ lon: jittered[0], lat: jittered[1], size: 1.3 });
      }
    }
  }
  return points;
});

export default function WireframeGlobe({
  diameter = 680,
  speed = 0.0018,
  maxTilt = 0.28,
  className = "",
}: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startTiltRef = useRef(0);
  const angleRef = useRef(0);
  const draggingRef = useRef(false);
  const tiltRef = useRef(0);
  const hoverTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let width = 0;
    let height = 0;

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
      const cx = width / 2;
      const cy = height * 0.46; // slightly above center to leave room for rings
      const radius = Math.min(width * 0.45, height * 0.42, diameter / 2);

      ctx.clearRect(0, 0, width, height);

      if (!width) {
        resize();
        frame = requestAnimationFrame(draw);
        return;
      }

      if (!draggingRef.current) {
        angleRef.current += speed;
        tiltRef.current += (hoverTargetRef.current - tiltRef.current) * 0.08;
      }

      const angle = angleRef.current + (tiltRef.current * Math.PI) / 180;

      // ── 1. Atmospheric halo ──
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 1.25);
      halo.addColorStop(0, "rgba(166, 145, 235, 0.09)");
      halo.addColorStop(1, "rgba(166, 145, 235, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Globe clipping region ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // ── 3. Globe fill (radial gradient: white → light lavender) ──
      const globeFill = ctx.createRadialGradient(
        cx - radius * 0.34, cy - radius * 0.4, radius * 0.08,
        cx + radius * 0.2, cy + radius * 0.2, radius * 1.2
      );
      globeFill.addColorStop(0, "rgba(255,255,255,0.98)");
      globeFill.addColorStop(0.34, "rgba(246,243,255,0.9)");
      globeFill.addColorStop(0.72, "rgba(205,193,244,0.2)");
      globeFill.addColorStop(1, "rgba(154,132,220,0.16)");
      ctx.fillStyle = globeFill;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 4. Side shading ──
      const shade = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      shade.addColorStop(0, "rgba(255,255,255,0.22)");
      shade.addColorStop(0.58, "rgba(100,75,180,0.012)");
      shade.addColorStop(1, "rgba(75,55,145,0.07)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 5. Latitude lines ──
      ctx.lineWidth = 0.7;
      for (let lat = -75; lat <= 75; lat += 15) {
        const y = cy - Math.sin((lat * Math.PI) / 180) * radius;
        const rx = Math.cos((lat * Math.PI) / 180) * radius;
        ctx.strokeStyle = "rgba(123,103,194,0.16)";
        ctx.beginPath();
        ctx.ellipse(cx, y, rx, Math.max(4, radius * 0.075), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── 6. Longitude lines ──
      for (let longitude = -150; longitude <= 150; longitude += 30) {
        const visibleAngle = (longitude * Math.PI) / 180 + angle;
        const rx = Math.abs(Math.cos(visibleAngle)) * radius;
        ctx.strokeStyle = `rgba(128,101,205,${0.06 + Math.abs(Math.cos(visibleAngle)) * 0.13})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(3, rx), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── 7. Land dots ──
      landPoints.forEach(({ lon, lat, size }) => {
        const latitude = (lat * Math.PI) / 180;
        const longitude = (lon * Math.PI) / 180 + angle;
        const depth = Math.cos(latitude) * Math.cos(longitude);
        if (depth < -0.08) return; // backface cull
        const x = cx + radius * Math.cos(latitude) * Math.sin(longitude);
        const y = cy - radius * Math.sin(latitude);
        ctx.fillStyle = `rgba(135,108,211,${0.22 + depth * 0.25})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore(); // end clip

      // ── 8. Rim highlight ──
      const rim = ctx.createRadialGradient(
        cx - radius * 0.2, cy - radius * 0.25, radius * 0.5,
        cx, cy, radius * 1.04
      );
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.83, "rgba(145,121,220,0)");
      rim.addColorStop(1, "rgba(145,121,220,0.14)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // ── 9. Sphere border ──
      ctx.strokeStyle = "rgba(145,121,220,0.2)";
      ctx.lineWidth = 1.2;
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

  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    startTiltRef.current = tiltRef.current;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      const nextTilt = startTiltRef.current + (e.clientX - startXRef.current) * 0.18;
      tiltRef.current = nextTilt;
      return;
    }
    const bounds = e.currentTarget.getBoundingClientRect();
    hoverTargetRef.current = ((e.clientX - bounds.left) / bounds.width - 0.5) * 24;
  };

  const stopDragging = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`globe-scene ${isDragging ? "is-dragging" : ""} ${className}`}
      onPointerLeave={() => { hoverTargetRef.current = 0; }}
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
          aria-label="Rotating holographic globe"
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
