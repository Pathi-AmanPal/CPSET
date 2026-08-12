"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.5)]" : ""
        }`}
        style={{
          background: "rgba(7, 11, 26, 0.96)",
          borderBottom: "1px solid rgba(80, 120, 255, 0.15)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="relative flex items-center h-16 md:h-[68px]">

            {/* ── Left: Logo + CPSET (Far Left) ── */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex items-center gap-3 group cursor-pointer shrink-0"
            >
              {/* Vibrant Glow ring + logo image */}
              <div
                className="relative w-11 h-11 shrink-0 group-hover:scale-105 transition-transform duration-200 rounded-full p-0.5"
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
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(140,180,255,0.7))",
                  }}
                  priority
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight" style={{ color: "#FFFFFF", textShadow: "0 0 12px rgba(120,160,255,0.3)" }}>CPSET</span>
            </a>

            {/* ── Center: Nav links (absolutely centered) ── */}
            <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
              {links.map((link) => {
                const active = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer relative ${
                      active ? "font-semibold" : ""
                    }`}
                    style={{ color: active ? "#FFFFFF" : "#8899CC" }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#C4D0FF"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#8899CC"; }}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* ── Right: CTA + Mobile toggle ── */}
            <div className="flex items-center gap-3 ml-auto">
              <a
                href="#connect"
                onClick={(e) => handleNavClick(e, "#connect")}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-md hover:shadow-violet-400/50 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
              >
                Become a Member
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "#B8BDD6" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 pt-20 px-4"
              style={{
                background: "rgba(8, 12, 35, 0.95)",
                borderLeft: "1px solid rgba(80, 120, 255, 0.20)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-1">
                {links.map((link) => {
                  const active = activeSection === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer`}
                      style={{
                        color: active ? "#FFFFFF" : "#8899CC",
                        background: active ? "rgba(90, 138, 255, 0.12)" : "transparent",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <a
                  href="#connect"
                  onClick={(e) => handleNavClick(e, "#connect")}
                  className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #5A6FE8)" }}
                >
                  Become a Member <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
