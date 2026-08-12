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
      "Host and participate in national and international conferences, CTF competitions, bug bounty programs, cybersecurity hackathons, Faculty Development Programs (FDPs), and awareness campaigns to sharpen skills and build community.",
  },
  {
    icon: Target,
    title: "Promote Awareness & Foster Global Collaborations",
    detail:
      "Promote cybersecurity awareness among students, faculty, industry, and the community. Support startups and innovative cybersecurity solutions. Foster interdisciplinary research and international academic–industry partnerships.",
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
    <main className="pt-24 md:pt-32 pb-16">
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
                  className={`w-full glass rounded-xl px-6 py-5 flex items-center gap-4 text-left transition-all duration-300 group ${
                    isExpanded
                      ? "glow-violet"
                      : ""
                  }`}
                  style={{
                    border: isExpanded ? "1px solid rgba(155,127,255,0.35)" : "1px solid rgba(100,130,255,0.18)",
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? "bg-violet/10"
                        : "bg-cobalt/10 group-hover:bg-cobalt/20"
                    }`}
                  >
                    <obj.icon
                      className={`w-5 h-5 transition-colors ${
                        isExpanded ? "text-violet" : "text-cobalt"
                      }`}
                    />
                  </div>

                  <span className="font-heading font-semibold text-royal flex-1">
                    {obj.title}
                  </span>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-body/60" />
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
                        className="px-6 py-4 pl-20 text-body/80 leading-relaxed rounded-b-xl text-sm md:text-base"
                        style={{
                          background: "rgba(8, 12, 40, 0.60)",
                          border: "0 solid rgba(100,130,255,0.15)",
                          borderWidth: "0 1px 1px 1px",
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
