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
  tabTitle = "Administrator: PowerShell",
  path = "PS C:\\Users\\cpset>",
  children,
  className = "",
  bodyClassName = "",
  showPrompt = true,
  promptText,
  statusBadge,
  interactive = true,
}: TerminalCardProps) {
  return (
    <div
      className={`group relative rounded-2xl bg-[#120722]/90 border border-purple-500/30 backdrop-blur-xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-300 ${
        interactive ? "hover:border-purple-400/60 hover:shadow-[0_20px_50px_rgba(147,51,234,0.25)]" : ""
      } ${className}`}
    >
      {/* ── Top Terminal Title/Tab Strip ── */}
      <div className="h-10 bg-[#1b0d36]/95 border-b border-purple-500/25 px-3 flex items-center justify-between select-none shrink-0 font-mono text-xs">
        {/* Left Side: Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {/* Active Tab */}
          <div className="px-3 py-1 bg-[#251347] border-t-2 border-t-purple-400 border-x border-purple-500/30 rounded-t-lg flex items-center gap-2 text-slate-200 text-xs font-semibold shadow-sm max-w-[240px] sm:max-w-xs truncate">
            <Terminal className="w-3.5 h-3.5 text-lime-400 shrink-0" />
            <span className="truncate">{tabTitle}</span>
            <span className="text-slate-400 hover:text-white cursor-pointer ml-1 text-xs">×</span>
          </div>

          {/* New Tab Button */}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-500/20 rounded transition-colors"
            title="New Tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-500/20 rounded transition-colors hidden sm:flex"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side: Window Control Buttons */}
        <div className="flex items-center gap-1">
          {statusBadge && (
            <span className="hidden md:inline-block mr-2 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 border border-purple-500/40 text-purple-300">
              {statusBadge}
            </span>
          )}
          <div className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors">
            <Minus className="w-3 h-3" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors">
            <Square className="w-2.5 h-2.5" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 rounded cursor-pointer transition-colors">
            <X className="w-3 h-3" />
          </div>
        </div>
      </div>

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
