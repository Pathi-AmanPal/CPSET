"use client";

import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight } from "@/lib/motion";
import CountUp from "@/components/ui/CountUp";
import { Shield, Users, Award } from "lucide-react";

const stats = [
  { icon: Shield, value: 50, suffix: "+", label: "Projects" },
  { icon: Users, value: 100, suffix: "+", label: "Members" },
  { icon: Award, value: 20, suffix: "+", label: "Achievements" },
];

export default function IntroStrip() {
  return (
    <section id="intro" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text side */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-royal mb-6">
              Securing Tomorrow&apos;s{" "}
              <span className="gradient-text">Digital Landscape</span>
            </h2>
            <p className="text-body/80 leading-relaxed text-lg">
              CPSET is a premier cybersecurity research club at Chandigarh
              University, focused on cutting-edge privacy and security research
              in emerging technologies. We bridge the gap between academic
              knowledge and real-world cybersecurity challenges.
            </p>
          </motion.div>

          {/* Stats side */}
          <motion.div
            className="flex flex-wrap gap-6 lg:justify-end"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-6 flex-1 min-w-[140px] text-center"
                style={{ border: "1px solid rgba(100, 130, 255, 0.20)" }}
              >
                <stat.icon className="w-6 h-6 text-cobalt mx-auto mb-3" />
                <div className="font-heading font-bold text-3xl text-royal mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-body/70 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
