"use client";

import React from "react";
import { Terminal } from "lucide-react";

interface TerminalCardProps {
  title?: string;
  tabTitle?: string;
  path?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  showPrompt?: boolean;
  promptText?: string;
  statusBadge?: string;
  interactive?: boolean;
}

export default function TerminalCard({
  title,
  path = "PS C:\\CPSET\\NODE_01>",
  children,
  className = "",
  bodyClassName = "",
  showPrompt = true,
  promptText,
  statusBadge = "ONLINE // OK",
  interactive = true,
}: TerminalCardProps) {
  return (
    <div
      className={`group relative rounded-2xl bg-[#090515]/95 border border-purple-500/30 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col transition-all duration-300 ${
        interactive ? "hover:border-cyan-400/60 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)]" : ""
      } ${className}`}
    >
      {/* Background CRT scanlines effect */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)"
        }}
      />

      {/* Top right subtle status tag */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-cyan-400/70 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{statusBadge}</span>
      </div>

      {/* ── Terminal Window Body ── */}
      <div className={`p-6 sm:p-8 flex-1 font-sans text-slate-200 relative z-10 ${bodyClassName}`}>
        {/* Optional Prompt Header Line */}
        {showPrompt && (
          <div className="flex items-center gap-2 font-mono text-xs mb-4 text-purple-300/90 select-none">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-cyan-400 font-bold tracking-tight">{path}</span>
            {promptText ? (
              <span className="text-lime-300 font-medium">{promptText}</span>
            ) : null}
            <span className="inline-block w-2.5 h-4 bg-lime-400 animate-pulse shadow-[0_0_8px_#a3e635]" />
          </div>
        )}

        {/* Card Title if supplied */}
        {title && (
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight mb-3">
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
}

