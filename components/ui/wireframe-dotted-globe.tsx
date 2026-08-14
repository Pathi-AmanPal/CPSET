"use client";

import { useEffect, useRef, useState } from "react";
import {
  geoOrthographic,
  geoPath,
  geoBounds,
  geoGraticule,
  geoDistance,
  timer,
} from "d3";

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

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  anchors = [],
  onAnchorPositionsChange,
  interactive = true,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onAnchorPositionsChangeRef = useRef(onAnchorPositionsChange);
  useEffect(() => {
    onAnchorPositionsChangeRef.current = onAnchorPositionsChange;
  }, [onAnchorPositionsChange]);

  const anchorsRef = useRef(anchors);
  useEffect(() => {
    anchorsRef.current = anchors;
  }, [anchors]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = geoPath().projection(projection).context(context);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }

      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
    }

    const allDots: DotData[] = [];
    let landFeatures: any;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;
      const r = projection.rotate();
      const centerLng = -r[0];
      const centerLat = -r[1];

      // Draw ocean (globe background with cyber glow)
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "rgba(7, 11, 26, 0.95)";
      context.fill();

      // Outer glowing rim
      context.strokeStyle = "rgba(90, 138, 255, 0.6)";
      context.lineWidth = 2 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Draw graticule
        const graticule = geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(120, 150, 255, 0.25)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw land outlines
        context.beginPath();
        landFeatures.features.forEach((feature: any) => {
          path(feature);
        });
        context.strokeStyle = "rgba(100, 140, 255, 0.4)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw halftone dots
        allDots.forEach((dot) => {
          const dist = geoDistance([dot.lng, dot.lat], [centerLng, centerLat]);
          if (dist < Math.PI / 2) {
            const projected = projection([dot.lng, dot.lat]);
            if (
              projected &&
              projected[0] >= 0 &&
              projected[0] <= containerWidth &&
              projected[1] >= 0 &&
              projected[1] <= containerHeight
            ) {
              const alpha = Math.max(0.2, 1 - dist / (Math.PI / 2));
              context.beginPath();
              context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
              context.fillStyle = `rgba(160, 185, 255, ${alpha * 0.8})`;
              context.fill();
            }
          }
        });
      }

      // Calculate anchor node positions for side cards tracking
      if (anchorsRef.current.length > 0) {
        const positions: GlobeAnchorPosition[] = anchorsRef.current.map((anchor) => {
          const dist = geoDistance([anchor.lng, anchor.lat], [centerLng, centerLat]);
          const isFront = dist < Math.PI / 2 - 0.05; // front hemisphere check
          const projected = projection([anchor.lng, anchor.lat]);

          if (isFront && projected) {
            // Draw glowing anchor pulse node on globe canvas
            const [px, py] = projected;
            const nodeAlpha = Math.max(0.3, 1 - dist / (Math.PI / 2));

            context.beginPath();
            context.arc(px, py, 4 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = `rgba(122, 154, 255, ${nodeAlpha})`;
            context.shadowColor = "rgba(122, 154, 255, 0.9)";
            context.shadowBlur = 12;
            context.fill();
            context.shadowBlur = 0;

            context.beginPath();
            context.arc(px, py, 7 * scaleFactor, 0, 2 * Math.PI);
            context.strokeStyle = `rgba(168, 85, 247, ${nodeAlpha * 0.8})`;
            context.lineWidth = 1.5;
            context.stroke();

            return {
              id: anchor.id,
              x: px,
              y: py,
              visible: true,
              scaleFactor,
            };
          }

          return {
            id: anchor.id,
            x: containerWidth / 2,
            y: containerHeight / 2,
            visible: false,
            scaleFactor,
          };
        });

        if (onAnchorPositionsChangeRef.current) {
          onAnchorPositionsChangeRef.current(positions);
        }
      }
    };

    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat });
          });
        });

        render();
      } catch (err) {
        setError("Failed to load land map data");
      }
    };

    // Rotation & interaction physics
    const rotation: [number, number] = [0, -10];
    let autoRotate = true;
    const rotationSpeed = 0.35;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation);
        render();
      }
    };

    const rotationTimer = timer(rotate);

    let handleMouseDown: ((e: MouseEvent) => void) | null = null;
    let handleWheel: ((e: WheelEvent) => void) | null = null;

    if (interactive) {
      handleMouseDown = (event: MouseEvent) => {
        autoRotate = false;
        const startX = event.clientX;
        const startY = event.clientY;
        const startRotation = [...rotation];

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const sensitivity = 0.4;
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          rotation[0] = startRotation[0] + dx * sensitivity;
          rotation[1] = startRotation[1] - dy * sensitivity;
          rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

          projection.rotate(rotation);
          render();
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);

          setTimeout(() => {
            autoRotate = true;
          }, 100);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      };

      handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scaleFactor = event.deltaY > 0 ? 0.95 : 1.05;
        const newRadius = Math.max(
          radius * 0.6,
          Math.min(radius * 2.5, projection.scale() * scaleFactor)
        );
        projection.scale(newRadius);
        render();
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("wheel", handleWheel);
    }

    loadWorldData();

    return () => {
      rotationTimer.stop();
      if (interactive && handleMouseDown && handleWheel) {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [width, height, interactive]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-950 rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="text-rose-400 font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl bg-transparent"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      {interactive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] font-mono text-slate-400/80 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 backdrop-blur-md pointer-events-none select-none">
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
}
