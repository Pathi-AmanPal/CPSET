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

// 3D Point Projection Helper
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

  // Unit 3D point before pitch tilt
  const x0 = cosLat * sinLon;
  const y0 = -sinLat;
  const z0 = cosLat * cosLon;

  // Rotate around X-axis by pitch angle
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
  const pitchRef = useRef(0.18); // Default slight downward pitch tilt for 3D depth

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
        // Dragging active, velocity decays
        velYawRef.current *= 0.85;
        velPitchRef.current *= 0.85;
      } else {
        // Inertia physics after drag release
        if (Math.abs(velYawRef.current) > 0.0001 || Math.abs(velPitchRef.current) > 0.0001) {
          yawRef.current += velYawRef.current;
          pitchRef.current += velPitchRef.current;
          velYawRef.current *= 0.93;
          velPitchRef.current *= 0.93;
        } else {
          // Normal auto-spin & hover spring lerp
          yawRef.current += speed;
          pitchRef.current += (targetHoverPitchRef.current - pitchRef.current) * 0.06;
        }
      }

      // Clamp pitch to prevent polar inversion flipping
      pitchRef.current = Math.max(-0.6, Math.min(0.6, pitchRef.current));

      const yaw = yawRef.current;
      const pitch = pitchRef.current;

      // ── 1. Atmospheric halo ──
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.42, cx, cy, radius * 1.3);
      halo.addColorStop(0, "rgba(166, 145, 235, 0.12)");
      halo.addColorStop(0.6, "rgba(166, 145, 235, 0.04)");
      halo.addColorStop(1, "rgba(166, 145, 235, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Globe clipping region ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // ── 3. Sphere fill gradient ──
      const globeFill = ctx.createRadialGradient(
        cx - radius * 0.34, cy - radius * 0.4, radius * 0.08,
        cx + radius * 0.2, cy + radius * 0.2, radius * 1.2
      );
      globeFill.addColorStop(0, "rgba(255,255,255,0.98)");
      globeFill.addColorStop(0.34, "rgba(246,243,255,0.92)");
      globeFill.addColorStop(0.72, "rgba(205,193,244,0.22)");
      globeFill.addColorStop(1, "rgba(154,132,220,0.18)");
      ctx.fillStyle = globeFill;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 4. Ambient side shadow ──
      const shade = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
      shade.addColorStop(0, "rgba(255,255,255,0.25)");
      shade.addColorStop(0.58, "rgba(100,75,180,0.01)");
      shade.addColorStop(1, "rgba(75,55,145,0.08)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      // ── 5. Accurate 3D Latitude Wireframe Rings ──
      latRingSamples.forEach((ringSamples) => {
        ctx.lineWidth = 0.75;
        for (let i = 0; i < ringSamples.length - 1; i++) {
          const p1 = project3D(ringSamples[i].latRad, ringSamples[i].lonRad, yaw, pitch, cx, cy, radius);
          const p2 = project3D(ringSamples[i + 1].latRad, ringSamples[i + 1].lonRad, yaw, pitch, cx, cy, radius);

          const avgDepth = (p1.depth + p2.depth) / 2;
          if (avgDepth < -0.2) continue; // Backface cull

          const alpha = 0.04 + Math.max(0, avgDepth) * 0.16;
          ctx.strokeStyle = `rgba(123, 103, 194, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      });

      // ── 6. Accurate 3D Longitude Wireframe Meridians ──
      lonMeridianSamples.forEach((meridianSamples) => {
        ctx.lineWidth = 0.75;
        for (let i = 0; i < meridianSamples.length - 1; i++) {
          const p1 = project3D(meridianSamples[i].latRad, meridianSamples[i].lonRad, yaw, pitch, cx, cy, radius);
          const p2 = project3D(meridianSamples[i + 1].latRad, meridianSamples[i + 1].lonRad, yaw, pitch, cx, cy, radius);

          const avgDepth = (p1.depth + p2.depth) / 2;
          if (avgDepth < -0.2) continue;

          const alpha = 0.05 + Math.max(0, avgDepth) * 0.18;
          ctx.strokeStyle = `rgba(128, 101, 205, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      });

      // ── 7. Accurate 3D Land Points ──
      landPoints.forEach(({ lonRad, latRad, size }) => {
        const { sx, sy, depth } = project3D(latRad, lonRad, yaw, pitch, cx, cy, radius);
        if (depth < -0.06) return; // Backface cull

        const opacity = 0.18 + depth * 0.32;
        const scaleSize = size * (0.85 + depth * 0.3);

        ctx.fillStyle = `rgba(135, 108, 211, ${opacity})`;
        ctx.beginPath();
        ctx.arc(sx, sy, scaleSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore(); // end clip

      // ── 8. Rim Highlight ──
      const rim = ctx.createRadialGradient(
        cx - radius * 0.2, cy - radius * 0.25, radius * 0.5,
        cx, cy, radius * 1.04
      );
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.83, "rgba(145,121,220,0)");
      rim.addColorStop(1, "rgba(145,121,220,0.18)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // ── 9. Outer Sphere Border ──
      ctx.strokeStyle = "rgba(145,121,220,0.22)";
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
