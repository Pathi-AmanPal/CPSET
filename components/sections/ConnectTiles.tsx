"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";
import { Instagram, Twitter, MessageCircle, ExternalLink } from "lucide-react";

const socials = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@cpset.cu",
    href: "https://instagram.com/cpset.cu",
    gradient: "from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    glowColor: "rgba(131, 58, 180, 0.15)",
  },
  {
    icon: Twitter,
    name: "Twitter / X",
    handle: "@cpset_cu",
    href: "https://twitter.com/cpset_cu",
    gradient: "from-[#1DA1F2] to-[#0D8BD9]",
    glowColor: "rgba(29, 161, 242, 0.15)",
  },
  {
    icon: MessageCircle,
    name: "WhatsApp Community",
    handle: "Join our channel",
    href: "https://chat.whatsapp.com/",
    gradient: "from-[#25D366] to-[#128C7E]",
    glowColor: "rgba(37, 211, 102, 0.15)",
  },
];

export default function ConnectTiles() {
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
            Connect
          </p>
          <AnimatedText
            text="Stay In The Loop"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
          <p className="text-slate-300 mt-4 max-w-lg mx-auto text-sm md:text-base font-normal">
            Follow us for updates on events, workshops, and cybersecurity insights.
          </p>
        </motion.div>

        {/* Social tiles */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              whileHover={{
                y: -6,
                boxShadow: `0 12px 30px ${social.glowColor}`,
              }}
              className="rounded-2xl p-8 flex flex-col items-center gap-4 text-center group transition-all duration-300 shadow-lg"
              style={{
                background: "rgba(13, 18, 48, 0.85)",
                border: "1px solid rgba(100, 140, 255, 0.22)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-md`}
              >
                <social.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg">
                  {social.name}
                </h3>
                <p className="text-slate-300 text-sm mt-1 font-medium">{social.handle}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" />
            </motion.a>
          ))}
        </motion.div>

        {/* Become a Member CTA */}
        <motion.div
          className="mt-16 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            className="rounded-3xl p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden shadow-2xl"
            style={{
              background: "rgba(13, 18, 48, 0.90)",
              border: "1px solid rgba(120, 150, 255, 0.28)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
                Ready to Join?
              </h2>
              <p className="text-slate-200 mb-8 max-w-md mx-auto text-sm md:text-base font-normal">
                Become a member of CPSET through the Chandigarh University
                intranet and start your cybersecurity journey.
              </p>
              <GlowButton href="#" variant="primary" size="lg">
                Become a Member
                <ExternalLink className="w-4 h-4" />
              </GlowButton>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
