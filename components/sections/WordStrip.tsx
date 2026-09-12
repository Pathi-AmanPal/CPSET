"use client";

const WORDS = [
  "PRIVACY",
  "SECURITY",
  "INNOVATION",
  "RESEARCH",
  "EXCELLENCE",
  "DIGITAL FORENSICS",
  "AI SECURITY",
  "CLOUD SECURITY",
  "IOT SECURITY",
  "ETHICAL HACKING",
  "THREAT INTELLIGENCE",
  "BLOCKCHAIN SECURITY",
];

export default function WordStrip() {
  const content = WORDS.join("  ✦  ") + "  ✦  ";

  return (
    <div className="py-3.5 border-y border-[#5A8AFF]/20 bg-black/50 overflow-hidden backdrop-blur-md select-none">
      <div className="flex w-max animate-marquee font-mono text-xs sm:text-sm font-bold tracking-[0.2em] text-cyan-300">
        <span className="shrink-0 px-2">{content}</span>
        <span className="shrink-0 px-2">{content}</span>
      </div>
    </div>
  );
}
