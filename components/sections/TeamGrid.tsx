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
      {/* Push pin */}
      <div
        style={{
          position: "absolute",
          top: "-14px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 35%, #fde68a, #d97706 60%, #92400e)",
            border: "2px solid #78350f",
            boxShadow: "0 4px 12px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(0,0,0,0.4)" }} />
        </div>
        {/* Pin drop shadow on board */}
        <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: "6px", height: "10px", background: "rgba(0,0,0,0.5)", filter: "blur(2px)", borderRadius: "50%" }} />
      </div>

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
        {/* Washi tape strip */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            width: "50px",
            height: "18px",
            marginLeft: "-25px",
            background: config.tapeColor,
            opacity: 0.82,
            borderRadius: "1px",
            clipPath: "polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)",
            transform: "rotate(-1.5deg)",
            zIndex: 5,
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
            {/* Tape decoration on modal */}
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%) rotate(-2deg)",
                width: "60px",
                height: "20px",
                background: config.tapeColor,
                opacity: 0.75,
                borderRadius: "1px",
                clipPath: "polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)",
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
    <section id="team" className="pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-4"
          style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
          <Sparkles className="w-3.5 h-3.5" />
          CPSET // TEAM BOARD
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3" style={{ color: "#e8ecff" }}>
          Meet the Team
        </h1>
        <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(184,189,214,0.7)" }}>
          Drag the polaroids anywhere on the board.{" "}
          <span className="font-semibold" style={{ color: "#c4b5fd" }}>Click</span> any card to open their dossier.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(184,189,214,0.45)" }}>
          <Move className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
          Drag photos around the board
        </span>
        <button
          onClick={() => { setResetKey((k) => k + 1); setSelected(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer active:scale-95"
          style={{ border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd", background: "rgba(124,58,237,0.08)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.18)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.08)")}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Board */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 0 80px rgba(124,58,237,0.12), 0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        {/* Custom BG image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/case-board-bg.png" alt="" fill className="object-cover object-center" priority unoptimized />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.28) 100%)" }} />
        </div>

        {/* Canvas — NO SVG connectors */}
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
