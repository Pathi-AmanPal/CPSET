"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  Target,
  Users,
  Calendar,
  Trophy,
  Mail,
  Search,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import CommandPaletteModal from "@/components/ui/CommandPaletteModal";

const navItems = [
  { href: "/", label: "Home", shortLabel: "Home", icon: Home },
  { href: "/vision-mission", label: "Vision & Mission", shortLabel: "Vision", icon: Compass },
  { href: "/objectives", label: "Objectives", shortLabel: "Objectives", icon: Target },
  { href: "/team", label: "Team", shortLabel: "Team", icon: Users },
  { href: "/events", label: "Events", shortLabel: "Events", icon: Calendar },
  { href: "/achievements", label: "Achievements", shortLabel: "Honors", icon: Trophy },
  { href: "/connect", label: "Connect", shortLabel: "Connect", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CommandPaletteModal isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* ── Docking Style Floating Glassmorphism Navbar ── */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-3 sm:px-6 pointer-events-none flex justify-center">
        <nav
          className="pointer-events-auto flex items-center justify-between gap-1.5 sm:gap-3 px-3 sm:px-5 py-2 rounded-full bg-[#06091e]/85 border border-[#5A8AFF]/30 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,5,30,0.85)] w-auto max-w-full"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group mr-0.5">
            <div
              className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform duration-200 rounded-full p-0.5"
              style={{
                background: "radial-gradient(circle, rgba(120,160,255,0.45) 0%, rgba(150,100,255,0.3) 60%, transparent 100%)",
                boxShadow: "0 0 15px rgba(90,138,255,0.5)",
                border: "1px solid rgba(140,180,255,0.4)",
              }}
            >
              <Image
                src="/logo.png"
                alt="CPSET Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="hidden min-[480px]:block text-left pr-1">
              <span className="font-heading font-extrabold text-xs sm:text-sm text-white tracking-wide block leading-none">
                CPSET
              </span>
              <span className="text-[9px] font-mono text-cyan-300/80 tracking-widest block mt-0.5 uppercase">
                COE PRIVACY & SECURITY
              </span>
            </div>
          </Link>

          <div className="h-5 w-px bg-white/10 shrink-0 hidden md:block" />

          {/* Desktop & Tablet Nav Items — Responsive docking items with jumping hover */}
          <div className="hidden md:flex items-center gap-0.5 sm:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  whileHover={{
                    y: -5,
                    scale: 1.08,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-mono transition-colors duration-150 select-none whitespace-nowrap ${
                      isActive
                        ? "text-cyan-200 font-semibold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"}`} />
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="inline lg:hidden">{item.shortLabel}</span>
                  </Link>

                  {/* Active Indicator Glow Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#5A8AFF]/25 to-[#9B7FFF]/25 border border-[#5A8AFF]/45 rounded-full z-0 shadow-[0_0_18px_rgba(90,138,255,0.4)]"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="h-5 w-px bg-white/10 shrink-0" />

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Command Palette Trigger */}
            <motion.button
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden xl:inline text-[11px] text-slate-300">Search</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 rounded border border-white/10 text-cyan-300 font-mono">
                ⌘K
              </kbd>
            </motion.button>

            {/* Join CTA */}
            <motion.a
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              href="https://docs.google.com/forms/d/e/1FAIpQLSckwxVufiIBCV6XN49KGx4swbWrI-8dnzZ4y04c-1ifAReD2w/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-white text-xs font-mono font-semibold shadow-[0_0_20px_rgba(90,138,255,0.4)] border border-cyan-400/40"
              style={{
                background: "linear-gradient(135deg, #3B6ADB 0%, #7C5FE0 100%)",
              }}
            >
              <span>./join</span>
              <ExternalLink className="w-3 h-3 text-cyan-200 shrink-0" />
            </motion.a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full bg-white/5 border border-white/15 text-slate-200 hover:text-white transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-16 sm:top-20 left-4 right-4 z-40 p-4 sm:p-5 rounded-3xl bg-[#06091e]/95 border border-[#5A8AFF]/35 backdrop-blur-2xl shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-mono transition-colors ${
                      isActive
                        ? "bg-[#5A8AFF]/20 border border-[#5A8AFF]/40 text-cyan-200 font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
