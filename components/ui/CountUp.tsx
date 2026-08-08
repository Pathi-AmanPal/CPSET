"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),
        1
      );

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}
