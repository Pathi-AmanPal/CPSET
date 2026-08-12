"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import {
  ChevronDown,
  Brain,
  Code,
  Lock,
  Globe,
  Layers,
  Target,
  Handshake,
  Lightbulb,
  Shield,
  Rocket,
} from "lucide-react";

const objectives = [
  {
    icon: Brain,
    title: "Develop Cybersecurity Talent Through Practical Learning",
    detail:
      "Build industry-ready cybersecurity professionals through research-driven curricula, advanced laboratories, workshops, hands-on training modules, and real-world security challenges that prepare students for the demands of the field.",
  },
  {
    icon: Code,
    title: "Conduct Cutting-Edge Research in Emerging Technologies",
    detail:
      "Drive pioneering research across network security, cloud security, AI for cybersecurity, privacy engineering, digital forensics, malware analysis, threat intelligence, and blockchain security — resulting in publications and patents.",
  },
  {
    icon: Lock,
    title: "Establish Advanced Cybersecurity Laboratories",
    detail:
      "Build and maintain specialized labs for ethical hacking, penetration testing, digital forensics, cyber drills, and cyber ranges — providing students and researchers access to professional-grade tools and environments.",
  },
  {
    icon: Globe,
    title: "Facilitate Globally Recognized Certification Programs",
    detail:
      "Partner with leading certification bodies including Cisco, Microsoft, and EC-Council to offer internationally recognized programs that enhance student employability and align academic training with industry standards.",
  },
  {
    icon: Layers,
    title: "Organize Seminars, Workshops, Hackathons & CTF Competitions",
    detail:
      "Host and participate in national and international conferences, Capture the Flag (CTF) competitions, bug bounty programs, cybersecurity hackathons, Faculty Development Programs (FDPs), and awareness campaigns.",
  },
  {
    icon: Shield,
    title: "Promote Cybersecurity Awareness Across Communities",
    detail:
      "Promote cybersecurity awareness among students, faculty, industry, and the community to build digital resilience and foster a culture of privacy and security.",
  },
  {
    icon: Rocket,
    title: "Support Startups & Innovative Cybersecurity Solutions",
    detail:
      "Nurture student innovation projects, support cybersecurity product development, provide mentorship, and incubate cutting-edge security startups.",
  },
  {
    icon: Handshake,
    title: "Foster Interdisciplinary Research & Global Collaborations",
    detail:
      "Build strong academia–industry partnerships, foster cross-disciplinary research initiatives, and establish international academic and research collaborations.",
  },
];

const pillars = [
  { icon: Handshake, label: "Collaborate" },
  { icon: Lightbulb, label: "Innovate" },
  { icon: Shield, label: "Secure" },
  { icon: Rocket, label: "Empower" },
];

export default function ObjectivesPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <main className="pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-cobalt font-heading text-sm uppercase tracking-[0.3em] font-semibold mb-4">
            Our Objectives
          </p>
          <AnimatedText
            text="What We Aim To Achieve"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
        </motion.div>

        {/* Expandable objectives list */}
        <motion.div
          className="max-w-3xl mx-auto space-y-3"
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
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : index)
                  }
                  className={`w-full rounded-xl px-6 py-5 flex items-center gap-4 text-left transition-all duration-300 group ${
                    isExpanded
                      ? "shadow-[0_0_25px_rgba(155,127,255,0.30)]"
                      : "hover:border-cobalt/40"
                  }`}
                  style={{
                    background: "rgba(13, 18, 48, 0.90)",
                    border: isExpanded ? "1px solid rgba(155,127,255,0.50)" : "1px solid rgba(100,130,255,0.22)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? "bg-purple-500/20 border border-purple-400/50"
                        : "bg-blue-500/15 border border-blue-400/30 group-hover:bg-blue-500/25"
                    }`}
                  >
                    <obj.icon
                      className={`w-5 h-5 transition-colors ${
                        isExpanded ? "text-purple-300" : "text-blue-400"
                      }`}
                    />
                  </div>

                  <span className="font-heading font-bold text-white text-base md:text-lg flex-1">
                    {obj.title}
                  </span>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-blue-300" />
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
                        className="px-6 py-5 pl-20 text-slate-200 leading-relaxed rounded-b-xl text-sm md:text-base font-normal"
                        style={{
                          background: "rgba(8, 12, 35, 0.85)",
                          border: "1px solid rgba(100,130,255,0.25)",
                          borderTop: "none",
                        }}
                      >
                        {obj.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pillars strip */}
        <motion.div
          className="mt-24 py-12"
          style={{ borderTop: "1px solid rgba(100, 130, 255, 0.18)" }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                className="flex flex-col items-center gap-3 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: "rgba(90,138,255,0.08)", border: "1px solid rgba(90,138,255,0.22)" }}
                >
                  <pillar.icon className="w-6 h-6 text-cobalt group-hover:text-violet transition-colors" />
                </div>
                <span className="font-heading font-medium text-sm text-body/80 group-hover:text-cobalt transition-colors">
                  {pillar.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
