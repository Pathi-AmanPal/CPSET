"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { Users, Instagram, Linkedin, Maximize2, X, Shield, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";

export default function TeamHighlightSection() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[700px] h-[350px] rounded-full blur-[140px] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(90,138,255,0.3) 0%, rgba(139,92,246,0.2) 60%, transparent 100%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-4"
            style={{ background: "rgba(90,138,255,0.1)", borderColor: "rgba(90,138,255,0.3)", color: "#93c5fd" }}>
            <Users className="w-3.5 h-3.5 text-blue-400" />
            CPSET TEAM HIGHLIGHT // AIT-CSE LABS
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-royal mb-3">
            Inaugural Leadership & Threat Operations Group
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-mono leading-relaxed">
            Dr. Syed Irfan (CPSET Coordinator) with core department leads at the Centre for Privacy & Security in Emerging Technologies, Chandigarh University.
          </p>
        </motion.div>

        {/* Main Photo Card Showcase */}
        <motion.div
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border shadow-2xl group cursor-pointer"
          style={{
            background: "rgba(10, 15, 38, 0.85)",
            borderColor: "rgba(90, 138, 255, 0.35)",
            boxShadow: "0 0 45px rgba(90, 138, 255, 0.20), 0 10px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(16px)",
          }}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Top Bar overlay */}
          <div className="px-5 py-3 border-b flex items-center justify-between bg-slate-950/60"
            style={{ borderColor: "rgba(90,138,255,0.2)" }}>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs text-slate-300 tracking-wider">
                CPSET_COE_GROUP_PHOTO.RAW
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>CLICK TO EXPAND</span>
            </div>
          </div>

          {/* Image Container with scanner effect */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
            <Image
              src="/images/team/cpset-team-highlight.png"
              alt="CPSET Team and Dr Syed Irfan at Chandigarh University"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority
              onError={(e) => {
                // Fallback to syed.jpeg or photo placeholder if asset missing
                const target = e.target as HTMLImageElement;
                target.src = "/images/team/syed.jpeg";
              }}
            />

            {/* Subtle cyber grid & vignette overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20" />
            
            {/* Cyber corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400/80 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400/80 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400/80 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-400/80 pointer-events-none" />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  Chandigarh University AIT-CSE
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-heading">
                  Centre for Privacy & Security in Emerging Technologies
                </h3>
                <p className="text-xs md:text-sm text-slate-300 font-mono mt-1">
                  Dr. Syed Irfan (Coordinator) with Core Leads & Research Officers
                </p>
              </div>

              {/* Social Media Link Chips */}
              <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <a
                  href="https://www.instagram.com/cpset_ait/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(225,29,72,0.2) 0%, rgba(147,51,234,0.2) 100%)",
                    border: "1px solid rgba(244,63,94,0.4)",
                    color: "#f43f5e",
                  }}
                >
                  <Instagram className="w-4 h-4" />
                  <span>@cpset_ait</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href="https://www.linkedin.com/company/cyphoria-women-in-cybersecurity-wicys-%E2%80%93-chandigarh-university-student-chapter/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(59,130,246,0.2) 100%)",
                    border: "1px solid rgba(56,189,248,0.4)",
                    color: "#38bdf8",
                  }}
                >
                  <Linkedin className="w-4 h-4" />
                  <span>WiCyS Cyphoria</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="relative max-w-6xl w-full rounded-2xl overflow-hidden border border-blue-500/40 bg-slate-900 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/team/cpset-team-highlight.png"
                  alt="CPSET Group Photo Full View"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/team/syed.jpeg";
                  }}
                />
              </div>

              <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white font-heading">
                    CPSET Centre of Excellence — Full Leadership Group
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Chandigarh University AIT-CSE Cybersecurity & Privacy Engineering Division
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/cpset_ait/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a
                    href="https://www.linkedin.com/company/cyphoria-women-in-cybersecurity-wicys-%E2%80%93-chandigarh-university-student-chapter/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
