"use client";

import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  gradient?: boolean;
  delay?: number;
}

export default function AnimatedText({
  text,
  as: Tag = "h2",
  className = "",
  gradient = false,
  delay = 0,
}: AnimatedTextProps) {
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={`${gradient ? "gradient-text" : ""} ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {text}
    </MotionTag>
  );
}

// Shiny text variant — single line with gradient sweep
export function ShinyText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        background:
          "linear-gradient(90deg, #334155 0%, #8B00FF 45%, #0047AB 55%, #334155 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "shiny-sweep 3s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}
