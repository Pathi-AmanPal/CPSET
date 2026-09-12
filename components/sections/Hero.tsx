"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  Calendar,
  Trophy,
  Activity,
  Terminal
} from "lucide-react";
import TextType from "@/components/ui/TextType";
import type { GlobeAnchor, GlobeAnchorPosition } from "@/components/ui/wireframe-dotted-globe";

const RotatingEarth = dynamic(() => import("@/components/ui/wireframe-dotted-globe"), {
  ssr: false,
});

const leftCards = [
  {
    id: "left-0",
    title: "AI Security & Forensics",
    desc: "Next-Gen Security Engineering",
    icon: Shield,
    lng: -74.006,
    lat: 40.7128,
  },
  {
    id: "left-1",
    title: "Chandigarh University",
    desc: "AIT CSE Centre of Excellence",
    icon: Cpu,
    lng: 76.5746,
    lat: 30.7688,
  },
  {
    id: "left-2",
    title: "Privacy Engineering",
    desc: "Zero-Knowledge & Sovereignty",
    icon: Lock,
    lng: 2.3522,
    lat: 48.8566,
  },
];

const rightCards = [
  {
    id: "right-0",
    title: "Global Cyber Research",
    desc: "IoT, Cloud & Cryptography",
    icon: Network,
    lng: 139.6917,
    lat: 35.6895,
  },
  {
    id: "right-1",
    title: "Innovation Hub",
    desc: "Mentorship & Hands-on Labs",
    icon: Lightbulb,
    lng: 103.8198,
    lat: 1.3521,
  },
  {
    id: "right-2",
    title: "CTF & Cyber Drills",
    desc: "Competitive Ethical Hacking",
    icon: Star,
    lng: -0.1276,
    lat: 51.5074,
  },
];

const globeAnchors: GlobeAnchor[] = [
  ...leftCards.map((c) => ({ id: c.id, lng: c.lng, lat: c.lat })),
  ...rightCards.map((c) => ({ id: c.id, lng: c.lng, lat: c.lat })),
];

const stats = [
  { icon: Users,    value: "50+",  label: "Active Members"    },
  { icon: Shield,   value: "20+",  label: "Research Projects" },
  { icon: Calendar, value: "3",    label: "Events Conducted"  },
  { icon: Trophy,   value: "5+",   label: "Achievements"      },
];

export default function Hero() {
  const [anchorMap, setAnchorMap] = useState<Record<string, GlobeAnchorPosition>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
    mass: 0.4,
  });

  const globeScale = useTransform(smoothProgress, [0, 1], [1, 0.75]);
  const globeRotateX = useTransform(smoothProgress, [0, 1], [0, 32]);
  const globeZ = useTransform(smoothProgress, [0, 1], [0, -280]);
  const globeOpacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.6, 0.1]);

  const handleAnchorPositionsChange = useCallback((positions: GlobeAnchorPosition[]) => {
    const map: Record<string, GlobeAnchorPosition> = {};
    positions.forEach((p) => {
      map[p.id] = p;
    });
    setAnchorMap(map);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col justify-between"
      style={{
        background: "linear-gradient(160deg, #050814 0%, #080D22 50%, #050814 100%)",
        perspective: "1200px",
      }}
    >
      {/* ── Central ambient radial glows ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(90,138,255,0.22) 0%, rgba(155,127,255,0.12) 45%, transparent 75%)",
        }}
      />

      {/* ── Rotating Dotted Globe Canvas background with 3D Scroll transform ── */}
      <motion.div
        style={{
          scale: globeScale,
          rotateX: globeRotateX,
          z: globeZ,
          opacity: globeOpacity,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center"
      >
        <RotatingEarth
          width={780}
          height={700}
          anchors={globeAnchors}
          onAnchorPositionsChange={handleAnchorPositionsChange}
          className="w-full max-w-4xl"
        />
      </motion.div>

      {/* ── Left floating cards ── */}
      <div className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-5">
        {leftCards.map((card, i) => {
          const anchor = anchorMap[card.id];
          const isVisible = anchor ? anchor.visible : true;

          return (
            <motion.div
              key={card.title}
              className="flex items-center gap-2 transition-all duration-500"
              initial={{ opacity: 0, x: -40 }}
              animate={{
                opacity: isVisible ? 1 : 0.18,
                scale: isVisible ? 1 : 0.9,
                x: 0,
              }}
              style={{
                pointerEvents: isVisible ? "auto" : "none",
                filter: isVisible ? "none" : "blur(2px)",
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Card */}
              <div
                className="backdrop-blur-xl rounded-2xl p-3.5 flex items-start gap-3 w-56 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(90,138,255,0.3)] group"
                style={{
                  background: "rgba(10, 14, 34, 0.82)",
                  border: "1px solid rgba(90, 138, 255, 0.22)",
                  boxShadow: "0 8px 32px rgba(0, 5, 30, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    background: "rgba(90, 138, 255, 0.15)",
                    border: "1px solid rgba(90, 138, 255, 0.3)",
                  }}
                >
                  <card.icon className="w-4 h-4 text-cyan-300" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-bold text-[13px] text-white leading-tight mb-1 font-sans">{card.title}</p>
                  <p className="text-[11px] text-slate-400 leading-snug font-mono">{card.desc}</p>
                </div>
              </div>

              {/* Connector line + dot */}
              <div className="flex items-center gap-1">
                <div className="h-px w-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(90,138,255,0.6) 0px, rgba(90,138,255,0.6) 4px, transparent 4px, transparent 8px)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: isVisible ? "#5A8AFF" : "#334155", boxShadow: isVisible ? "0 0 12px rgba(90,138,255,1)" : "none" }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Right floating cards ── */}
      <div className="absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-5">
        {rightCards.map((card, i) => {
          const anchor = anchorMap[card.id];
          const isVisible = anchor ? anchor.visible : true;

          return (
            <motion.div
              key={card.title}
              className="flex items-center gap-2 transition-all duration-500"
              initial={{ opacity: 0, x: 40 }}
              animate={{
                opacity: isVisible ? 1 : 0.18,
                scale: isVisible ? 1 : 0.9,
                x: 0,
              }}
              style={{
                pointerEvents: isVisible ? "auto" : "none",
                filter: isVisible ? "none" : "blur(2px)",
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Connector dot + line */}
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: isVisible ? "#9B7FFF" : "#334155", boxShadow: isVisible ? "0 0 12px rgba(155,127,255,1)" : "none" }} />
                <div className="h-px w-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(155,127,255,0.6) 0px, rgba(155,127,255,0.6) 4px, transparent 4px, transparent 8px)" }} />
              </div>

              {/* Card */}
              <div
                className="backdrop-blur-xl rounded-2xl p-3.5 flex items-start gap-3 w-56 transition-all duration-300 hover:border-violet-400/60 hover:shadow-[0_0_25px_rgba(155,127,255,0.3)] group"
                style={{
                  background: "rgba(10, 14, 34, 0.82)",
                  border: "1px solid rgba(155, 127, 255, 0.22)",
                  boxShadow: "0 8px 32px rgba(0, 5, 30, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    background: "rgba(155, 127, 255, 0.15)",
                    border: "1px solid rgba(155, 127, 255, 0.3)",
                  }}
                >
                  <card.icon className="w-4 h-4 text-violet-300" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-bold text-[13px] text-white leading-tight mb-1 font-sans">{card.title}</p>
                  <p className="text-[11px] text-slate-400 leading-snug font-mono">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Center Hero Main Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-24 pb-28">

        {/* Operational Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#5A8AFF]/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(90,138,255,0.2)] backdrop-blur-md"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>LIVE // CPSET CORE NODE — CHANDIGARH UNIVERSITY</span>
        </motion.div>

        {/* CPSET Glowing Logo Emblem */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            className="relative w-28 h-28 mx-auto rounded-full p-1 transition-transform hover:scale-105 duration-300"
            style={{
              background: "radial-gradient(circle, rgba(90,138,255,0.4) 0%, rgba(155,127,255,0.25) 70%, transparent 100%)",
              boxShadow: "0 0 40px rgba(90,138,255,0.45), 0 0 15px rgba(155,127,255,0.3)",
              border: "1px solid rgba(140,180,255,0.4)",
            }}
          >
            <Image
              src="/logo.png"
              alt="CPSET Logo"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
        </motion.div>

        {/* Dynamic Typing Headline */}
        <motion.div
          className="font-heading font-extrabold leading-tight mb-6 max-w-3xl min-h-[130px] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <TextType
            as="h1"
            text={[
              "Centre for Privacy and Security in Emerging Technologies",
              "Securing Privacy. Empowering Innovation. Protecting Future.",
              "Chandigarh University Cybersecurity Center of Excellence",
            ]}
            typingSpeed={50}
            pauseDuration={2200}
            deletingSpeed={25}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            className="gradient-text font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
            cursorClassName="text-cyan-400 text-3xl md:text-5xl font-mono"
            textColors={["#FFFFFF", "#E0E8FF", "#C4BBFF"]}
          />
        </motion.div>

        {/* Subtitle tag */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl text-slate-300 font-sans text-sm sm:text-base mb-8 leading-relaxed"
        >
          Advancing cyber research, zero-knowledge proofs, network forensics, steganography, and privacy-preserving emerging technologies.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-white font-mono text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_30px_rgba(90,138,255,0.45)]"
            style={{
              background: "linear-gradient(135deg, #3B6ADB 0%, #7C5FE0 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span>./join --cpset</span>
            <ExternalLink className="w-4 h-4 text-cyan-200" />
          </a>

          <Link
            href="#vision-mission"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-mono text-sm font-medium text-slate-200 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Explore Matrix</span>
            <ArrowDown className="w-4 h-4 text-slate-400" />
          </Link>
        </motion.div>
      </div>

      {/* ── Stats Strip Pinned to Bottom ── */}
      <motion.div
        className="relative z-20 py-5 px-4 bg-black/60 border-t border-[#5A8AFF]/20 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center p-2 ${
                i < stats.length - 1 ? "md:border-r md:border-white/10" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                <span className="font-extrabold text-2xl text-white tracking-tight">{stat.value}</span>
              </div>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

