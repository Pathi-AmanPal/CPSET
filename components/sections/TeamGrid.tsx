"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Sparkles, RotateCcw, Move } from "lucide-react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// TEAM DATA
// ─────────────────────────────────────────────────────────────────────────────
interface PolaroidConfig {
  id: string;
  name: string;
  role: string;
  department?: string;
  photo?: string;
  bio: string;
  quote?: string;
  tapeColor: string;
  rotation: number;
  badge: string;
  dossierNo: string;
  initialPos: { x: number; y: number };
  teamMembers?: string[];
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

const MENTOR: PolaroidConfig = {
  id: "mentor",
  name: "Dr. Syed Irfan",
  role: "CPSET Coordinator",
  photo: "/images/team/syed.jpeg",
  bio: "Directing cybersecurity research, privacy engineering, and coordinating CPSET's next-generation threat analysts and security engineers.",
  quote: "Privacy isn't an afterthought — it is the core foundation of every emerging technology.",
  tapeColor: "#C98B2D",
  rotation: -1,
  badge: "MENTOR",
  dossierNo: "CPSET-SUBJECT-01",
  initialPos: { x: 0, y: -10 },
};

const TEAM_MEMBERS: PolaroidConfig[] = [
  {
    id: "m-president",
    name: "Husanpreet Kaur",
    role: "Secretary",
    photo: "/images/team/husanpreet-kaur.png",
    bio: "Directing overall student leadership, strategic vision, research initiatives, and core lab operations.",
    quote: "We don't just study vulnerabilities — we architect privacy-first systems.",
    tapeColor: "#7C3AED",
    rotation: -6,
    badge: "SECRETARY",
    dossierNo: "CPSET-DOSSIER-01",
    initialPos: { x: -210, y: -10 },
  },
  {
    id: "m-webmaster",
    name: "Pathi Aman Pal",
    role: "Web Master Lead",
    photo: "/images/team/Pathi_Aman_Pal.png",
    bio: "Leading full-stack web architecture, system infrastructure, and interactive digital interfaces for CPSET platforms.",
    tapeColor: "#3B82F6",
    rotation: 5,
    badge: "WEB MASTER",
    dossierNo: "CPSET-DOSSIER-02",
    initialPos: { x: -360, y: -240 },
    teamMembers: ["Pullagura Mahan Shashank Yadav", "Rahul Jaluthria", "Pankaj Saini"],
  },
  {
    id: "m-technical",
    name: "Harish Soni",
    role: "Technical Lead",
    photo: "",
    bio: "Directing technical operations, exploit analysis, vulnerability research, and Capture The Flag competitions.",
    tapeColor: "#DC2626",
    rotation: -4,
    badge: "TECHNICAL",
    dossierNo: "CPSET-DOSSIER-03",
    initialPos: { x: -120, y: -240 },
    teamMembers: ["Pankaj Saini", "Nayan Jain"],
  },
  {
    id: "m-social",
    name: "Manya Sharma",
    role: "Social Media Lead",
    photo: "/images/team/manya-sharma.png",
    bio: "Directing digital outreach, community engagement, brand identity, and social media presence.",
    quote: "Connecting the cybersecurity community through clear, powerful digital narratives.",
    tapeColor: "#EC4899",
    rotation: 7,
    badge: "SOCIAL MEDIA",
    dossierNo: "CPSET-DOSSIER-04",
    initialPos: { x: 120, y: -240 },
    teamMembers: ["Shaan", "Rahul Jaluthria"],
  },
  {
    id: "m-discipline",
    name: "Yuvi Booti",
    role: "Discipline Lead",
    photo: "",
    bio: "Ensuring operational standards, event discipline, ethical protocols, and organizational coordination.",
    tapeColor: "#0891B2",
    rotation: -7,
    badge: "DISCIPLINE",
    dossierNo: "CPSET-DOSSIER-05",
    initialPos: { x: -390, y: 0 },
    teamMembers: ["Arshdeep Singh", "Yamiki Chaturvedi", "Aditya Jha"],
  },
  {
    id: "m-management",
    name: "Ridhima Gulati",
    role: "Management Lead",
    photo: "",
    bio: "Managing event logistics, organizational planning, cross-functional coordination, and core workflows.",
    tapeColor: "#F59E0B",
    rotation: 6,
    badge: "MANAGEMENT",
    dossierNo: "CPSET-DOSSIER-06",
    initialPos: { x: 390, y: 0 },
    teamMembers: ["Jeavi", "Pranav Chauhan", "Jashanpreet Kaur"],
  },
  {
    id: "m-content",
    name: "Dilpreet Kaur",
    role: "Content Writing Lead",
    photo: "/images/team/dilpreet-kaur.jpeg",
    bio: "Overseeing technical documentation, cybersecurity articles, research publications, and official communications.",
    quote: "Precision in words is as crucial as precision in code.",
    tapeColor: "#059669",
    rotation: -5,
    badge: "CONTENT",
    dossierNo: "CPSET-DOSSIER-07",
    initialPos: { x: -360, y: 240 },
    teamMembers: ["Shaan"],
  },
  {
    id: "m-sponsorship",
    name: "Gopal Thakur",
    role: "Sponsorship Lead",
    photo: "",
    bio: "Managing industry partnerships, corporate sponsorships, vendor relations, and resource acquisition.",
    tapeColor: "#10B981",
    rotation: 4,
    badge: "SPONSORSHIP",
    dossierNo: "CPSET-DOSSIER-08",
    initialPos: { x: 360, y: -240 },
    teamMembers: ["Sukhwinder Singh", "Gagandeep Kaur"],
  },
  {
    id: "m-anchoring",
    name: "Prince Khatana",
    role: "Anchoring Lead",
    photo: "",
    bio: "Leading event hosting, keynote introductions, stage announcements, and public presentation.",
    tapeColor: "#8B5CF6",
    rotation: 6,
    badge: "ANCHORING",
    dossierNo: "CPSET-DOSSIER-09",
    initialPos: { x: -120, y: 240 },
    teamMembers: ["Sumit Chauhan", "Ansh Rana", "Yamiki Chaturvedi"],
  },
  {
    id: "m-joint-secretary",
    name: "Avneet Kaur",
    role: "Joint Secretary",
    photo: "/images/team/Avneet_kaur.png",
    bio: "Supporting strategic operations, coordinating between departments, and ensuring seamless communication across all CPSET activities and initiatives.",
    quote: "Collaboration and clarity are the backbone of every strong organization.",
    tapeColor: "#BE185D",
    rotation: -3,
    badge: "JOINT SEC",
    dossierNo: "CPSET-DOSSIER-10",
    initialPos: { x: 210, y: -10 },
  },
  {
    id: "m-graphics",
    name: "Harshit Narang",
    role: "Graphics Lead",
    photo: "/images/team/Harshit_Narang.png",
    bio: "Directing visual design, creative identity, brand assets, and digital media graphics for CPSET projects and events.",
    quote: "Translating complex cybersecurity concepts into compelling visual experiences.",
    tapeColor: "#F43F5E",
    rotation: -5,
    badge: "GRAPHICS",
    dossierNo: "CPSET-DOSSIER-11",
    initialPos: { x: 380, y: 240 },
    teamMembers: ["Avneet Singh"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// POLAROID CARD — Apple-physics drag (pointer events, velocity-aware)
// ─────────────────────────────────────────────────────────────────────────────
function PolaroidCard({
  config,
  isMentor = false,
  resetKey,
  onClick,
}: {
  config: PolaroidConfig;
  isMentor?: boolean;
  resetKey: number;
  onClick: (c: PolaroidConfig) => void;
}) {
  const [pos, setPos] = useState(config.initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  // Velocity tracking (Apple design: velocity handoff)
  const velHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

  // Reset when board resets
  useEffect(() => {
    setPos(config.initialPos);
  }, [resetKey, config.initialPos]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    hasMovedRef.current = false;
    velHistoryRef.current = [];
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...pos };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMovedRef.current = true;

    const now = performance.now();
    velHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: now });
    // Keep only last 80ms of history
    velHistoryRef.current = velHistoryRef.current.filter((v) => now - v.t < 80);

    setPos({ x: posStartRef.current.x + dx, y: posStartRef.current.y + dy });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // No snap-back — card stays where released (corkboard behavior)
  };

  const handleClick = () => {
    if (!hasMovedRef.current) onClick(config);
  };

  const w = isMentor ? 185 : 145;
  const marginL = -(w / 2);
  const marginT = isMentor ? -104 : -82;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${w}px`,
        marginTop: `${marginT}px`,
        marginLeft: `${marginL}px`,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${isDragging ? 0 : isHovered ? config.rotation * 0.4 : config.rotation}deg) scale(${isDragging ? 1.06 : isHovered ? 1.03 : 1})`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 60 : isMentor ? 20 : 10,
        willChange: "transform",
        // Apple: smooth settle via transition only when NOT dragging
        transition: isDragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
        // Layered shadow — crisp near, diffused far (Apple depth cue)
        filter: isDragging
          ? "drop-shadow(0 20px 40px rgba(0,0,0,0.7)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
          : isHovered
          ? "drop-shadow(0 12px 28px rgba(0,0,0,0.6)) drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
          : "drop-shadow(0 6px 18px rgba(0,0,0,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
      }}
      className="select-none"
    >
      {/* Polaroid frame */}
      <div
        style={{
          background: "#F9F7F4",
          padding: isMentor ? "8px 8px 15px" : "7px 7px 12px",
          borderRadius: "2px",
          border: "1px solid rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Glassmorphic Sticker (Teal/Cyan gradient pill) */}
        <div
          style={{
            position: "absolute",
            top: "-9px",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMentor ? "48px" : "40px",
            height: "18px",
            borderRadius: "9px",
            background: "linear-gradient(180deg, rgba(17, 78, 96, 0.95) 0%, rgba(60, 160, 181, 0.9) 55%, rgba(139, 216, 232, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.45)",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 15,
            pointerEvents: "none",
          }}
        />

        {/* Photo area */}
        <div
          style={{
            position: "relative",
            aspectRatio: isMentor ? "4/4.5" : "4/4",
            background: "#0d1326",
            overflow: "hidden",
            borderRadius: "1px",
          }}
        >
          {config.photo && !imgError ? (
            <Image
              src={config.photo}
              alt={config.name}
              fill
              className="object-cover object-top"
              unoptimized
              draggable={false}
              onError={() => setImgError(true)}
              style={{ filter: "contrast(1.04) saturate(1.05)" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-2 text-center select-none">
              <div className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-400/35 flex items-center justify-center text-indigo-300 font-mono font-bold text-sm mb-1 shadow-inner">
                {getInitials(config.name)}
              </div>
              <span className="font-mono text-[8px] text-indigo-300/60 uppercase tracking-widest">CPSET LEAD</span>
            </div>
          )}
          {/* Badge chip (top-right) */}
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              background: "rgba(0,0,0,0.85)",
              color: "#fbbf24",
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "2px 6px",
              borderRadius: "2px",
              zIndex: 10,
            }}
          >
            {config.badge}
          </span>
          {/* Bottom vignette */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 50%)", pointerEvents: "none" }} />
        </div>

        {/* Label */}
        <div style={{ marginTop: "8px", textAlign: "center", padding: "0 4px" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: isMentor ? "13px" : "10.5px",
              color: "#1c1917",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
              marginBottom: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {config.name}
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "#78716c",
              letterSpacing: "0.06em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {config.role}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOSSIER MODAL — Apple spring entry/exit
// ─────────────────────────────────────────────────────────────────────────────
function DossierModal({ config, onClose }: { config: PolaroidConfig | null; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    if (!config) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [config, onClose]);

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        >
          <motion.div
            key="card"
            // Apple: enter from source (scale + y), spring-settle with no overshoot
            initial={{ scale: 0.88, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 16 }}
            transition={{ type: "spring", bounce: 0, duration: 0.38 }}
            className="relative w-full max-w-md"
            style={{
              background: "#FAF8F5",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "4px",
              padding: "32px 28px 28px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.3)",
              color: "#1c1917",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphic Sticker on modal */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "56px",
                height: "20px",
                borderRadius: "10px",
                background: "linear-gradient(180deg, rgba(17, 78, 96, 0.95) 0%, rgba(60, 160, 181, 0.9) 55%, rgba(139, 216, 232, 0.95) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.65)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer"
              style={{ fontSize: "14px" }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dossier header */}
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "12px", marginBottom: "14px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: "#a8a29e", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                {config.dossierNo}
              </span>
              <h3 style={{ fontFamily: "monospace", fontSize: "22px", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.1, color: "#1c1917" }}>
                {config.name}
              </h3>
            </div>

            {/* Role pill */}
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fff",
                background: config.tapeColor,
                marginBottom: "14px",
              }}
            >
              {config.role}
            </span>

            {/* Quote */}
            {config.quote && (
              <div
                style={{
                  borderLeft: `3px solid ${config.tapeColor}`,
                  paddingLeft: "12px",
                  marginBottom: "14px",
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "13.5px",
                  lineHeight: 1.55,
                  color: "#44403c",
                }}
              >
                &ldquo;{config.quote}&rdquo;
              </div>
            )}

            {/* Bio */}
            <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#57534e", marginBottom: "16px" }}>
              {config.bio}
            </p>

            {/* Department Team Members */}
            {config.teamMembers && config.teamMembers.length > 0 && (
              <div style={{ marginBottom: "20px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                <span style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#78716c", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  DEPARTMENT OPERATORS ({config.teamMembers.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {config.teamMembers.map((m, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "10.5px",
                        background: "rgba(0,0,0,0.05)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        padding: "3px 9px",
                        borderRadius: "3px",
                        color: "#44403c",
                        fontWeight: 600,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: "9px", color: "#a8a29e", letterSpacing: "0.1em", borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "12px" }}>
              <span>STATUS: VERIFIED</span>
              <span>CPSET // {new Date().getFullYear()}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — Team Section
// ─────────────────────────────────────────────────────────────────────────────
export default function TeamGrid() {
  const [selected, setSelected] = useState<PolaroidConfig | null>(null);
  const [resetKey, setResetKey] = useState(0);

  return (
    <section id="team" className="relative py-6 md:py-8 overflow-hidden">
      {/* ── Investigation Room Background Environment ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Room Base Surface */}
        <div className="absolute inset-0 bg-[#050713]" />

        {/* Ambient Spotlights: Purple Flash from Right + Cobalt Glow from Left */}
        <div
          className="absolute -top-20 -right-20 w-[800px] h-[800px] rounded-full blur-[160px] opacity-70"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.28) 0%, rgba(147,51,234,0.15) 50%, transparent 80%)" }}
        />
        <div
          className="absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full blur-[150px] opacity-60"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(37,99,235,0.10) 50%, transparent 80%)" }}
        />

        {/* Cyber Digital Wall Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "linear-gradient(rgba(147,51,234,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Dark Room Edge Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,19,0.92) 100%)" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-4"
            style={{ background: "rgba(192,38,211,0.10)", borderColor: "rgba(192,38,211,0.35)", color: "#e879f9" }}>
            <Sparkles className="w-3.5 h-3.5" />
            CPSET // INVESTIGATION ROOM
          </div>
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3" style={{ color: "#e8ecff" }}>
            Meet the Team
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(184,189,214,0.7)" }}>
            Drag the polaroids anywhere on the investigation board.{" "}
            <span className="font-semibold" style={{ color: "#e879f9" }}>Click</span> any card to open their dossier.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(184,189,214,0.45)" }}>
            <Move className="w-3.5 h-3.5" style={{ color: "#c084fc" }} />
            Drag photos around the board
          </span>
          <button
            onClick={() => { setResetKey((k) => k + 1); setSelected(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer active:scale-95"
            style={{ border: "1px solid rgba(192,38,211,0.3)", color: "#f0abfc", background: "rgba(192,38,211,0.1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(192,38,211,0.22)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(192,38,211,0.1)")}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* ── Investigation Board (Blended with room) ── */}
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-300"
          style={{
            border: "1px solid rgba(168,85,247,0.30)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 50px rgba(192,38,211,0.18), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Corkboard Base Image */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/case-board-bg.png" alt="Investigation Board" fill className="object-cover object-center" priority unoptimized />
            
            {/* Purple Flashlight Overlay from Right Side */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 75% 100% at 100% 45%, rgba(192, 38, 211, 0.40) 0%, rgba(147, 51, 234, 0.22) 35%, rgba(99, 102, 241, 0.08) 65%, transparent 100%)",
              }}
            />

            {/* Inner Edge Blending Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(5,7,19,0.88) 100%), linear-gradient(to bottom, rgba(5,7,19,0.4) 0%, transparent 20%, transparent 80%, rgba(5,7,19,0.5) 100%)" }}
            />
          </div>

          {/* Canvas */}
          <div
            className="relative z-10"
            style={{ minHeight: "880px", touchAction: "none" }}
          >
          {/* Mentor card */}
          <PolaroidCard
            key={`mentor-${resetKey}`}
            config={MENTOR}
            isMentor
            resetKey={resetKey}
            onClick={setSelected}
          />

          {/* Team member cards */}
          {TEAM_MEMBERS.map((m) => (
            <PolaroidCard
              key={`${m.id}-${resetKey}`}
              config={m}
              resetKey={resetKey}
              onClick={setSelected}
            />
          ))}

          {/* Mobile quick-access pills */}
          <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4 md:hidden z-40">
            {[MENTOR, ...TEAM_MEMBERS].map((m) => (
              <button
                key={`pill-${m.id}`}
                onClick={() => setSelected(m)}
                className="text-[10px] font-mono px-3 py-1 rounded-full cursor-pointer transition-colors"
                style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(124,58,237,0.35)", color: "rgba(255,255,255,0.7)" }}
              >
                {m.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

      {/* Dossier modal */}
      <DossierModal config={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
