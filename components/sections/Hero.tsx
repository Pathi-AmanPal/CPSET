"use client";

import { motion } from "framer-motion";
import AnimatedText, { ShinyText } from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import WireframeGlobe from "@/components/3d/WireframeGlobe";
import { ArrowDown, ExternalLink } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient Responsive & Reactive 3D Wireframe Globe */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <WireframeGlobe color="0, 71, 171" speed={0.0025} maxTilt={0.35} className="max-w-5xl max-h-[750px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-cobalt font-heading font-semibold text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] mb-4 md:mb-6">
            Chandigarh University
          </p>
        </motion.div>

        <AnimatedText
          text="Centre for Privacy and Security in Emerging Technologies"
          as="h1"
          className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-royal leading-tight mb-6"
          gradient
          delay={0.1}
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-body/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            <ShinyText>
              Empowering the next generation of cybersecurity professionals
            </ShinyText>
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlowButton href="#" variant="primary" size="lg">
            Become a Member
            <ExternalLink className="w-4 h-4" />
          </GlowButton>

          <GlowButton href="#intro" variant="secondary" size="lg">
            Explore
            <ArrowDown className="w-4 h-4" />
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
