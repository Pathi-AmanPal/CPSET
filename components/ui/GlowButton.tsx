"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
}: GlowButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-heading font-semibold rounded-xl transition-all duration-300 overflow-hidden shadow-sm";

  const variants = {
    primary:
      "bg-cobalt text-white hover:bg-cobalt/90 hover:shadow-[0_4px_20px_rgba(0,71,171,0.3)]",
    secondary:
      "bg-white border border-cobalt/40 text-cobalt hover:border-cobalt hover:bg-cobalt/5 hover:shadow-[0_4px_20px_rgba(0,71,171,0.15)]",
    ghost:
      "bg-transparent text-body hover:text-royal hover:bg-slate-100 shadow-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-3 text-base gap-2",
    lg: "px-8 py-4 text-lg gap-2.5",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
