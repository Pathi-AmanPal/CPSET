"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import DecryptedText from "@/components/ui/DecryptedText";
import {
  ChevronDown,
  Brain,
  Code,
  Lock,
  Globe,
  Layers,
  Handshake,
  Lightbulb,
  Shield,
  Rocket,
  Terminal
} from "lucide-react";

const objectives = [
  {
    icon: Brain,
    title: "Develop Cybersecurity Talent Through Practical Learning",
    category: "Talent & Labs",
    detail:
      "Build industry-ready cybersecurity professionals through research-driven curricula, advanced laboratories, workshops, hands-on training modules, and real-world security challenges.",
  },
  {
    icon: Code,
    title: "Conduct Cutting-Edge Research in Emerging Technologies",
    category: "Research",
    detail:
      "Drive pioneering research across network security, cloud security, AI for cybersecurity, privacy engineering, digital forensics, malware analysis, threat intelligence, and blockchain security.",
  },
  {
    icon: Lock,
    title: "Establish Advanced Cybersecurity Laboratories",
    category: "Infrastructure",
    detail:
      "Build and maintain specialized labs for ethical hacking, penetration testing, digital forensics, cyber drills, and cyber ranges — providing students and researchers access to professional-grade tools.",
  },
  {
    icon: Globe,
    title: "Facilitate Globally Recognized Certification Programs",
    category: "Certifications",
    detail:
      "Partner with leading certification bodies including Cisco, Microsoft, and EC-Council to offer internationally recognized programs that enhance student employability.",
  },
  {
    icon: Layers,
    title: "Organize Seminars, Workshops, Hackathons & CTF Competitions",
    category: "Events & CTFs",
    detail:
      "Host and participate in national and international conferences, Capture the Flag (CTF) competitions, bug bounty programs, cybersecurity hackathons, and FDPs.",
  },
  {
    icon: Shield,
    title: "Promote Cybersecurity Awareness Across Communities",
    category: "Awareness",
    detail:
      "Promote cybersecurity awareness among students, faculty, industry, and the community to build digital resilience and foster a culture of privacy and security.",
  },
  {
    icon: Rocket,
    title: "Support Startups & Innovative Cybersecurity Solutions",
    category: "Incubation",
    detail:
      "Nurture student innovation projects, support cybersecurity product development, provide mentorship, and incubate cutting-edge security startups.",
  },
  {
    icon: Handshake,
    title: "Foster Interdisciplinary Research & Global Collaborations",
    category: "Partnerships",
    detail:
      "Build strong academia–industry partnerships, foster cross-disciplinary research initiatives, and establish international academic and research collaborations.",
  },
];

const pillars = [
  { icon: Handshake, label: "Collaborate", tag: "Global Academia & Industry" },
  { icon: Lightbulb, label: "Innovate", tag: "AI & Zero Knowledge" },
  { icon: Shield, label: "Secure", tag: "Threat Intelligence & Defense" },
  { icon: Rocket, label: "Empower", tag: "Skill Labs & CTF Drills" },
];

export default function ObjectivesList() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AnimatedText
          text="Strategic Objectives & Pillars"
          as="h2"
          className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight"
          gradient
        />
      </motion.div>

      {/* Expandable objectives list */}
      <motion.div
        className="max-w-4xl mx-auto space-y-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {objectives.map((obj, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <motion.div key={obj.title} variants={staggerItem}>
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={`w-full rounded-2xl px-6 py-5 flex items-center gap-4 text-left transition-all duration-300 group relative overflow-hidden ${
                  isExpanded
                    ? "bg-[#0B102B] border-[#5A8AFF]/50 shadow-[0_0_35px_rgba(90,138,255,0.25)]"
                    : "bg-[#080B1E]/90 border-white/10 hover:border-[#5A8AFF]/40 hover:bg-[#0A0E26]"
                } border backdrop-blur-xl`}
              >
                {/* Active glow accent indicator bar */}
                {isExpanded && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_12px_rgba(90,138,255,0.8)]" />
                )}

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded
                      ? "bg-[#5A8AFF]/20 border border-[#5A8AFF]/50 text-cyan-300 shadow-[0_0_15px_rgba(90,138,255,0.3)]"
                      : "bg-white/5 border border-white/10 text-slate-400 group-hover:text-cyan-300 group-hover:bg-[#5A8AFF]/10"
                  }`}
                >
                  <obj.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300/80">
                      //{obj.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-white text-base sm:text-lg leading-snug">
                    <DecryptedText
                      text={obj.title}
                      animateOn="hover"
                      speed={45}
                      maxIterations={4}
                      className="text-white"
                      encryptedClassName="text-cyan-300 font-mono opacity-80"
                    />
                  </h3>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 p-1.5 rounded-lg bg-black/30 border border-white/10 text-slate-400"
                >
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-6 py-5 sm:pl-20 text-slate-300 leading-relaxed rounded-b-2xl text-sm font-sans bg-[#060918]/90 border border-white/10 border-t-0 -mt-2"
                    >
                      <DecryptedText
                        text={obj.detail}
                        animateOn="view"
                        speed={40}
                        maxIterations={4}
                        className="text-slate-300"
                        encryptedClassName="text-cyan-300 font-mono opacity-80"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Strategic Pillars grid */}
      <motion.div
        className="mt-20 pt-12 border-t border-white/10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#090D24]/80 border border-white/10 hover:border-[#5A8AFF]/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[#5A8AFF]/10 border border-[#5A8AFF]/30 text-cyan-300 group-hover:scale-110 group-hover:bg-[#5A8AFF]/20 transition-all"
              >
                <pillar.icon className="w-6 h-6 text-cyan-300" />
              </div>
              <span className="font-heading font-extrabold text-base text-white mb-1">
                {pillar.label}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {pillar.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
