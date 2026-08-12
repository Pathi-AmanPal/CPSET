"use client";

import Link from "next/link";
import FuzzyText from "@/components/ui/FuzzyText";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#050812] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[600px] h-[600px] rounded-full blur-[180px] opacity-20"
          style={{ background: "radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(59,130,246,0.2) 60%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase mb-8"
          style={{ background: "rgba(225,29,72,0.1)", borderColor: "rgba(225,29,72,0.35)", color: "#fda4af" }}>
          <ShieldAlert className="w-4 h-4" />
          ERROR // PAGE NOT FOUND
        </div>

        {/* Fuzzy Text 404 Display */}
        <div className="my-2 cursor-pointer">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.6}
            enableHover={true}
            clickEffect={true}
            color="#e2e8f0"
            gradient={["#818cf8", "#c084fc", "#f43f5e"]}
            fontSize="clamp(5rem, 18vw, 12rem)"
            fontWeight={900}
            fuzzRange={28}
          >
            404
          </FuzzyText>
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-100 mb-3 tracking-tight">
          Target Route Unreachable
        </h2>

        <p className="text-slate-400 font-mono text-sm max-w-md mb-8 leading-relaxed">
          The requested security vector or URL endpoint does not exist or has been relocated to an encrypted partition.
        </p>

        {/* Return Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-sm font-semibold transition-all shadow-lg active:scale-95 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.9) 0%, rgba(79,70,229,0.9) 100%)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to CPSET Core
        </Link>
      </div>
    </main>
  );
}
