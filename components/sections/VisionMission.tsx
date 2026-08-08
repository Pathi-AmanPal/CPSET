"use client";

import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import {
  Search,
  Zap,
  Users,
  GraduationCap,
  Eye,
  ShieldCheck,
} from "lucide-react";

const missionPoints = [
  {
    icon: Search,
    title: "Cutting-Edge Research",
    description:
      "Conduct pioneering research in privacy-preserving technologies, cryptography, and cybersecurity protocols for emerging platforms.",
  },
  {
    icon: Zap,
    title: "Real-World Challenges",
    description:
      "Bridge the gap between academic knowledge and practical cybersecurity challenges through hands-on projects and industry collaborations.",
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description:
      "Foster a culture of peer-to-peer learning, mentorship, and cross-disciplinary collaboration among students and faculty.",
  },
  {
    icon: GraduationCap,
    title: "Nurturing Talent",
    description:
      "Develop the next generation of cybersecurity professionals through workshops, certifications, and competitive training.",
  },
  {
    icon: Eye,
    title: "Security Awareness",
    description:
      "Promote cybersecurity awareness across the university community and beyond through outreach programs and seminars.",
  },
  {
    icon: ShieldCheck,
    title: "National Security",
    description:
      "Contribute to India's digital sovereignty by developing solutions that strengthen national cybersecurity infrastructure.",
  },
];

export default function VisionMissionPage() {
  return (
    <main className="pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vision */}
        <section className="relative py-20 md:py-32 text-center">
          {/* Gradient wash behind text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-gradient-to-r from-cobalt/10 via-violet/10 to-cobalt/10 blur-[100px] rounded-full" />
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

        {/* Mission — staggered alternating layout */}
        <section className="py-16 md:py-24">
          <motion.div
            className="text-center mb-16"
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

          <motion.div
            className="space-y-8 md:space-y-12 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {missionPoints.map((point, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={point.title}
                  variants={isLeft ? fadeInLeft : fadeInRight}
                  className={`flex items-start gap-6 glass p-6 rounded-2xl border border-slate-200 shadow-sm ${
                    isLeft ? "md:mr-24" : "md:ml-24"
                  }`}
                >
                  {/* Connector line + icon */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-cobalt/10 border border-cobalt/20 flex items-center justify-center">
                      <point.icon className="w-5 h-5 text-cobalt" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3 className="font-heading font-semibold text-lg text-royal mb-2">
                      {point.title}
                    </h3>
                    <p className="text-body/80 leading-relaxed text-sm md:text-base">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
