"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink, Search, Terminal } from "lucide-react";
import Image from "next/image";
import CommandPaletteModal from "@/components/ui/CommandPaletteModal";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#vision-mission", label: "Vision & Mission" },
  { href: "#objectives", label: "Objectives" },
  { href: "#team", label: "Team" },
  { href: "#events", label: "Events" },
  { href: "#achievements", label: "Achievements" },
  { href: "#connect", label: "Connect" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
      const sections = links.map((l) => l.href.substring(1));
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sections[i]);
        if (elem && elem.offsetTop <= scrollPos) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        setActiveSection(href);
        setMobileOpen(false);
      }
    }
  };

  return (
    <>
      <CommandPaletteModal isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(7, 9, 22, 0.88)"
            : "rgba(8, 10, 24, 0.68)",
          backdropFilter: "blur(28px) saturate(180%) brightness(0.95)",
          WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(0.95)",
          borderBottom: "1px solid rgba(90, 138, 255, 0.22)",
          boxShadow: scrolled
            ? "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(90,138,255,0.15), 0 8px 40px rgba(0, 4, 40, 0.70)"
            : "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(90,138,255,0.10), 0 4px 24px rgba(0, 4, 40, 0.40)",
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="relative flex items-center h-16 md:h-[68px]">

            {/* ── Left: Logo + CPSET ── */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex items-center gap-3 group cursor-pointer shrink-0"
            >
              <div
                className="relative w-10 h-10 shrink-0 group-hover:scale-105 transition-transform duration-200 rounded-full p-0.5"
                style={{
                  background: "radial-gradient(circle, rgba(120,160,255,0.40) 0%, rgba(150,100,255,0.25) 60%, transparent 100%)",
                  boxShadow: "0 0 20px rgba(100,160,255,0.55), 0 0 8px rgba(160,120,255,0.4)",
                  border: "1px solid rgba(140,180,255,0.45)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="CPSET Logo"
                  fill
                  className="object-contain p-0.5"
                  style={{ filter: "drop-shadow(0 0 6px rgba(140,180,255,0.7))" }}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white drop-shadow-[0_0_12px_rgba(120,160,255,0.4)]">
                  CPSET
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-cyan-300/70 -mt-1 tracking-wider">
                  PRIVACY & SECURITY
                </span>
              </div>
            </a>

            {/* ── Center: Nav links ── */}
            <div className="hidden xl:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {links.map((link) => {
                const active = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="relative px-3 py-1.5 cursor-pointer group rounded-lg transition-all"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11.5px",
                      fontWeight: active ? 600 : 400,
                      letterSpacing: "0.04em",
                      color: active ? "#F0F4FF" : "rgba(137,147,176,0.85)",
                    }}
                  >
                    {active && <span className="text-cyan-400 font-mono">// </span>}
                    {link.label}
                    {active && (
                      <motion.div
                        className="absolute -bottom-0.5 left-2 right-2 h-px"
                        style={{
                          background: "linear-gradient(90deg, #5A8AFF, #9B7FFF)",
                          boxShadow: "0 0 8px rgba(90,138,255,0.6)",
                        }}
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* ── Right: Command Palette Trigger + CTA + Mobile Toggle ── */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {/* Cmd+K Quick Search Button */}
              <button
                onClick={() => setCmdOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/40 border border-[#5A8AFF]/25 hover:border-[#5A8AFF]/60 text-slate-300 text-xs font-mono transition-all hover:bg-[#5A8AFF]/10 shadow-[0_0_15px_rgba(90,138,255,0.1)]"
                title="Search Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px] text-slate-400">Search</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 border border-white/10 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Join CTA */}
              <a
                href="#connect"
                onClick={(e) => handleNavClick(e, "#connect")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-mono text-xs font-semibold tracking-wide transition-all duration-150 active:scale-95 shadow-[0_0_20px_rgba(90,138,255,0.35)]"
                style={{
                  background: "linear-gradient(135deg, #3B6ADB 0%, #7C5FE0 100%)",
                }}
              >
                <span>./join</span>
                <ExternalLink className="w-3 h-3 text-cyan-200" />
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-white bg-black/30 border border-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-300" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 pt-20 px-5 flex flex-col justify-between pb-8"
              style={{
                background: "rgba(8, 12, 35, 0.96)",
                borderLeft: "1px solid rgba(90, 138, 255, 0.25)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-1.5 font-mono">
                <div className="text-[10px] text-cyan-400 tracking-wider mb-2 font-semibold">// CPSET NAVIGATION</div>
                {links.map((link) => {
                  const active = activeSection === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between"
                      style={{
                        color: active ? "#FFFFFF" : "#8993B0",
                        background: active ? "rgba(90, 138, 255, 0.18)" : "transparent",
                        border: active ? "1px solid rgba(90, 138, 255, 0.3)" : "1px solid transparent",
                      }}
                    >
                      <span>{link.label}</span>
                      {active && <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
                    </a>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 font-mono">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setCmdOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs bg-black/40 border border-[#5A8AFF]/30 text-cyan-300"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Matrix (⌘K)</span>
                </button>
                <a
                  href="#connect"
                  onClick={(e) => handleNavClick(e, "#connect")}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#3B6ADB] to-[#7C5FE0] shadow-lg"
                >
                  <span>./join --cpset</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

