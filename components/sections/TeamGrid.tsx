"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTeam } from "@/lib/fetchers";
import {
  Shield,
  RotateCcw,
  Info,
  X,
  FileText,
  Sparkles,
  Pin,
  Award,
} from "lucide-react";
import Image from "next/image";

// ── Case Board Person Data Model ──
interface BoardPerson {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string | null;
  dossierNo: string;
  tag?: string;
  handwrittenTag?: string;
  quote?: string;
  initialOffset: { x: number; y: number }; // Desktop offset relative to center
  rotation: number; // Polaroid tilt degrees (-12 to 12)
}

// ── Master Roster Data with Verified Web-Safe Image Paths ──
const MENTOR_DATA: BoardPerson = {
  id: "mentor-syed-irfan",
  name: "Syed Irfan",
  role: "Mentor & Patron",
  dossierNo: "CPSET-SUBJECT-01",
  tag: "CASE HUB / MENTOR",
  handwrittenTag: "MENTOR",
  bio: "Directing cybersecurity research, privacy engineering, and mentoring CPSET's next-generation threat analysts and security engineers.",
  quote: "Privacy isn't an afterthought — it is the core foundation of every emerging technology.",
  photoUrl: "/images/team/syed-irfan.png",
  initialOffset: { x: 0, y: -15 },
  rotation: 0,
};

const DEFAULT_TEAM: BoardPerson[] = [
  {
    id: "member-1",
    name: "Husanpreet Kaur",
    role: "President & Lead Researcher",
    dossierNo: "CPSET-DOSSIER-02",
    tag: "PRIVACY ENGINEERING",
    handwrittenTag: "President",
    bio: "Directing student research initiatives, privacy preservation frameworks, and core lab operations.",
    quote: "We don't just study vulnerabilities — we architect privacy-first systems.",
    photoUrl: "/images/team/husanpreet-kaur.png",
    initialOffset: { x: -310, y: -140 },
    rotation: -7,
  },
  {
    id: "member-2",
    name: "Manya Sharma",
    role: "Vice President & Cryptography Lead",
    dossierNo: "CPSET-DOSSIER-03",
    tag: "ZERO-KNOWLEDGE PROOFS",
    handwrittenTag: "Vice Pres",
    bio: "Spearheading Zero-Knowledge Proof research and cryptographic protocol implementations.",
    quote: "Mathematical proof is the ultimate truth in digital privacy.",
    photoUrl: "/images/team/manya-sharma.png",
    initialOffset: { x: 310, y: -140 },
    rotation: 8,
  },
  {
    id: "member-3",
    name: "Pranav Chauhan",
    role: "Red Team & CTF Captain",
    dossierNo: "CPSET-DOSSIER-04",
    tag: "OFFENSIVE SECURITY",
    handwrittenTag: "Red Team",
    bio: "Kernel exploit developer & Red Teamer. Winner of national Capture The Flag cybersecurity competitions.",
    quote: "To defend a system, you must think like an adversary.",
    photoUrl: "/images/team/pranav-chauhan.png",
    initialOffset: { x: -340, y: 70 },
    rotation: 5,
  },
  {
    id: "member-4",
    name: "Yamiki Chaturvedi",
    role: "AI & ML Security Lead",
    dossierNo: "CPSET-DOSSIER-05",
    tag: "ADVERSARIAL ML",
    handwrittenTag: "AI Lead",
    bio: "Investigating Adversarial AI attacks, prompt injection vectors, and Privacy-Preserving Machine Learning models.",
    quote: "As AI advances, securing intelligence itself becomes our greatest challenge.",
    photoUrl: "/images/team/yamiki-chaturvedi.jpeg",
    initialOffset: { x: 340, y: 70 },
    rotation: -10,
  },
  {
    id: "member-5",
    name: "Dilpreet Kaur",
    role: "Cloud & DevSecOps Lead",
    dossierNo: "CPSET-DOSSIER-06",
    tag: "CONTAINER SECURITY",
    handwrittenTag: "Cloud Sec",
    bio: "Architecting automated threat detection pipelines, Kubernetes security policies, and DevSecOps frameworks.",
    quote: "Automation without continuous security is just automated risk.",
    photoUrl: "/images/team/dilpreet-kaur.jpeg",
    initialOffset: { x: -210, y: 240 },
    rotation: 11,
  },
  {
    id: "member-6",
    name: "Shaan XD",
    role: "Network Security & Forensic Lead",
    dossierNo: "CPSET-DOSSIER-07",
    tag: "DIGITAL FORENSICS",
    handwrittenTag: "Forensics",
    bio: "Specializing in deep packet inspection, incident response, and memory forensics for enterprise systems.",
    quote: "Every digital action leaves a trace behind.",
    photoUrl: "/images/team/shaan-xd.jpg",
    initialOffset: { x: 210, y: 240 },
    rotation: -6,
  },
];

export default function TeamGrid() {
  const [teamMembers, setTeamMembers] = useState<BoardPerson[]>(DEFAULT_TEAM);
  const [selectedBio, setSelectedBio] = useState<BoardPerson | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const mentorPinRef = useRef<HTMLDivElement>(null);
  const memberPinRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [stringPaths, setStringPaths] = useState<{ id: string; d: string }[]>([]);

  // Merge API members if fetched
  useEffect(() => {
    fetchTeam()
      .then((apiMembers) => {
        if (apiMembers && apiMembers.length > 0) {
          const merged = apiMembers.map((apiItem, index) => {
            const fallback = DEFAULT_TEAM[index % DEFAULT_TEAM.length];
            return {
              id: apiItem.id || fallback.id,
              name: apiItem.name,
              role: apiItem.role,
              bio: apiItem.bio || fallback.bio,
              photoUrl: apiItem.imageUrl || fallback.photoUrl,
              dossierNo: `CPSET-DOSSIER-0${index + 2}`,
              tag: apiItem.role.toUpperCase(),
              handwrittenTag: apiItem.role.split(" ")[0],
              initialOffset: fallback.initialOffset,
              rotation: fallback.rotation,
            };
          });
          setTeamMembers(merged);
        }
      })
      .catch(() => {});
  }, []);

  // Recalculate dynamic SVG strings between Mentor pin and team member pins
  const updateStrings = useCallback(() => {
    if (!boardRef.current || !mentorPinRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const mentorRect = mentorPinRef.current.getBoundingClientRect();

    const mX = mentorRect.left + mentorRect.width / 2 - boardRect.left;
    const mY = mentorRect.top + mentorRect.height / 2 - boardRect.top;

    const newPaths: { id: string; d: string }[] = [];

    teamMembers.forEach((member) => {
      const pinEl = memberPinRefs.current.get(member.id);
      if (!pinEl) return;

      const pRect = pinEl.getBoundingClientRect();
      const pX = pRect.left + pRect.width / 2 - boardRect.left;
      const pY = pRect.top + pRect.height / 2 - boardRect.top;

      // Quadratic Bezier curve (gravity sag)
      const dx = pX - mX;
      const dy = pY - mY;
      const dist = Math.hypot(dx, dy);
      const sag = Math.min(65, Math.max(20, dist * 0.16));

      const midX = (mX + pX) / 2;
      const midY = (mY + pY) / 2 + sag;

      newPaths.push({
        id: member.id,
        d: `M ${mX} ${mY} Q ${midX} ${midY} ${pX} ${pY}`,
      });
    });

    setStringPaths(newPaths);
  }, [teamMembers]);

  // RequestAnimationFrame animation loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      updateStrings();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    window.addEventListener("resize", updateStrings);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateStrings);
    };
  }, [updateStrings, resetKey]);

  const handleResetBoard = () => {
    setResetKey((prev) => prev + 1);
    setSelectedBio(null);
    setTimeout(updateStrings, 100);
  };

  return (
    <main className="pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-typewriter tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          CPSET NETWORK &bull; INVESTIGATION BOARD
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-royal tracking-tight mb-3">
          Meet the Team
        </h1>
        <p className="text-body/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Every thread connects back to our Mentor,{" "}
          <span className="text-violet-300 font-semibold">Syed Irfan</span>.
          Drag polaroids across the board to explore connections, inspect dossiers, and meet the researchers driving CPSET.
        </p>
      </div>

      {/* ── Top Bar Controls ── */}
      <div className="flex items-center justify-between gap-4 mb-4 px-2">
        <div className="flex items-center gap-2 text-xs text-body/60 font-typewriter">
          <Info className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="hidden sm:inline">
            Interactive Investigation Board &bull; Drag polaroid cards to reposition
          </span>
          <span className="sm:hidden">Drag polaroids to explore</span>
        </div>

        <button
          onClick={handleResetBoard}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium hover:bg-violet-900/70 hover:border-violet-400/50 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Board
        </button>
      </div>

      {/* ── MASTER CASE BOARD CONTAINER (CUSTOM BACKGROUND IMAGE) ── */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/50">

        {/* ── BACKGROUND IMAGE LAYER ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/case-board-bg.png"
            alt="CPSET Case Board Background"
            fill
            className="object-cover object-center"
            unoptimized
            priority
          />
          {/* Subtle Ambient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* ── CORKBOARD CANVAS OVERLAY ── */}
        <div
          ref={boardRef}
          className="relative min-h-[750px] md:min-h-[820px] w-full p-4 sm:p-8 flex items-center justify-center overflow-hidden select-none z-10"
        >
          {/* ── DYNAMIC LIVE SVG STRINGS NETWORK OVERLAY ── */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <defs>
              {/* String glowing filter */}
              <filter id="stringGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Purple Thread Gradient */}
              <linearGradient id="purpleThread" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E024C3" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {stringPaths.map(({ id, d }) => (
              <g key={id}>
                {/* Glowing Under-layer */}
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(192, 38, 211, 0.5)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#stringGlow)"
                />
                {/* Core Thread */}
                <path
                  d={d}
                  fill="none"
                  stroke="url(#purpleThread)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>

          {/* ── CENTER HUB: MENTOR CARD (SYED IRFAN) ── */}
          <div className="relative z-30 flex items-center justify-center">
            <motion.div
              key={`mentor-${resetKey}`}
              drag
              dragConstraints={boardRef}
              dragElastic={0.15}
              whileDrag={{ scale: 1.08, zIndex: 60 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="relative cursor-grab active:cursor-grabbing"
              onClick={() => setSelectedBio(MENTOR_DATA)}
            >
              {/* Brass Push Pin at Top Center */}
              <div
                ref={mentorPinRef}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-40 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border border-amber-800 shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex items-center justify-center group"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-900/60 inset-0 m-auto" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-1.5 h-3 bg-amber-950/80 blur-[1px]" />
              </div>

              {/* Polaroid Frame (1.35x Mentor Scale) */}
              <div className="w-[210px] sm:w-[235px] bg-[#FAF7F2] p-3 pb-5 rounded-sm polaroid-card-shadow border border-amber-100/60 relative group transition-shadow duration-300 hover:polaroid-card-shadow-lifted">
                {/* Adhesive Tape Corner Accent */}
                <div className="absolute -top-2.5 -right-3 w-12 h-5 bg-amber-100/60 backdrop-blur-xs border border-amber-200/40 rotate-12 shadow-xs pointer-events-none" />

                {/* Photo Frame */}
                <div className="relative aspect-[4/4.2] w-full bg-gradient-to-br from-violet-950 via-slate-900 to-amber-950 overflow-hidden rounded-xs border border-amber-900/20 mb-3 shadow-inner">
                  {MENTOR_DATA.photoUrl ? (
                    <Image
                      src={MENTOR_DATA.photoUrl}
                      alt={MENTOR_DATA.name}
                      fill
                      className="object-cover object-top contrast-[1.03]"
                      unoptimized
                      onError={(e) => {
                        // Fallback avatar if local image load is blocked
                        const target = e.target as HTMLElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : null}
                  {/* High-End Mentor Avatar Fallback Container */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-600/30 border border-violet-400/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      <Shield className="w-8 h-8 text-violet-300" />
                    </div>
                    <span className="text-amber-100/90 font-typewriter text-xs font-bold tracking-wider">
                      SYED IRFAN
                    </span>
                  </div>
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Polaroid Tag Info */}
                <div className="text-center px-1">
                  <span className="block font-typewriter text-xs font-bold text-amber-950 tracking-tight">
                    {MENTOR_DATA.name}
                  </span>
                  <span className="block text-[11px] font-semibold text-violet-800 font-sans mt-0.5">
                    {MENTOR_DATA.role}
                  </span>
                </div>

                {/* Red/Purple Handwritten "MENTOR" Scrawl Tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-200/95 border border-amber-400/60 px-3.5 py-0.5 rounded-sm shadow-md rotate-[-4deg]">
                  <span className="font-handwriting text-lg font-bold text-purple-900 leading-none">
                    {MENTOR_DATA.handwrittenTag}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── TEAM MEMBER POLAROIDS (RADIATING AROUND MENTOR) ── */}
          {teamMembers.map((member) => (
            <motion.div
              key={`${member.id}-${resetKey}`}
              drag
              dragConstraints={boardRef}
              dragElastic={0.15}
              initial={{
                x: member.initialOffset.x,
                y: member.initialOffset.y,
                rotate: member.rotation,
              }}
              whileDrag={{ scale: 1.08, rotate: 0, zIndex: 60 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute z-20 cursor-grab active:cursor-grabbing hidden md:block"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-100px",
                marginLeft: "-80px",
              }}
              onClick={() => setSelectedBio(member)}
            >
              {/* Brass Push Pin at Top Center */}
              <div
                ref={(el) => {
                  if (el) memberPinRefs.current.set(member.id, el);
                  else memberPinRefs.current.delete(member.id);
                }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-40 w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-900 shadow-[0_3px_8px_rgba(0,0,0,0.8)] flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-amber-950/70" />
              </div>

              {/* Polaroid Frame */}
              <div className="w-[160px] bg-[#FAF7F2] p-2.5 pb-4 rounded-sm polaroid-card-shadow border border-amber-100/60 transition-shadow duration-300 hover:polaroid-card-shadow-lifted relative">
                {/* Photo Container */}
                <div className="relative aspect-[4/4] w-full bg-slate-900 overflow-hidden rounded-xs border border-amber-900/15 mb-2.5">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-violet-950/80 flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center mb-1">
                        <Pin className="w-5 h-5 text-violet-300" />
                      </div>
                      <span className="text-[10px] font-typewriter text-amber-100/80 font-bold truncate max-w-[120px]">
                        {member.name.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Polaroid Text Tag */}
                <div className="text-center px-0.5">
                  <p className="font-typewriter text-[11px] font-bold text-amber-950 truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] font-medium text-violet-800 truncate mt-0.5">
                    {member.role}
                  </p>
                </div>

                {/* Handwritten Tag Accent */}
                {member.handwrittenTag && (
                  <div className="absolute -bottom-2 right-2 bg-yellow-100/90 border border-amber-300 px-2 py-0.5 rounded-xs shadow-xs rotate-[3deg]">
                    <span className="font-handwriting text-xs font-bold text-amber-950 leading-none">
                      {member.handwrittenTag}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* ── MOBILE RESPONSIVE GRID OVERLAY ── */}
          <div className="w-full grid grid-cols-2 gap-4 md:hidden relative z-30 pt-16 pb-8">
            {teamMembers.map((member) => (
              <div
                key={`mobile-${member.id}`}
                onClick={() => setSelectedBio(member)}
                className="bg-[#FAF7F2] p-2.5 pb-4 rounded-sm polaroid-card-shadow border border-amber-100/60 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative aspect-square w-full bg-slate-900 rounded-xs overflow-hidden mb-2">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-violet-950 flex flex-col items-center justify-center p-2 text-center">
                      <Pin className="w-5 h-5 text-violet-300 mb-1" />
                      <span className="text-[10px] font-typewriter text-amber-100 font-bold">
                        {member.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-typewriter text-[11px] font-bold text-amber-950 truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-violet-800 font-medium truncate">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PINNED DOSSIER / BIO POPUP MODAL ── */}
      <AnimatePresence>
        {selectedBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedBio(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#FAF7F2] border-2 border-amber-900/30 rounded-lg p-6 sm:p-8 shadow-2xl polaroid-card-shadow-lifted overflow-hidden text-amber-950"
            >
              {/* Push Pin Accent on Note */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border border-amber-900 shadow-md" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedBio(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-200/60 text-amber-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Note Header */}
              <div className="flex items-center gap-2 border-b border-amber-900/20 pb-3 mb-4">
                <FileText className="w-5 h-5 text-violet-800" />
                <div>
                  <span className="font-typewriter text-xs font-bold text-amber-900/70 tracking-widest block uppercase">
                    {selectedBio.dossierNo}
                  </span>
                  <h3 className="font-typewriter text-xl font-bold text-amber-950 leading-tight">
                    {selectedBio.name}
                  </h3>
                </div>
              </div>

              {/* Role Badge */}
              <div className="inline-block bg-violet-900 text-amber-100 text-xs font-typewriter font-semibold px-3 py-1 rounded-xs mb-4 shadow-xs">
                {selectedBio.role}
              </div>

              {/* Quote if available */}
              {selectedBio.quote && (
                <div className="bg-amber-100/70 border-l-4 border-violet-700 p-3 rounded-r-sm mb-4 font-handwriting text-xl text-purple-950 leading-snug">
                  &ldquo;{selectedBio.quote}&rdquo;
                </div>
              )}

              {/* Bio Text */}
              <p className="text-sm font-sans text-amber-950/85 leading-relaxed mb-6">
                {selectedBio.bio}
              </p>

              {/* Footer Stamp */}
              <div className="flex items-center justify-between text-xs font-typewriter text-amber-900/60 pt-3 border-t border-amber-900/15">
                <span>STATUS: VERIFIED</span>
                <span>CPSET RESEARCH LAB</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
