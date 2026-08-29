"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import SpotlightCard from "@/components/ui/SpotlightCard";
import DecryptedText from "@/components/ui/DecryptedText";
import { fetchEvents } from "@/lib/fetchers";
import { formatDate, isUpcoming } from "@/lib/utils";
import type { Event } from "@/lib/types";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Shield,
  Search,
  Cpu,
  Award,
  Users,
  ExternalLink,
  Layers,
  Terminal,
} from "lucide-react";
import Image from "next/image";

const FLAGSHIP_EVENT: Event = {
  id: "steganography-workshop-2026",
  title: "Steganography & Network Forensics",
  description:
    "Live hands-on cybersecurity workshop exploring digital steganography, LSB data hiding, Wireshark packet capture, covert channel analysis, and payload extraction. Organized by AIT CSE, S.E.C.U.R.E Cybersecurity Club, CySecSphere Club, and CPSET in academic partnership with EC-Council.",
  eventDate: "2026-08-03T14:00:00.000Z",
  location: "Chandigarh University, Mohali",
  imageUrl: "/images/events/cpset-team-highlight.jpeg",
};

const DEFAULT_EVENTS: Event[] = [
  FLAGSHIP_EVENT,
  {
    id: "cyber-drill-ctf-2026",
    title: "CPSET Cyber Drill & CTF Championship",
    description:
      "Flagship Jeopardy-style Capture The Flag competition covering cryptography, reverse engineering, web security, binary exploitation, and incident response.",
    eventDate: "2026-09-18T09:00:00.000Z",
    location: "Cybersecurity CoE Lab, CU Mohali",
    imageUrl: "/images/case-board-bg.png",
  },
  {
    id: "privacy-ai-safety-2026",
    title: "Privacy Engineering & AI Safety Seminar",
    description:
      "Expert-led symposium on differential privacy, federated learning security, LLM vulnerability assessment, and privacy-preserving AI frameworks.",
    eventDate: "2026-10-12T10:00:00.000Z",
    location: "Main Auditorium, Chandigarh University",
    imageUrl: "/images/team/cpset-team-highlight.jpeg",
  },
];

export default function EventsTimeline() {
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(DEFAULT_EVENTS);
        }
      })
      .catch(() => setEvents(DEFAULT_EVENTS))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter((e) => isUpcoming(e.eventDate));
  const past = events.filter((e) => !isUpcoming(e.eventDate));

  return (
    <main className="pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-cobalt text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cobalt" />
            CPSET CYBERSECURITY EVENTS
          </div>
          <AnimatedText
            text="Workshops, Cyber Drills & Symposia"
            as="h1"
            className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-royal"
            gradient
          />
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Hands-on technical training, industry expert talks, and competitive hackathons powering privacy & security skills.
          </p>
        </motion.div>

        {/* ── FLAGSHIP EVENT BENTO GRID SHOWCASE ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="font-heading font-bold text-xl text-royal">
                Flagship Workshop Showcase
              </h2>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
              LIVE CYBERSECURITY WORKSHOP
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Main Event Banner & Meta (Span 2) */}
            <SpotlightCard className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-slate-900/90 border-blue-500/30">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                {/* Organizers Ribbon */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-mono text-slate-300">
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                    CU AIT CSE
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                    S.E.C.U.R.E CLUB
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                    CySecSphere
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                    CPSET
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                    EC-COUNCIL ACADEMIA
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-3">
                  <DecryptedText
                    text="STEGANOGRAPHY & NETWORK FORENSICS"
                    animateOn="hover"
                    speed={45}
                    maxIterations={4}
                    className="text-white font-extrabold"
                    encryptedClassName="text-cyan-400 font-mono"
                  />
                </h3>

                <p className="text-cyan-300/90 font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  DECODE • INVESTIGATE • DEFEND
                </p>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {FLAGSHIP_EVENT.description}
                </p>
              </div>

              {/* Event Meta Bar */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Date</p>
                    <p className="text-xs font-semibold text-white">Monday, 3 August 2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Time</p>
                    <p className="text-xs font-semibold text-white">2:00 PM – 3:30 PM IST</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Venue</p>
                    <p className="text-xs font-semibold text-white">CU Campus, Mohali</p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento Card 2: Resource Person Spotlight (Span 1) */}
            <SpotlightCard className="p-6 flex flex-col justify-between bg-slate-900/90 border-purple-500/30">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full w-fit mb-6">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  RESOURCE PERSON
                </div>

                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.3)] mb-4">
                    <Image
                      src="/images/team/Talha_Jawed.jpeg"
                      alt="Mr. Talha Jawed"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h4 className="font-heading font-bold text-lg text-white">
                    Mr. Talha Jawed
                  </h4>
                  <p className="text-xs font-mono text-purple-300 mt-1">
                    Assistant Director Academia
                  </p>
                  <p className="text-xs font-semibold text-amber-400 mt-0.5">
                    EC-Council
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <p className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    Network Forensics & Packet Analysis
                  </p>
                  <p className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    Steganography & Data Hiding
                  </p>
                  <p className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    EC-Council Academic Partnership
                  </p>
                </div>
              </div>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Join S.E.C.U.R.E Club
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>

            {/* Bento Card 3: Team Highlights Gallery (Span 2) */}
            <SpotlightCard className="lg:col-span-2 p-6 bg-slate-900/90 border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Users className="w-4 h-4 text-cyan-400" />
                  WORKSHOP HIGHLIGHTS & TEAM GALLERY
                </div>
                <span className="text-[11px] font-mono text-slate-400">CPSET CoE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-xl overflow-hidden border border-blue-500/30 group">
                  <Image
                    src="/images/events/cpset-team-highlight.jpeg"
                    alt="CPSET Workshop Highlights"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-3 flex items-end">
                    <p className="text-xs font-medium text-white">
                      CPSET Executive Committee & Workshop Participants
                    </p>
                  </div>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/30 group">
                  <Image
                    src="/images/case-board-bg.png"
                    alt="Network Forensics Analysis Session"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-3 flex items-end">
                    <p className="text-xs font-medium text-white">
                      Live Packet Capture & Steganographic Investigation
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Bento Card 4: Technical Modules Covered (Span 1) */}
            <SpotlightCard className="p-6 bg-slate-900/90 border-blue-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-300 mb-4">
                  <Search className="w-4 h-4 text-blue-400" />
                  KEY WORKSHOP MODULES
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-xs font-bold text-white mb-0.5">1. Digital Steganography</p>
                    <p className="text-[11px] text-slate-400">Least Significant Bit (LSB) hiding in images & audio files.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-xs font-bold text-white mb-0.5">2. Network Packet Forensics</p>
                    <p className="text-[11px] text-slate-400">Wireshark PCAP inspection & covert channel tracking.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-xs font-bold text-white mb-0.5">3. Payload Extraction</p>
                    <p className="text-[11px] text-slate-400">Extracting embedded malware payloads & investigative reporting.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Certificates Issued</span>
                <span className="text-green-400 font-semibold">EC-Council & CPSET</span>
              </div>
            </SpotlightCard>

          </div>
        </section>

        {/* ── EVENTS TIMELINE / OTHER EVENTS ── */}
        <section className="space-y-8 pt-8">
          {upcoming.length > 0 && (
            <div>
              <motion.h2
                className="font-heading font-semibold text-xl text-royal mb-6 flex items-center gap-2"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                Upcoming Events & Competitions
              </motion.h2>

              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {upcoming.map((event, i) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={i}
                    accent
                  />
                ))}
              </motion.div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <motion.h2
                className="font-heading font-semibold text-xl text-slate-300 mb-6"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Past Events & Workshops
              </motion.h2>

              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {past.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

function EventCard({
  event,
  index,
  accent = false,
}: {
  event: Event;
  index: number;
  accent?: boolean;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      variants={isLeft ? fadeInLeft : fadeInRight}
      className={isLeft ? "md:mr-10" : "md:ml-10"}
    >
      <SpotlightCard className="p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {event.imageUrl && (
            <div className="relative w-full md:w-64 aspect-video md:aspect-auto shrink-0">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </div>
          )}

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cobalt" />
                  {formatDate(event.eventDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cobalt" />
                  {event.location}
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-royal mb-2">
                {event.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            {accent && (
              <div className="mt-4">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    color: "#4ADE80",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  Registration Open
                </span>
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
