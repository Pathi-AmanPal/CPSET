"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ExternalLink,
  Shield,
  Users,
  Calendar,
  Trophy,
  Activity,
  Terminal,
  Sparkles
} from "lucide-react";

const RotatingEarth = dynamic(() => import("@/components/ui/wireframe-dotted-globe"), {
  ssr: false,
});

const stats = [
  { icon: Users,    value: "50+",  label: "Active Members"    },
  { icon: Shield,   value: "20+",  label: "Research Projects" },
  { icon: Calendar, value: "3",    label: "Events Conducted"  },
  { icon: Trophy,   value: "5+",   label: "Achievements"      },
];

export default function Hero() {
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

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden flex flex-col justify-between"
      style={{ perspective: "1200px" }}
    >
      {/* ── Ultra-Wide Split Layout: Content Flush Left + Globe Flush Right ── */}
      <div className="relative z-10 flex-1 flex items-center min-h-screen px-4 sm:px-10 md:px-16 lg:px-20 xl:px-24 pt-24 pb-28">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 xl:gap-36 items-center">

          {/* ── LEFT: Text Content (Pushed All The Way Left) ── */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left max-w-2xl">
            {/* CPSET Glowing Logo Emblem */}
            <motion.div
              className="mb-6 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="relative w-20 h-20 rounded-full p-1 transition-transform hover:scale-105 duration-300"
                style={{
                  background: "radial-gradient(circle, rgba(90,138,255,0.35) 0%, rgba(155,127,255,0.2) 70%, transparent 100%)",
                  boxShadow: "0 0 30px rgba(90,138,255,0.35), 0 0 10px rgba(155,127,255,0.2)",
                  border: "1px solid rgba(140,180,255,0.35)",
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

            {/* Fixed Main Headline — Dialogue 1 */}
            <motion.h1
              className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] text-white tracking-tight leading-[1.12] mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Centre for Privacy and Security in Emerging Technologies
            </motion.h1>

            {/* Motto Line */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-5 flex items-center gap-2 text-cyan-300 font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Securing Privacy. Empowering Innovation. Protecting the Future.</span>
            </motion.p>

            {/* Dialogue 3 & Expanded Description Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-xl text-slate-300 font-sans text-sm sm:text-base mb-8 leading-relaxed space-y-2"
            >
              <p className="font-semibold text-purple-200 font-mono text-sm sm:text-base">
                Chandigarh University&apos;s Cybersecurity Centre of Excellence
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                A specialized academic & research hub dedicated to pioneering zero-knowledge proofs, network forensics, steganography, AI security, cloud privacy engineering, and empowering the next generation of cybersecurity leaders.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                href="/vision-mission"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-mono text-sm font-medium text-slate-200 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Explore Matrix</span>
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Globe (Medium Balanced Size) ── */}
          <motion.div
            style={{
              scale: globeScale,
              rotateX: globeRotateX,
              z: globeZ,
              opacity: globeOpacity,
              transformStyle: "preserve-3d",
            }}
            className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-[500px] sm:max-w-[560px] lg:max-w-[600px] aspect-square flex items-center justify-center">
              <RotatingEarth
                width={600}
                height={600}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Metrics Ticker Bar ── */}
      <div className="relative z-20 py-5 px-4 sm:px-10 bg-black/50 border-t border-[#5A8AFF]/15 backdrop-blur-md">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5A8AFF]/10 border border-[#5A8AFF]/30 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <div className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                    {st.value}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {st.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
