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
    title: "Advance Cybersecurity Knowledge",
    detail:
      "Push the boundaries of cybersecurity education through research-driven curricula, workshops, and hands-on training modules that prepare students for real-world security challenges.",
  },
  {
    icon: Code,
    title: "Develop Security Tools & Frameworks",
    detail:
      "Design, build, and open-source innovative security tools, vulnerability scanners, and privacy-preserving frameworks that contribute to the broader cybersecurity ecosystem.",
  },
  {
    icon: Lock,
    title: "Promote Privacy-First Design",
    detail:
      "Champion privacy-by-design principles in emerging technologies including IoT, AI/ML systems, and blockchain platforms through research papers and practical implementations.",
  },
  {
    icon: Globe,
    title: "Build Industry Partnerships",
    detail:
      "Establish strategic collaborations with leading cybersecurity firms, government agencies, and international research organizations to create internship and mentorship pathways.",
  },
  {
    icon: Layers,
    title: "Conduct Capture-The-Flag Competitions",
    detail:
      "Organize and participate in CTF competitions, bug bounty programs, and cybersecurity hackathons that sharpen offensive and defensive security skills.",
  },
  {
    icon: Target,
    title: "Drive Responsible Disclosure",
    detail:
      "Establish a culture of ethical hacking and responsible vulnerability disclosure, training members in proper disclosure protocols and coordination with affected parties.",
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
                  className={`w-full glass rounded-xl px-6 py-5 flex items-center gap-4 text-left transition-all duration-300 group border border-slate-200 shadow-sm ${
                    isExpanded
                      ? "glow-violet border-violet/30"
                      : "hover:border-cobalt/30 hover:shadow-md"
                  }`}
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
                    <ChevronDown className="w-5 h-5 text-body/40" />
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
                      <div className="px-6 py-4 pl-20 text-body/80 leading-relaxed bg-slate-50/50 rounded-b-xl border-x border-b border-slate-200 text-sm md:text-base">
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
          className="mt-24 py-12 border-t border-slate-200"
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
                <div className="w-14 h-14 rounded-xl bg-cobalt/5 border border-cobalt/20 flex items-center justify-center group-hover:border-violet/40 group-hover:glow-violet transition-all duration-300">
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
