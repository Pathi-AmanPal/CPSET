"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import CircularCarousel, { CarouselItem } from "@/components/ui/circular-carousel";
import {
  Search,
  Zap,
  Users,
  GraduationCap,
  Eye,
  ShieldCheck,
  Compass,
  Target
} from "lucide-react";

const missionItems: CarouselItem[] = [
  {
    id: "1",
    title: "Research & Innovation",
    description:
      "Conduct cutting-edge research in cybersecurity, privacy engineering, cryptography, AI security, and emerging technology threats. Publish research and file patents.",
    tag: "Research",
    icon: Search,
  },
  {
    id: "2",
    title: "Hands-On Learning",
    description:
      "Develop talent through advanced cybersecurity laboratories, cyber drills, cyber ranges, CTF competitions, hackathons, and real-world security challenges.",
    tag: "Practice",
    icon: Zap,
  },
  {
    id: "3",
    title: "Collaborative Learning",
    description:
      "Foster peer-to-peer learning, mentorship, faculty development programs (FDPs), and cross-disciplinary collaboration among students, faculty, and industry experts.",
    tag: "Teamwork",
    icon: Users,
  },
  {
    id: "4",
    title: "Certifications & Talent",
    description:
      "Facilitate globally recognized certification programs (Cisco, Microsoft, EC-Council) and develop the next generation of industry-ready cybersecurity professionals.",
    tag: "Growth",
    icon: GraduationCap,
  },
  {
    id: "5",
    title: "Awareness & Outreach",
    description:
      "Promote cybersecurity awareness through seminars, workshops, awareness campaigns, national and international conferences across university and community.",
    tag: "Outreach",
    icon: Eye,
  },
  {
    id: "6",
    title: "Industry & Global Ties",
    description:
      "Foster interdisciplinary research, support cybersecurity startups, and build strong academia–industry partnerships and international collaborations.",
    tag: "Partnership",
    icon: ShieldCheck,
  },
];

export default function VisionMission() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Background ambient radial light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#5A8AFF]/15 via-[#9B7FFF]/15 to-transparent blur-[140px] pointer-events-none" />

      {/* Vision Container */}
      <section className="relative mb-16 text-center">
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A8AFF]/10 border border-[#5A8AFF]/30 text-cyan-300 text-xs font-mono mb-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>OUR VISION // CPSET CORE STRATEGY</span>
        </motion.div>

        <div className="p-8 sm:p-12 md:p-16 rounded-3xl bg-[#090D24]/80 border border-[#5A8AFF]/20 backdrop-blur-2xl shadow-[0_12px_50px_rgba(0,5,30,0.6)] relative overflow-hidden group">
          {/* Subtle glowing rim border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <AnimatedText
            text="To be a globally recognized Cybersecurity Centre of Excellence — promoting education, research, innovation, and skill development in privacy, security, and emerging technologies."
            as="h2"
            className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed max-w-4xl mx-auto tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>
      </section>

      {/* Mission Section with Circular Carousel */}
      <section className="relative">
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9B7FFF]/10 border border-[#9B7FFF]/30 text-violet-300 text-xs font-mono mb-4">
            <Target className="w-3.5 h-3.5 text-violet-400" />
            <span>OUR MISSION PILLARS</span>
          </div>
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            What Drives Us Forward
          </h3>
        </motion.div>

        <CircularCarousel items={missionItems} autoPlay={true} autoPlayInterval={4000} />
      </section>
    </div>
  );
}
