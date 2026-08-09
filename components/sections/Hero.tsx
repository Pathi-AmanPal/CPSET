"use client";

import { motion } from "framer-motion";
import { ShinyText } from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import WireframeGlobe from "@/components/3d/WireframeGlobe";
import {
  ArrowDown,
  ExternalLink,
  Lock,
  Shield,
  Cpu,
  Network,
  Lightbulb,
  Star,
  Users,
  BookOpen,
  Calendar,
  Trophy,
} from "lucide-react";

const leftCards = [
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Advancing privacy-preserving technologies and research.",
  },
  {
    icon: Shield,
    title: "Cyber Security",
    desc: "Securing systems, networks and digital infrastructures.",
  },
  {
    icon: Cpu,
    title: "Emerging Tech",
    desc: "Exploring AI, IoT, Blockchain and beyond.",
  },
];

const rightCards = [
  {
    icon: Network,
    title: "Expert Network",
    desc: "Collaborating with experts and industry leaders.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Driving innovation for a safer digital future.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "Building a culture of excellence in cybersecurity.",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Active Members" },
  { icon: BookOpen, value: "20+", label: "Research Projects" },
  { icon: Calendar, value: "15+", label: "Events Every Year" },
  { icon: Trophy, value: "10+", label: "Achievements" },
];

// Vertical positions for the 3 nodes on each side (as % of globe height)
const nodeYPositions = [0.2, 0.5, 0.8];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[68px]"
    >
      {/* Globe — fills section, pointer-events disabled on canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <WireframeGlobe diameter={530} speed={0.0018} maxTilt={0.28} />
      </div>

      {/* ─── Main three-column layout ─── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex items-center justify-between gap-4 py-10">

        {/* LEFT CARDS */}
        <div className="hidden lg:flex flex-col gap-4 w-44 shrink-0">
          {leftCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            >
              {/* Connector line: runs from right edge of card toward globe */}
              <div
                className="absolute top-1/2 -translate-y-1/2 right-0 pointer-events-none"
                style={{ width: "calc(100% + 60px)", left: "100%" }}
              >
                <svg width="64" height="2" className="overflow-visible">
                  <line x1="0" y1="1" x2="52" y2="1" stroke="rgba(100,60,230,0.35)" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Dot at globe end */}
                  <circle cx="56" cy="1" r="3" fill="rgba(100,60,230,0.7)" />
                </svg>
              </div>

              {/* Card */}
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-md px-3 py-2.5 flex items-start gap-2 min-h-[68px]">
                <div className="mt-0.5 p-1.5 rounded-md bg-cobalt/8 shrink-0">
                  <card.icon className="w-3.5 h-3.5 text-cobalt" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[12px] text-royal leading-tight">{card.title}</p>
                  <p className="text-[10px] text-body/60 leading-snug mt-0.5">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CENTER — Headline + subtext + buttons */}
        <div className="flex-1 flex flex-col items-center text-center min-w-0 px-2">
          <motion.p
            className="text-cobalt font-heading font-semibold text-xs uppercase tracking-[0.3em] mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Chandigarh University
          </motion.p>

          {/* Fixed 3-line headline — hard br locks prevent 4-line reflow */}
          <motion.h1
            className="font-heading font-bold text-[2.6rem] md:text-[3rem] text-royal leading-tight mb-5 max-w-[480px]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Centre for Privacy and<br />
            Security in Emerging<br />
            Technologies
          </motion.h1>

          <motion.p
            className="text-body/70 text-sm md:text-base max-w-sm mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ShinyText>
              Empowering the next generation of<br />
              cybersecurity professionals
            </ShinyText>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlowButton href="#connect" variant="primary" size="lg">
              Become a Member
              <ExternalLink className="w-4 h-4" />
            </GlowButton>

            <GlowButton href="#vision-mission" variant="secondary" size="lg">
              Explore
              <ArrowDown className="w-4 h-4" />
            </GlowButton>
          </motion.div>
        </div>

        {/* RIGHT CARDS */}
        <div className="hidden lg:flex flex-col gap-4 w-44 shrink-0">
          {rightCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            >
              {/* Connector line: runs from left edge toward globe */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ right: "100%", width: "64px" }}
              >
                <svg width="64" height="2" className="overflow-visible">
                  {/* Dot at globe end */}
                  <circle cx="8" cy="1" r="3" fill="rgba(100,60,230,0.7)" />
                  <line x1="12" y1="1" x2="64" y2="1" stroke="rgba(100,60,230,0.35)" strokeWidth="1" strokeDasharray="3,3" />
                </svg>
              </div>

              {/* Card */}
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-md px-3 py-2.5 flex items-start gap-2 min-h-[68px]">
                <div className="mt-0.5 p-1.5 rounded-md bg-cobalt/8 shrink-0">
                  <card.icon className="w-3.5 h-3.5 text-cobalt" />
                </div>
                <div>
                  <p className="font-heading font-bold text-[12px] text-royal leading-tight">{card.title}</p>
                  <p className="text-[10px] text-body/60 leading-snug mt-0.5">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Stats strip ─── */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-4 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div className="flex items-center justify-center divide-x divide-slate-200">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-6 sm:px-10">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-cobalt/70" />
                <span className="font-heading font-bold text-xl text-royal">{stat.value}</span>
              </div>
              <span className="text-[11px] text-body/55 font-medium tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
