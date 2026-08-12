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
    id: "m1",
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
    id: "m2",
    name: "Manya Sharma",
    role: "Vice President",
    photo: "/images/team/manya-sharma.png",
    bio: "Spearheading Zero-Knowledge Proof research and cryptographic protocol implementations.",
    quote: "Mathematical proof is the ultimate truth in digital privacy.",
    tapeColor: "#2563EB",
    rotation: 8,
    badge: "VICE PRES",
    dossierNo: "CPSET-DOSSIER-03",
    initialPos: { x: 310, y: -140 },
  },
  {
    id: "m3",
    name: "Pranav Chauhan",
    role: "Red Team & CTF Captain",
    photo: "/images/team/pranav-chauhan.png",
    bio: "Kernel exploit developer & Red Teamer. Winner of national Capture The Flag cybersecurity competitions.",
    quote: "To defend a system, you must think like an adversary.",
    tapeColor: "#DC2626",
    rotation: 5,
    badge: "RED TEAM",
    dossierNo: "CPSET-DOSSIER-04",
    initialPos: { x: -320, y: 130 },
  },
  {
    id: "m4",
    name: "Yamiki Chaturvedi",
    role: "AI & ML Security Lead",
    photo: "/images/team/yamiki-chaturvedi.jpeg",
    bio: "Investigating Adversarial AI attacks, prompt injection vectors, and Privacy-Preserving Machine Learning.",
    quote: "As AI advances, securing intelligence itself becomes our greatest challenge.",
    tapeColor: "#0891B2",
    rotation: -10,
    badge: "AI LEAD",
    dossierNo: "CPSET-DOSSIER-05",
    initialPos: { x: 320, y: 130 },
  },
  {
    id: "m5",
    name: "Dilpreet Kaur",
    role: "Cloud & DevSecOps",
    photo: "/images/team/dilpreet-kaur.jpeg",
    bio: "Architecting automated threat detection pipelines, Kubernetes security policies, and DevSecOps frameworks.",
    quote: "Automation without continuous security is just automated risk.",
    tapeColor: "#059669",
    rotation: 11,
    badge: "CLOUD SEC",
    dossierNo: "CPSET-DOSSIER-06",
    initialPos: { x: -160, y: 290 },
  },
  {
    id: "m6",
    name: "Shaan XD",
    role: "Network Security & Forensics",
    photo: "/images/team/shaan-xd.jpg",
    bio: "Specializing in deep packet inspection, incident response, and memory forensics for enterprise systems.",
    quote: "Every digital action leaves a trace behind.",
    tapeColor: "#9333EA",
    rotation: -6,
    badge: "FORENSICS",
    dossierNo: "CPSET-DOSSIER-07",
    initialPos: { x: 160, y: 290 },
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

  const w = isMentor ? 210 : 165;
  const marginL = -(w / 2);
  const marginT = isMentor ? -120 : -95;

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
          padding: isMentor ? "10px 10px 18px" : "8px 8px 14px",
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
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: isMentor ? "56px" : "48px",
            height: "20px",
            borderRadius: "10px",
            background: "linear-gradient(180deg, rgba(17, 78, 96, 0.95) 0%, rgba(60, 160, 181, 0.9) 55%, rgba(139, 216, 232, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.45)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.65)",
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
            background: "#1a1a2e",
            overflow: "hidden",
            borderRadius: "1px",
          }}
        >
          <Image
            src={config.photo}
            alt={config.name}
            fill
            className="object-cover object-top"
            unoptimized
            draggable={false}
            style={{ filter: "contrast(1.04) saturate(1.05)" }}
          />
          {/* Badge chip (top-right) */}
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              background: "rgba(0,0,0,0.82)",
              color: "#fbbf24",
              fontFamily: "monospace",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "2px 6px",
              borderRadius: "2px",
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
            <p style={{ fontSize: "13px", lineHeight: 1.65, color: "#57534e", marginBottom: "20px" }}>
              {config.bio}
            </p>

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
    <section id="team" className="relative pt-24 md:pt-32 pb-24 overflow-hidden">
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
            style={{ minHeight: "780px", touchAction: "none" }}
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

      {/* Dossier modal */}
      <DossierModal config={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
