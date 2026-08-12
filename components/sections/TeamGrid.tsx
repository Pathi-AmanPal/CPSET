"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  FileText,
  Sparkles,
  RotateCcw,
  Move,
} from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA
// ─────────────────────────────────────────────────────────────────────────────
interface MemberType {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio?: string;
  quote?: string;
}

interface PolaroidConfig {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  quote: string;
  tapeColor: string;
  rotation: number;
  badge: string;
  dossierNo: string;
  initialPos: { x: number; y: number };
}

const MENTOR: PolaroidConfig = {
  id: "mentor",
  name: "Syed Irfan",
  role: "Mentor & Patron",
  photo: "/images/team/syed.jpeg",
  bio: "Directing cybersecurity research, privacy engineering, and mentoring CPSET's next-generation threat analysts and security engineers.",
  quote: "Privacy isn't an afterthought — it is the core foundation of every emerging technology.",
  tapeColor: "#C98B2D",
  rotation: -1,
  badge: "MENTOR",
  dossierNo: "CPSET-SUBJECT-01",
  initialPos: { x: 0, y: 0 },
};

const TEAM_MEMBERS: PolaroidConfig[] = [
  {
    id: "member-1",
    name: "Husanpreet Kaur",
    role: "President",
    photo: "/images/team/husanpreet-kaur.png",
    bio: "Directing student research initiatives, privacy preservation frameworks, and core lab operations.",
    quote: "We don't just study vulnerabilities — we architect privacy-first systems.",
    tapeColor: "#7C3AED",
    rotation: -7,
    badge: "PRESIDENT",
    dossierNo: "CPSET-DOSSIER-02",
    initialPos: { x: -310, y: -140 },
  },
  {
    id: "member-2",
    name: "Manya Sharma",
    role: "Vice President",
    photo: "/images/team/manya-sharma.png",
    bio: "Spearheading Zero-Knowledge Proof research and cryptographic protocol implementations.",
    quote: "Mathematical proof is the ultimate truth in digital privacy.",
    tapeColor: "#3B82F6",
    rotation: 8,
    badge: "VICE PRES",
    dossierNo: "CPSET-DOSSIER-03",
    initialPos: { x: 310, y: -140 },
  },
  {
    id: "member-3",
    name: "Pranav Chauhan",
    role: "Red Team & CTF Captain",
    photo: "/images/team/pranav-chauhan.png",
    bio: "Kernel exploit developer & Red Teamer. Winner of national Capture The Flag cybersecurity competitions.",
    quote: "To defend a system, you must think like an adversary.",
    tapeColor: "#C63B3B",
    rotation: 5,
    badge: "RED TEAM",
    dossierNo: "CPSET-DOSSIER-04",
    initialPos: { x: -320, y: 120 },
  },
  {
    id: "member-4",
    name: "Yamiki Chaturvedi",
    role: "AI & ML Security Lead",
    photo: "/images/team/yamiki-chaturvedi.jpeg",
    bio: "Investigating Adversarial AI attacks, prompt injection vectors, and Privacy-Preserving Machine Learning.",
    quote: "As AI advances, securing intelligence itself becomes our greatest challenge.",
    tapeColor: "#0891B2",
    rotation: -10,
    badge: "AI LEAD",
    dossierNo: "CPSET-DOSSIER-05",
    initialPos: { x: 320, y: 120 },
  },
  {
    id: "member-5",
    name: "Dilpreet Kaur",
    role: "Cloud & DevSecOps",
    photo: "/images/team/dilpreet-kaur.jpeg",
    bio: "Architecting automated threat detection pipelines, Kubernetes security policies, and DevSecOps frameworks.",
    quote: "Automation without continuous security is just automated risk.",
    tapeColor: "#059669",
    rotation: 11,
    badge: "CLOUD SEC",
    dossierNo: "CPSET-DOSSIER-06",
    initialPos: { x: -160, y: 280 },
  },
  {
    id: "member-6",
    name: "Shaan XD",
    role: "Network Security & Forensics",
    photo: "/images/team/shaan-xd.jpg",
    bio: "Specializing in deep packet inspection, incident response, and memory forensics for enterprise systems.",
    quote: "Every digital action leaves a trace behind.",
    tapeColor: "#9333EA",
    rotation: -6,
    badge: "FORENSICS",
    dossierNo: "CPSET-DOSSIER-07",
    initialPos: { x: 160, y: 280 },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DRAGGABLE POLAROID CARD (exact same pointer mechanic as SECURE Club)
// ─────────────────────────────────────────────────────────────────────────────
function PolaroidCard({
  config,
  isMentor = false,
  resetKey,
  onPinRef,
  onClick,
}: {
  config: PolaroidConfig;
  isMentor?: boolean;
  resetKey: number;
  onPinRef?: (el: HTMLDivElement | null) => void;
  onClick: (config: PolaroidConfig) => void;
}) {
  const [pos, setPos] = useState(config.initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Reset position when resetKey changes
  useEffect(() => {
    setPos(config.initialPos);
  }, [resetKey, config.initialPos]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...pos };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - dragStartRef.current.x;
      const dy = moveEvt.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      setPos({
        x: posStartRef.current.x + dx,
        y: posStartRef.current.y + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleClick = () => {
    if (!hasMovedRef.current) {
      onClick(config);
    }
  };

  const cardWidth = isMentor ? "w-[200px] sm:w-[220px]" : "w-[155px] sm:w-[170px]";
  const photoAspect = isMentor ? "aspect-[4/4.5]" : "aspect-[4/4]";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: isMentor ? "-120px" : "-85px",
        marginLeft: isMentor ? "-110px" : "-82px",
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${config.rotation}deg)`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 50 : isMentor ? 25 : 15,
        transition: isDragging ? "none" : "box-shadow 0.2s ease",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={`select-none ${isDragging ? "scale-[1.04] drop-shadow-2xl" : "hover:scale-[1.03] hover:drop-shadow-xl"} transition-transform duration-200`}
    >
      {/* Push Pin */}
      <div
        ref={onPinRef}
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-amber-800 shadow-[0_4px_10px_rgba(0,0,0,0.9)] flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fde68a, #d97706 70%)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-amber-950/70" />
        </div>
        {/* Pin shadow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-3 bg-black/60 blur-[1px] rounded-b-full" />
      </div>

      {/* Polaroid Card */}
      <div
        className={`${cardWidth} bg-[#F8F8F8] p-2.5 pb-4 rounded-[2px] border border-stone-300 shadow-lg relative`}
      >
        {/* Tape */}
        <div
          className="absolute -top-3 left-1/2 z-20 pointer-events-none"
          style={{
            width: "52px",
            height: "18px",
            marginLeft: "-26px",
            backgroundColor: config.tapeColor,
            opacity: 0.88,
            clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
            transform: "rotate(-2deg)",
          }}
        />

        {/* Photo area */}
        <div className={`relative ${photoAspect} bg-stone-900 overflow-hidden border border-stone-200`}>
          <Image
            src={config.photo}
            alt={config.name}
            fill
            className="object-cover object-top contrast-[1.04]"
            unoptimized
            draggable={false}
          />
          {/* Badge */}
          <span className="absolute top-1.5 right-1.5 font-mono text-[9px] bg-black/85 text-amber-400 px-1.5 py-0.5 tracking-wider">
            {config.badge}
          </span>
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Label */}
        <div className="mt-2.5 text-center px-1">
          <h4
            className="font-mono font-bold text-stone-900 leading-tight tracking-wide uppercase"
            style={{ fontSize: isMentor ? "13px" : "11px" }}
          >
            {config.name}
          </h4>
          <p className="font-mono text-[9px] text-stone-500 tracking-wider mt-0.5">{config.role}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOSSIER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DossierModal({
  config,
  onClose,
}: {
  config: PolaroidConfig | null;
  onClose: () => void;
}) {
  if (!config) return null;

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          key="dossier-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            key="dossier-card"
            initial={{ scale: 0.88, opacity: 0, y: 24, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg bg-[#FAF7F2] border-2 border-amber-900/25 rounded-md p-6 sm:p-8 shadow-2xl text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Push Pin */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-amber-800 shadow-lg flex items-center justify-center"
              style={{ background: "radial-gradient(circle at 35% 35%, #fde68a, #d97706 70%)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-950/70" />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 border-b border-amber-900/15 pb-4 mb-4">
              <FileText className="w-5 h-5 text-violet-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-mono text-[10px] font-bold text-amber-900/60 tracking-widest block uppercase mb-0.5">
                  {config.dossierNo}
                </span>
                <h3 className="font-mono text-xl font-extrabold text-stone-900 leading-tight">
                  {config.name}
                </h3>
              </div>
            </div>

            {/* Role chip */}
            <div
              className="inline-block text-white text-[10px] font-mono font-bold px-3 py-1 rounded-sm tracking-widest mb-4"
              style={{ backgroundColor: "#4C1D95" }}
            >
              {config.role}
            </div>

            {/* Quote */}
            {config.quote && (
              <blockquote className="border-l-4 border-violet-700 bg-amber-50 pl-3 pr-2 py-2.5 rounded-r-sm mb-4 font-mono italic text-stone-700 text-[13px] leading-relaxed">
                &ldquo;{config.quote}&rdquo;
              </blockquote>
            )}

            {/* Bio */}
            <p className="text-sm text-stone-700 leading-relaxed mb-5">{config.bio}</p>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 tracking-widest pt-3 border-t border-amber-900/10">
              <span>STATUS: VERIFIED</span>
              <span>CPSET — {new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEAM SECTION
// ─────────────────────────────────────────────────────────────────────────────
export default function TeamGrid() {
  const [selectedCard, setSelectedCard] = useState<PolaroidConfig | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [stringPaths, setStringPaths] = useState<{ id: string; d: string }[]>([]);

  const boardRef = useRef<HTMLDivElement>(null);
  const mentorPinRef = useRef<HTMLDivElement | null>(null);
  const memberPinRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Live SVG connector recalculation via RAF
  const updateStrings = useCallback(() => {
    if (!boardRef.current || !mentorPinRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const mpRect = mentorPinRef.current.getBoundingClientRect();
    const mX = mpRect.left + mpRect.width / 2 - boardRect.left;
    const mY = mpRect.top + mpRect.height / 2 - boardRect.top;

    const paths: { id: string; d: string }[] = [];

    TEAM_MEMBERS.forEach((member) => {
      const pinEl = memberPinRefs.current.get(member.id);
      if (!pinEl) return;

      const pRect = pinEl.getBoundingClientRect();
      const pX = pRect.left + pRect.width / 2 - boardRect.left;
      const pY = pRect.top + pRect.height / 2 - boardRect.top;

      const dist = Math.hypot(pX - mX, pY - mY);
      const sag = Math.min(60, dist * 0.15);
      const midX = (mX + pX) / 2;
      const midY = (mY + pY) / 2 + sag;

      paths.push({
        id: member.id,
        d: `M ${mX} ${mY} Q ${midX} ${midY} ${pX} ${pY}`,
      });
    });

    setStringPaths(paths);
  }, []);

  useEffect(() => {
    let rafId: number;
    const loop = () => {
      updateStrings();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    window.addEventListener("resize", updateStrings);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateStrings);
    };
  }, [updateStrings, resetKey]);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setSelectedCard(null);
  };

  return (
    <section id="team" className="pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Section Header ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          CPSET // INVESTIGATION BOARD
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3">
          Meet the Team
        </h1>
        <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Every thread leads back to our Mentor,{" "}
          <span className="text-violet-300 font-semibold">Syed Irfan</span>.
          Drag the polaroids around the board and click to open a dossier.
        </p>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="flex items-center gap-2 text-xs text-white/40 font-mono">
          <Move className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">Drag photos around the board</span>
          <span className="sm:hidden">Drag to reposition</span>
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-500/30 text-violet-300 text-xs font-mono hover:bg-violet-900/40 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* ── BOARD (custom background image) ── */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/60">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/case-board-bg.png"
            alt="CPSET Case Board"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
          {/* Subtle top/bottom gradients to blend with page */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* Canvas — all cards live here */}
        <div
          ref={boardRef}
          className="relative min-h-[780px] md:min-h-[860px] w-full overflow-hidden z-10"
          style={{ touchAction: "none" }}
        >
          {/* Live SVG connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            <defs>
              <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C026D3" />
                <stop offset="50%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>

            {stringPaths.map(({ id, d }) => (
              <g key={id}>
                {/* Glow halo */}
                <path d={d} fill="none" stroke="rgba(192,38,211,0.5)" strokeWidth="7" strokeLinecap="round" filter="url(#lineGlow)" />
                {/* Core thread */}
                <path d={d} fill="none" stroke="url(#threadGrad)" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ))}
          </svg>

          {/* ── Mentor card (Syed Irfan) — center ── */}
          <PolaroidCard
            key={`mentor-${resetKey}`}
            config={MENTOR}
            isMentor
            resetKey={resetKey}
            onPinRef={(el) => { mentorPinRef.current = el; }}
            onClick={setSelectedCard}
          />

          {/* ── Team member cards — scattered ── */}
          {TEAM_MEMBERS.map((member) => (
            <PolaroidCard
              key={`${member.id}-${resetKey}`}
              config={member}
              isMentor={false}
              resetKey={resetKey}
              onPinRef={(el) => {
                if (el) memberPinRefs.current.set(member.id, el);
                else memberPinRefs.current.delete(member.id);
              }}
              onClick={setSelectedCard}
            />
          ))}

          {/* ── Mobile: stack layout below cards ── */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4 md:hidden z-30">
            {[MENTOR, ...TEAM_MEMBERS].map((m) => (
              <button
                key={`pill-${m.id}`}
                onClick={() => setSelectedCard(m)}
                className="text-[10px] font-mono text-white/70 bg-black/60 border border-purple-500/30 px-2.5 py-1 rounded-full hover:bg-purple-900/50 transition-colors"
              >
                {m.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dossier Modal */}
      <DossierModal config={selectedCard} onClose={() => setSelectedCard(null)} />
    </section>
  );
}
