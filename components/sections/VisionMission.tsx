"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import CircularCarousel, { CarouselItem } from "@/components/ui/circular-carousel";
import TerminalCard from "@/components/ui/TerminalCard";
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
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

      {/* Vision Container */}
      <section className="relative mb-24 text-center">
        <TerminalCard
          tabTitle="Administrator: PowerShell — Vision Statement"
          path="PS C:\CPSET\Vision>"
          promptText="Get-VisionStatement"
          interactive={false}
          className="max-w-5xl mx-auto"
        >
          <AnimatedText
            text="To be a globally recognized Cybersecurity Centre of Excellence — promoting education, research, innovation, and skill development in privacy, security, and emerging technologies."
            as="h2"
            className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed max-w-4xl mx-auto tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </TerminalCard>
      </section>

      {/* Mission Section with Circular Carousel */}
      <section className="relative py-4">
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            What Drives Us Forward
          </h3>
        </motion.div>

        <CircularCarousel items={missionItems} autoPlay={true} autoPlayInterval={4500} />
      </section>
    </div>
  );
}
