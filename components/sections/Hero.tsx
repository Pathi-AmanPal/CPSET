"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import TextType from "@/components/ui/TextType";
import type { GlobeAnchor, GlobeAnchorPosition } from "@/components/ui/wireframe-dotted-globe";

const RotatingEarth = dynamic(() => import("@/components/ui/wireframe-dotted-globe"), {
  ssr: false,
});

const leftCards = [
  {
    id: "left-0",
    icon: Lock,
    title: "Privacy First",
    desc: "Advancing privacy engineering and privacy-preserving technologies.",
    lng: -80,
    lat: 35,
  },
  {
    id: "left-1",
    icon: Shield,
    title: "Cyber Security",
    desc: "Network, cloud, IoT, and secure software development.",
    lng: -50,
    lat: -15,
  },
  {
    id: "left-2",
    icon: Cpu,
    title: "Emerging Tech",
    desc: "AI security, blockchain, and digital forensics research.",
    lng: -15,
    lat: 12,
  },
];

const rightCards = [
  {
    id: "right-0",
    icon: Network,
    title: "Expert Network",
    desc: "Industry collaborations, internships, and global partnerships.",
    lng: 25,
    lat: 48,
  },
  {
    id: "right-1",
    icon: Lightbulb,
    title: "Innovation",
    desc: "Driving startups, research publications, and patents.",
    lng: 78,
    lat: 22,
  },
  {
    id: "right-2",
    icon: Star,
    title: "Excellence",
    desc: "Globally recognized certifications and cyber competitions.",
    lng: 135,
    lat: -25,
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

  const handleAnchorPositionsChange = useCallback((positions: GlobeAnchorPosition[]) => {
    const map: Record<string, GlobeAnchorPosition> = {};
    positions.forEach((p) => {
      map[p.id] = p;
    });
    setAnchorMap(map);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050914 0%, #070B1A 60%, #080D20 100%)" }}
    >
      {/* ── Central ambient glow ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(30,60,200,0.18) 0%, rgba(15,30,100,0.08) 50%, transparent 80%)",
        }}
      />

      {/* ── Rotating Dotted Globe Canvas background ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center">
        <RotatingEarth
          width={760}
          height={680}
          anchors={globeAnchors}
          onAnchorPositionsChange={handleAnchorPositionsChange}
          className="w-full max-w-4xl"
        />
      </div>

      {/* ── Left floating cards ── */}
      <div className="absolute left-4 xl:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-5">
        {leftCards.map((card, i) => {
          const anchor = anchorMap[card.id];
          const isVisible = anchor ? anchor.visible : true;

          return (
            <motion.div
              key={card.title}
              className="flex items-center gap-1 transition-all duration-500"
              initial={{ opacity: 0, x: -40 }}
              animate={{
                opacity: isVisible ? 1 : 0.15,
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
                className="backdrop-blur-md rounded-2xl px-4 py-3 flex items-start gap-3 w-52 transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                style={{
                  background: "rgba(15, 20, 50, 0.85)",
                  border: "1px solid rgba(120, 140, 255, 0.3)",
                  boxShadow: "0 0 20px rgba(80, 100, 255, 0.12), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="mt-0.5 p-2 rounded-xl shrink-0"
                  style={{
                    background: "rgba(100, 120, 255, 0.12)",
                    border: "1px solid rgba(100, 130, 255, 0.25)",
                  }}
                >
                  <card.icon className="w-4 h-4" style={{ color: "#8B9FFF" }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-[13px] leading-tight mb-1" style={{ color: "#F0F4FF" }}>{card.title}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "rgba(200, 205, 225, 0.70)" }}>{card.desc}</p>
                </div>
              </div>
              {/* Connector line + dot */}
              <div className="flex items-center gap-1">
                <div className="h-px w-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(120,150,255,0.5) 0px, rgba(120,150,255,0.5) 4px, transparent 4px, transparent 8px)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: isVisible ? "#8B9FFF" : "#4A5A88", boxShadow: isVisible ? "0 0 12px rgba(139,159,255,0.9), 0 0 4px rgba(139,159,255,1)" : "none" }} />
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
              className="flex items-center gap-1 transition-all duration-500"
              initial={{ opacity: 0, x: 40 }}
              animate={{
                opacity: isVisible ? 1 : 0.15,
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
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: isVisible ? "#8B9FFF" : "#4A5A88", boxShadow: isVisible ? "0 0 12px rgba(139,159,255,0.9), 0 0 4px rgba(139,159,255,1)" : "none" }} />
                <div className="h-px w-6" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(120,150,255,0.5) 0px, rgba(120,150,255,0.5) 4px, transparent 4px, transparent 8px)" }} />
              </div>
              {/* Card */}
              <div
                className="backdrop-blur-md rounded-2xl px-4 py-3 flex items-start gap-3 w-52 transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                style={{
                  background: "rgba(15, 20, 50, 0.85)",
                  border: "1px solid rgba(120, 140, 255, 0.3)",
                  boxShadow: "0 0 20px rgba(80, 100, 255, 0.12), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="mt-0.5 p-2 rounded-xl shrink-0"
                  style={{
                    background: "rgba(100, 120, 255, 0.12)",
                    border: "1px solid rgba(100, 130, 255, 0.25)",
                  }}
                >
                  <card.icon className="w-4 h-4" style={{ color: "#8B9FFF" }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-[13px] leading-tight mb-1" style={{ color: "#F0F4FF" }}>{card.title}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "rgba(200, 205, 225, 0.70)" }}>{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Center overlay content (on top of globe) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20 pb-24">

        {/* CPSET Logo above headline */}
        <motion.div
          className="mb-5 relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative w-24 h-24 mx-auto"
            style={{
              filter: "drop-shadow(0 0 18px rgba(90,138,255,0.50)) drop-shadow(0 0 8px rgba(130,80,255,0.35))",
            }}
          >
            <Image
              src="/logo.png"
              alt="CPSET Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Headline — dynamic typing effect */}
        <motion.div
          className="font-heading font-extrabold leading-tight mb-5 max-w-[650px] min-h-[140px] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <TextType
            as="h1"
            text={[
              "Centre for Privacy and Security in Emerging Technologies",
              "Securing Privacy. Empowering Innovation. Protecting Future.",
              "Chandigarh University Cybersecurity Center of Excellence",
            ]}
            typingSpeed={55}
            pauseDuration={2200}
            deletingSpeed={25}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
            className="gradient-text font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight"
            cursorClassName="text-indigo-400 text-3xl md:text-5xl font-mono"
            textColors={["#FFFFFF", "#E0E8FF", "#C4BBFF"]}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #5A6FE8)",
              boxShadow: "0 4px 24px rgba(120, 80, 240, 0.45), 0 0 0 1px rgba(140,100,255,0.2)",
            }}
          >
            Become a Member
            <ExternalLink className="w-4 h-4" />
          </a>

          <Link
            href="#vision-mission"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#E8ECFF",
              backdropFilter: "blur(8px)",
            }}
          >
            Explore
            <ArrowDown className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* ── Stats strip pinned to bottom ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 py-6 px-4"
        style={{
          background: "linear-gradient(to top, rgba(5,9,20,0.90) 0%, rgba(5,9,20,0.40) 100%)",
          borderTop: "1px solid rgba(100, 130, 255, 0.12)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center" style={{ borderColor: "rgba(100, 130, 255, 0.20)" }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-6 sm:px-12"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid rgba(100, 130, 255, 0.22)" : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <stat.icon className="w-4 h-4" style={{ color: "#7A9AFF" }} strokeWidth={1.5} />
                <span className="font-extrabold text-xl" style={{ color: "#FFFFFF" }}>{stat.value}</span>
              </div>
              <span className="text-[11px] font-medium tracking-wide" style={{ color: "#7A8BAA" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
