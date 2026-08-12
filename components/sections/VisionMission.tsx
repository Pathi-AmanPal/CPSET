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
    title: "Cutting-Edge Research",
    description:
      "Conduct pioneering research in privacy-preserving technologies, cryptography, and cybersecurity protocols for emerging platforms.",
    label: "Research",
  },
  {
    icon: Zap,
    title: "Real-World Challenges",
    description:
      "Bridge the gap between academic knowledge and practical cybersecurity challenges through hands-on projects and industry collaborations.",
    label: "Practice",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description:
      "Foster a culture of peer-to-peer learning, mentorship, and cross-disciplinary collaboration among students and faculty.",
    label: "Teamwork",
  },
  {
    icon: GraduationCap,
    title: "Nurturing Talent",
    description:
      "Develop the next generation of cybersecurity professionals through workshops, certifications, and competitive training.",
    label: "Growth",
  },
  {
    icon: Eye,
    title: "Security Awareness",
    description:
      "Promote cybersecurity awareness across the university community and beyond through outreach programs and seminars.",
    label: "Outreach",
  },
  {
    icon: ShieldCheck,
    title: "National Security",
    description:
      "Contribute to India's digital sovereignty by developing solutions that strengthen national cybersecurity infrastructure.",
    label: "Sovereignty",
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
            text="To be a globally recognized centre of excellence in privacy and security research, empowering innovation and trust in emerging technologies."
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
