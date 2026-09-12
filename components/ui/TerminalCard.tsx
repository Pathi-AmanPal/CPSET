"use client";

import React from "react";
import { Terminal, Settings, X, Plus, Minus, Square } from "lucide-react";

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
  path = "PS C:\\Users\\cpset>",
  children,
  className = "",
  bodyClassName = "",
  showPrompt = true,
  promptText,
  interactive = true,
}: TerminalCardProps) {
  return (
    <div
      className={`group relative rounded-2xl bg-[#120722]/90 border border-purple-500/30 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-300 ${
        interactive ? "hover:border-purple-400/60 hover:shadow-[0_20px_50px_rgba(147,51,234,0.25)]" : ""
      } ${className}`}
    >
      {/* ── Terminal Window Body ── */}
      <div className={`p-6 sm:p-8 flex-1 font-sans text-slate-200 relative ${bodyClassName}`}>
        {/* Optional Prompt Header Line */}
        {showPrompt && (
          <div className="flex items-center gap-2 font-mono text-xs mb-4 text-purple-300/90 select-none">
            <span className="text-purple-400 font-bold">{path}</span>
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
