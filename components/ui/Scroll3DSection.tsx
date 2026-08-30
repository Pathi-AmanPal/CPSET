"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Scroll3DSectionProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max translateZ depth in px
  maxRotateX?: number; // max tilt in degrees
}

export default function Scroll3DSection({
  children,
  className = "",
  depth = 120,
  maxRotateX = 18,
}: Scroll3DSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position relative to this section entering and exiting viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Apply physics spring for 60fps butter-smooth rendering without lag
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
    mass: 0.4,
  });

  // 3D Perspective Transforms
  // Entering: rotateX tilts towards viewer (positive deg), scale builds from 0.92, translateZ comes forward
  // Center: rotateX: 0deg, scale: 1.0, translateZ: 0px
  // Exiting: rotateX tilts away (negative deg), scale recedes slightly
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [maxRotateX, 0, 0, -maxRotateX * 0.6]
  );

  const scale = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [0.92, 1, 1, 0.95]
  );

  const opacity = useTransform(
    smoothProgress,
    [0, 0.25, 0.75, 1],
    [0.35, 1, 1, 0.4]
  );

  const translateZ = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [-depth, 0, 0, -depth * 0.7]
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          z: translateZ,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
        className="w-full transition-shadow duration-700"
      >
        {children}
      </motion.div>
    </div>
  );
}
