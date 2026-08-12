"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import MagicBento, { BentoCardItem } from "@/components/ui/MagicBento";
import {
  Search,
  Zap,
  Users,
  GraduationCap,
  Eye,
  ShieldCheck,
} from "lucide-react";

const missionCards: BentoCardItem[] = [
  {
    icon: Search,
    title: "Research & Innovation",
    description:
      "Conduct cutting-edge research in cybersecurity, privacy engineering, cryptography, AI security, and emerging technology threats. Publish research and file patents.",
    label: "Research",
  },
  {
    icon: Zap,
    title: "Hands-On Learning",
    description:
      "Develop talent through advanced cybersecurity laboratories, cyber drills, cyber ranges, CTF competitions, hackathons, and real-world security challenges.",
    label: "Practice",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description:
      "Foster peer-to-peer learning, mentorship, faculty development programs (FDPs), and cross-disciplinary collaboration among students, faculty, and industry experts.",
    label: "Teamwork",
  },
  {
    icon: GraduationCap,
    title: "Certifications & Talent",
    description:
      "Facilitate globally recognized certification programs (Cisco, Microsoft, EC-Council) and develop the next generation of industry-ready cybersecurity professionals.",
    label: "Growth",
  },
  {
    icon: Eye,
    title: "Awareness & Outreach",
    description:
      "Promote cybersecurity awareness through seminars, workshops, awareness campaigns, national and international conferences across university and community.",
    label: "Outreach",
  },
  {
    icon: ShieldCheck,
    title: "Industry & Global Ties",
    description:
      "Foster interdisciplinary research, support cybersecurity startups, and build strong academia–industry partnerships and international collaborations.",
    label: "Partnership",
  },
];

export default function VisionMissionPage() {
  return (
    <main className="pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vision */}
        <section className="relative py-16 md:py-24 text-center">
          {/* Ambient gradient wash */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] blur-[120px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(60,100,255,0.15) 0%, rgba(100,60,200,0.10) 50%, transparent 100%)" }} />
          </div>

          <motion.p
            className="text-cobalt font-heading text-sm uppercase tracking-[0.3em] font-semibold mb-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Vision
          </motion.p>

          <AnimatedText
            text="To be a globally recognized Cybersecurity Centre of Excellence — promoting education, research, innovation, and skill development in privacy, security, and emerging technologies."
            as="h1"
            className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-royal leading-snug max-w-4xl mx-auto"
          />
        </section>

        {/* Mission — MagicBento Grid */}
        <section className="py-12 md:py-16">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-cobalt font-heading text-sm uppercase tracking-[0.3em] font-semibold mb-4">
              Our Mission
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-royal">
              What Drives Us Forward
            </h2>
          </motion.div>

          <MagicBento
            cardData={missionCards}
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={false}
            disableAnimations={false}
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </section>
      </div>
    </main>
  );
}
