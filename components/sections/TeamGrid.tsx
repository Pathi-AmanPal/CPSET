"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { Shield, FileText, X, Sparkles, UserCheck, Terminal, Layers } from "lucide-react";
import Image from "next/image";
import TerminalCard from "@/components/ui/TerminalCard";

interface Operative {
  id: string;
  name: string;
  role: string;
  department?: string;
  photo?: string;
  bio: string;
  quote?: string;
  badge: string;
  dossierNo: string;
  teamMembers?: string[];
  color: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const MENTOR: Operative = {
  id: "mentor",
  name: "Dr. Syed Irfan",
  role: "CPSET Coordinator & Faculty Lead",
  photo: "/images/team/syed.jpeg",
  bio: "Directing cybersecurity research, privacy engineering, and coordinating CPSET's next-generation threat analysts and security engineers at Chandigarh University.",
  quote: "Privacy isn't an afterthought — it is the core foundation of every emerging technology.",
  badge: "COORDINATOR",
  dossierNo: "CPSET-SUBJECT-01",
  color: "from-amber-500/20 via-orange-500/10 to-transparent",
};

const OPERATIVES: Operative[] = [
  {
    id: "m-president",
    name: "Husanpreet Kaur",
    role: "Secretary",
    photo: "/images/team/husanpreet-kaur.png",
    bio: "Directing overall student leadership, strategic vision, research initiatives, and core lab operations.",
    quote: "We don't just study vulnerabilities — we architect privacy-first systems.",
    badge: "SECRETARY",
    dossierNo: "CPSET-DOSSIER-01",
    color: "from-purple-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "m-webmaster",
    name: "Pathi Aman Pal",
    role: "Web Master Lead",
    photo: "/images/team/Pathi_Aman_Pal.png",
    bio: "Leading full-stack web architecture, system infrastructure, and interactive digital interfaces for CPSET platforms.",
    badge: "WEB MASTER",
    dossierNo: "CPSET-DOSSIER-02",
    teamMembers: ["Pullagura Mahan Shashank Yadav", "Rahul Jaluthria", "Pankaj Saini"],
    color: "from-blue-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "m-technical",
    name: "Harish Soni",
    role: "Technical Lead",
    photo: "",
    bio: "Directing technical operations, exploit analysis, vulnerability research, and Capture The Flag competitions.",
    badge: "TECHNICAL",
    dossierNo: "CPSET-DOSSIER-03",
    teamMembers: ["Pankaj Saini", "Nayan Jain"],
    color: "from-red-500/20 via-rose-500/10 to-transparent",
  },
  {
    id: "m-social",
    name: "Manya Sharma",
    role: "Social Media Lead",
    photo: "/images/team/manya-sharma.png",
    bio: "Directing digital outreach, community engagement, brand identity, and social media presence.",
    quote: "Connecting the cybersecurity community through clear, powerful digital narratives.",
    badge: "SOCIAL MEDIA",
    dossierNo: "CPSET-DOSSIER-04",
    teamMembers: ["Shaan", "Rahul Jaluthria"],
    color: "from-pink-500/20 via-rose-500/10 to-transparent",
  },
  {
    id: "m-discipline",
    name: "Yuvi Booti",
    role: "Discipline Lead",
    photo: "",
    bio: "Ensuring operational standards, event discipline, ethical protocols, and organizational coordination.",
    badge: "DISCIPLINE",
    dossierNo: "CPSET-DOSSIER-05",
    teamMembers: ["Arshdeep Singh", "Yamiki Chaturvedi", "Aditya Jha"],
    color: "from-cyan-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "m-management",
    name: "Ridhima Gulati",
    role: "Management Lead",
    photo: "",
    bio: "Managing event logistics, organizational planning, cross-functional coordination, and core workflows.",
    badge: "MANAGEMENT",
    dossierNo: "CPSET-DOSSIER-06",
    teamMembers: ["Jeavi", "Pranav Chauhan", "Jashanpreet Kaur"],
    color: "from-amber-500/20 via-yellow-500/10 to-transparent",
  },
  {
    id: "m-content",
    name: "Dilpreet Kaur",
    role: "Content Writing Lead",
    photo: "/images/team/dilpreet-kaur.jpeg",
    bio: "Overseeing technical documentation, cybersecurity articles, research publications, and official communications.",
    quote: "Precision in words is as crucial as precision in code.",
    badge: "CONTENT",
    dossierNo: "CPSET-DOSSIER-07",
    teamMembers: ["Shaan"],
    color: "from-emerald-500/20 via-green-500/10 to-transparent",
  },
  {
    id: "m-sponsorship",
    name: "Gopal Thakur",
    role: "Sponsorship Lead",
    photo: "",
    bio: "Managing industry partnerships, corporate sponsorships, vendor relations, and resource acquisition.",
    badge: "SPONSORSHIP",
    dossierNo: "CPSET-DOSSIER-08",
    teamMembers: ["Sukhwinder Singh", "Gagandeep Kaur"],
    color: "from-teal-500/20 via-emerald-500/10 to-transparent",
  },
  {
    id: "m-anchoring",
    name: "Prince Khatana",
    role: "Anchoring Lead",
    photo: "",
    bio: "Leading event hosting, keynote introductions, stage announcements, and public presentation.",
    badge: "ANCHORING",
    dossierNo: "CPSET-DOSSIER-09",
    teamMembers: ["Sumit Chauhan", "Ansh Rana", "Yamiki Chaturvedi"],
    color: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    id: "m-joint-secretary",
    name: "Avneet Kaur",
    role: "Joint Secretary",
    photo: "/images/team/Avneet_kaur.png",
    bio: "Supporting strategic operations, coordinating between departments, and ensuring seamless communication across all CPSET activities.",
    quote: "Collaboration and clarity are the backbone of every strong organization.",
    badge: "JOINT SEC",
    dossierNo: "CPSET-DOSSIER-10",
    color: "from-rose-500/20 via-pink-500/10 to-transparent",
  },
  {
    id: "m-graphics",
    name: "Harshit Narang",
    role: "Graphics Lead",
    photo: "/images/team/Harshit_Narang.png",
    bio: "Directing visual design, creative identity, brand assets, and digital media graphics for CPSET projects.",
    quote: "Translating complex cybersecurity concepts into compelling visual experiences.",
    badge: "GRAPHICS",
    dossierNo: "CPSET-DOSSIER-11",
    teamMembers: ["Avneet Singh"],
    color: "from-rose-500/20 via-red-500/10 to-transparent",
  },
];

export default function TeamGrid() {
  const [selectedOperative, setSelectedOperative] = useState<Operative | null>(null);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="relative py-8">
      {/* ── Section Title ── */}
      <motion.div
        className="text-center mb-12"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          CoE Leadership & Threat Operatives
        </h2>
      </motion.div>

      {/* ── Coordinator Spotlight Card ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-14 cursor-pointer"
        onClick={() => setSelectedOperative(MENTOR)}
      >
        <TerminalCard
          tabTitle={`Administrator: PowerShell — Coordinator Dossier [${MENTOR.dossierNo}]`}
          path={`PS D:\\CPSET\\Operatives\\${MENTOR.id}>`}
          showPrompt={true}
          className="max-w-4xl mx-auto border-amber-500/40 hover:border-amber-400"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Photo Avatar */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-amber-400/50 shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
              {MENTOR.photo && !imgErrorMap[MENTOR.id] ? (
                <Image
                  src={MENTOR.photo}
                  alt={MENTOR.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => handleImgError(MENTOR.id)}
                />
              ) : (
                <div className="w-full h-full bg-amber-950/80 flex items-center justify-center text-3xl font-mono font-bold text-amber-200">
                  {getInitials(MENTOR.name)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>CENTRE OF EXCELLENCE COORDINATOR</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-2 group-hover:text-amber-200 transition-colors">
                {MENTOR.name}
              </h3>
              <p className="text-amber-300/90 font-mono text-sm mb-4">
                {MENTOR.role}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed font-sans mb-4">
                {MENTOR.bio}
              </p>

              {MENTOR.quote && (
                <blockquote className="p-3.5 rounded-xl bg-amber-500/10 border-l-2 border-amber-400 text-xs italic text-amber-200 font-mono">
                  &ldquo;{MENTOR.quote}&rdquo;
                </blockquote>
              )}
            </div>
          </div>
        </TerminalCard>
      </motion.div>

      {/* ── Operatives Grid ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {OPERATIVES.map((op) => {
          const hasImg = op.photo && !imgErrorMap[op.id];

          return (
            <motion.div key={op.id} variants={fadeInUp} className="h-full">
              <div onClick={() => setSelectedOperative(op)} className="cursor-pointer h-full">
                <TerminalCard
                  tabTitle={`Administrator: PowerShell — ${op.name}`}
                  path={`PS D:\\CPSET\\Operatives\\${op.id}>`}
                  showPrompt={true}
                  className="h-full"
                >
                  {/* Top Bar: Badge + Dossier */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-300">
                      {op.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {op.dossierNo}
                    </span>
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-slate-900 flex items-center justify-center text-lg font-mono font-bold text-cyan-300 shadow-md">
                      {hasImg ? (
                        <Image
                          src={op.photo!}
                          alt={op.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() => handleImgError(op.id)}
                        />
                      ) : (
                        <span>{getInitials(op.name)}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-lg text-white group-hover:text-cyan-200 transition-colors">
                        {op.name}
                      </h4>
                      <p className="text-xs font-mono text-cyan-400">
                        {op.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4">
                    {op.bio}
                  </p>

                  {/* Sub-team Members List (if applicable) */}
                  {op.teamMembers && op.teamMembers.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1">
                        <Layers className="w-3 h-3 text-purple-400" />
                        <span>TEAM MEMBERS:</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-300 line-clamp-1">
                        {op.teamMembers.join(", ")}
                      </p>
                    </div>
                  )}
                </TerminalCard>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Operative Detail Modal ── */}
      <AnimatePresence>
        {selectedOperative && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOperative(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl p-7 bg-[#090d29] border border-cyan-500/40 shadow-[0_0_50px_rgba(90,138,255,0.3)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedOperative(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/15 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dossier Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-6">
                <FileText className="w-4 h-4 text-cyan-300" />
                <span>DOSSIER // {selectedOperative.dossierNo}</span>
              </div>

              {/* Profile Header */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shrink-0 bg-slate-900 flex items-center justify-center text-2xl font-mono font-bold text-cyan-200">
                  {selectedOperative.photo && !imgErrorMap[selectedOperative.id] ? (
                    <Image
                      src={selectedOperative.photo}
                      alt={selectedOperative.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{getInitials(selectedOperative.name)}</span>
                  )}
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-mono font-semibold text-cyan-300 uppercase">
                    {selectedOperative.badge}
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-white mt-1">
                    {selectedOperative.name}
                  </h3>
                  <p className="text-sm font-mono text-cyan-400">
                    {selectedOperative.role}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  OPERATIONAL OVERVIEW
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedOperative.bio}
                </p>
              </div>

              {/* Quote if present */}
              {selectedOperative.quote && (
                <div className="mb-6">
                  <blockquote className="p-3.5 rounded-xl bg-purple-500/10 border-l-2 border-purple-400 text-xs italic text-purple-200 font-mono">
                    &ldquo;{selectedOperative.quote}&rdquo;
                  </blockquote>
                </div>
              )}

              {/* Sub-team roster if present */}
              {selectedOperative.teamMembers && selectedOperative.teamMembers.length > 0 && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-300 mb-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>SUB-TEAM OPERATIVES</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOperative.teamMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
