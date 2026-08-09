"use client";

import { motion } from "framer-motion";
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
import Link from "next/link";

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
  { icon: Users,    value: "500+", label: "Active Members"    },
  { icon: Shield,   value: "20+",  label: "Research Projects" },
  { icon: Calendar, value: "15+",  label: "Events Every Year" },
  { icon: Trophy,   value: "10+",  label: "Achievements"      },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F5F3FF 0%, #EEF2FF 40%, #F8F7FF 100%)" }}
    >
      {/* ── Full-bleed globe background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <WireframeGlobe
          diameter={680}
          speed={0.0018}
          maxTilt={0.28}
          className="w-full h-full"
        />
      </div>

      {/* ── Left floating cards ── */}
      <div className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-5">
        {leftCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
          >
            {/* Card */}
            <div className="bg-white/90 backdrop-blur-md border border-violet-100 rounded-2xl shadow-lg shadow-violet-100/50 px-4 py-3 flex items-start gap-3 w-52">
              <div className="mt-0.5 p-2 rounded-xl bg-violet-50 border border-violet-100 shrink-0">
                <card.icon className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-slate-800 leading-tight mb-1">{card.title}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{card.desc}</p>
              </div>
            </div>
            {/* Connector line + dot */}
            <div className="flex items-center gap-1">
              <div className="h-px w-6 bg-violet-300/60" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(139,92,246,0.5) 0px, rgba(139,92,246,0.5) 4px, transparent 4px, transparent 8px)" }} />
              <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.7)]" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Right floating cards ── */}
      <div className="absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-5">
        {rightCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
          >
            {/* Connector dot + line */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.7)]" />
              <div className="h-px w-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(139,92,246,0.5) 0px, rgba(139,92,246,0.5) 4px, transparent 4px, transparent 8px)" }} />
            </div>
            {/* Card */}
            <div className="bg-white/90 backdrop-blur-md border border-violet-100 rounded-2xl shadow-lg shadow-violet-100/50 px-4 py-3 flex items-start gap-3 w-52">
              <div className="mt-0.5 p-2 rounded-xl bg-violet-50 border border-violet-100 shrink-0">
                <card.icon className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-slate-800 leading-tight mb-1">{card.title}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{card.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Center overlay content (on top of globe) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20 pb-24">

        {/* Shield icon above label */}
        <motion.div
          className="mb-3 p-3 rounded-2xl bg-violet-600/10 border border-violet-300/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="w-6 h-6 text-violet-600" strokeWidth={1.5} />
        </motion.div>

        {/* Institution label */}
        <motion.p
          className="text-violet-600 font-semibold text-xs uppercase tracking-[0.3em] mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Chandigarh University
        </motion.p>

        {/* Headline — hard line breaks, large bold */}
        <motion.h1
          className="font-heading font-extrabold leading-tight mb-5 max-w-[560px]"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #7c3aed 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Centre for Privacy and<br />
          Security in Emerging<br />
          Technologies
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-slate-500 text-base max-w-xs mb-9 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Empowering the next generation of<br />cybersecurity professionals
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link
            href="#connect"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            Become a Member
            <ExternalLink className="w-4 h-4" />
          </Link>

          <Link
            href="#vision-mission"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-violet-200 text-violet-700 font-semibold text-sm shadow-sm hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore
            <ArrowDown className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* ── Stats strip pinned to bottom ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 py-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center divide-x divide-slate-200/80">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-6 sm:px-12">
              <div className="flex items-center gap-2 mb-0.5">
                <stat.icon className="w-4 h-4 text-violet-500" strokeWidth={1.5} />
                <span className="font-extrabold text-xl text-slate-800">{stat.value}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
