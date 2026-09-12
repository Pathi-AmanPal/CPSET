"use client";

import Hero from "@/components/sections/Hero";
import IntroStrip from "@/components/sections/IntroStrip";
import WordStrip from "@/components/sections/WordStrip";
import TerminalCard from "@/components/ui/TerminalCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import {
  Compass,
  Target,
  Users,
  Calendar,
  Trophy,
  Mail,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Cpu
} from "lucide-react";

const sectionPillars = [
  {
    title: "Vision & Mission",
    href: "/vision-mission",
    description: "Explore our strategic vision, mission pillars, and commitment to global cybersecurity leadership.",
    icon: Compass,
    tag: "STRATEGY // PILLAR 01",
    color: "from-cyan-500/20 via-blue-500/10 to-transparent",
    border: "border-cyan-500/30",
    accent: "text-cyan-400",
  },
  {
    title: "Strategic Objectives",
    href: "/objectives",
    description: "Advanced cybersecurity labs, cyber ranges, AI security research, and industry-ready certifications.",
    icon: Target,
    tag: "MATRIX // PILLAR 02",
    color: "from-violet-500/20 via-purple-500/10 to-transparent",
    border: "border-violet-500/30",
    accent: "text-violet-400",
  },
  {
    title: "Investigation Board & Team",
    href: "/team",
    description: "Meet faculty mentors, research leads, technical engineers, and student threat operations leads.",
    icon: Users,
    tag: "OPERATIVES // PILLAR 03",
    color: "from-blue-500/20 via-indigo-500/10 to-transparent",
    border: "border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    title: "Events & Timeline",
    href: "/events",
    description: "National cybersecurity summits, FDPs, CTF range drills, hackathons, and guest expert lectures.",
    icon: Calendar,
    tag: "CHRONICLE // PILLAR 04",
    color: "from-purple-500/20 via-pink-500/10 to-transparent",
    border: "border-purple-500/30",
    accent: "text-purple-400",
  },
  {
    title: "Milestones & Recognition",
    href: "/achievements",
    description: "Pioneering research publications, patents, national CTF victories, and institutional honors.",
    icon: Trophy,
    tag: "HONORS // PILLAR 05",
    color: "from-amber-500/20 via-yellow-500/10 to-transparent",
    border: "border-amber-500/30",
    accent: "text-amber-400",
  },
  {
    title: "Connect & Operations",
    href: "/connect",
    description: "Join CPSET, initiate academia–industry partnerships, or submit research project proposals.",
    icon: Mail,
    tag: "NETWORK // PILLAR 06",
    color: "from-emerald-500/20 via-teal-500/10 to-transparent",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Intro Metrics & Tech Ticker */}
      <IntroStrip />
      <WordStrip />

      {/* Section Hub Grid: Dedicated Pillar Pages */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4">
            Explore CPSET Divisions
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-sans">
            Select a division below to dive deep into our research matrix, team board, active events, and global initiatives.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sectionPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <motion.div key={pillar.href} variants={fadeInUp} className="h-full">
                <Link href={pillar.href} className="block h-full">
                  <TerminalCard
                    tabTitle={`Administrator: PowerShell — ${pillar.title}`}
                    path={`PS D:\\CPSET\\Node\\${pillar.title.replace(/[^a-zA-Z]/g, "")}>`}
                    showPrompt={true}
                    className="h-full"
                  >
                    {/* Top Bar: Icon + Tag */}
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 border ${pillar.border} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${pillar.accent}`} />
                      </div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 group-hover:text-cyan-300 transition-colors">
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-white group-hover:text-cyan-200 transition-colors mb-3 flex items-center justify-between">
                          <span>{pillar.title}</span>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                          {pillar.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-cyan-400 group-hover:text-cyan-300 font-medium">
                        <span>Access Division Page</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </TerminalCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
