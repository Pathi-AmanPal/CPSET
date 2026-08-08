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
            Connect
          </p>
          <AnimatedText
            text="Stay In The Loop"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
          <p className="text-body/70 mt-4 max-w-lg mx-auto text-sm md:text-base">
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
              className="glass border border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-4 text-center group transition-all duration-300 shadow-sm"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-md`}
              >
                <social.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-royal text-lg">
                  {social.name}
                </h3>
                <p className="text-body/60 text-sm mt-1 font-medium">{social.handle}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-body/40 group-hover:text-cobalt transition-colors" />
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
          <div className="glass border border-slate-200 shadow-md rounded-3xl p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cobalt/10 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-royal mb-4">
                Ready to Join?
              </h2>
              <p className="text-body/70 mb-8 max-w-md mx-auto text-sm md:text-base">
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
