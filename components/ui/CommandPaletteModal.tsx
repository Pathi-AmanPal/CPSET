"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Shield, Terminal, Users, Calendar, Award, Mail, ExternalLink, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Sections" | "Admin";
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export default function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items: CommandItem[] = [
    {
      id: "home",
      title: "CPSET Main Portal",
      category: "Navigation",
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      action: () => { router.push("/"); onClose(); },
      badge: "Home"
    },
    {
      id: "vision-mission",
      title: "Vision & Mission Statement",
      category: "Sections",
      icon: <Terminal className="w-4 h-4 text-violet-400" />,
      action: () => { router.push("/vision-mission"); onClose(); },
      badge: "Page"
    },
    {
      id: "objectives",
      title: "Research Objectives & Domains",
      category: "Sections",
      icon: <Terminal className="w-4 h-4 text-blue-400" />,
      action: () => { router.push("/objectives"); onClose(); },
      badge: "Page"
    },
    {
      id: "team",
      title: "Investigation Room & Core Team",
      category: "Sections",
      icon: <Users className="w-4 h-4 text-amber-400" />,
      action: () => { router.push("/team"); onClose(); },
      badge: "Page"
    },
    {
      id: "events",
      title: "Events & Steganography Workshop",
      category: "Sections",
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      action: () => { router.push("/events"); onClose(); },
      badge: "Page"
    },
    {
      id: "achievements",
      title: "CPSET Achievements & Honors",
      category: "Sections",
      icon: <Award className="w-4 h-4 text-yellow-400" />,
      action: () => { router.push("/achievements"); onClose(); },
      badge: "Page"
    },
    {
      id: "connect",
      title: "Connect & Cyber Terminal",
      category: "Sections",
      icon: <Mail className="w-4 h-4 text-rose-400" />,
      action: () => { router.push("/connect"); onClose(); },
      badge: "Page"
    },
    {
      id: "admin",
      title: "Admin Command Center",
      category: "Admin",
      icon: <KeyRound className="w-4 h-4 text-cyan-300" />,
      action: () => { router.push("/admin/login"); onClose(); },
      badge: "Protected"
    }
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered outside
        }
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        filteredItems[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl bg-[#090C1E]/95 border border-[#5A8AFF]/30 rounded-2xl shadow-[0_0_50px_rgba(90,138,255,0.25)] overflow-hidden z-10 font-mono text-sm"
        >
          {/* Header Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#5A8AFF]/15 bg-[#0C1029]/80">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search CPSET command matrix... (Esc to exit)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-sans"
            />
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[340px] overflow-y-auto p-2 divide-y divide-white/5">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-sans">
                No CPSET command nodes found matching &quot;{query}&quot;
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                      isSelected
                        ? "bg-[#5A8AFF]/20 border border-[#5A8AFF]/40 text-white shadow-[0_0_15px_rgba(90,138,255,0.2)]"
                        : "text-slate-300 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                        {item.icon}
                      </div>
                      <div className="text-left font-sans">
                        <div className="font-semibold text-slate-100">{item.title}</div>
                        <div className="text-xs text-slate-500 font-mono">
                          {item.category} // node.{item.id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5A8AFF]/15 text-cyan-300 border border-[#5A8AFF]/30">
                          {item.badge}
                        </span>
                      )}
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-black/50 border-t border-white/10 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">↑↓</kbd> navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">↵</kbd> select</span>
            </div>
            <div>
              <span>CPSET CORE // CMD TERMINAL</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
