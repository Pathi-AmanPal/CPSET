"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface Scroll3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees on mouse move
  glare?: boolean;
}

export default function Scroll3DCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
}: Scroll3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position spring physics
  const rotateX = useSpring(0, { damping: 20, stiffness: 150 });
  const rotateY = useSpring(0, { damping: 20, stiffness: 150 });
  const glareX = useSpring(50, { damping: 20, stiffness: 150 });
  const glareY = useSpring(50, { damping: 20, stiffness: 150 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
    const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

    // Invert X rotation so moving mouse up tilts top towards camera
    rotateX.set(-mouseY * maxTilt);
    rotateY.set(mouseX * maxTilt);

    glareX.set(((e.clientX - rect.left) / width) * 100);
    glareY.set(((e.clientY - rect.top) / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          z: isHovered ? 25 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full h-full rounded-2xl overflow-hidden"
      >
        {children}

        {/* Dynamic 3D Glare reflection overlay */}
        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
            style={{
              opacity: isHovered ? 0.15 : 0,
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.8) 0%, rgba(120,160,255,0.3) 40%, transparent 80%)`,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
