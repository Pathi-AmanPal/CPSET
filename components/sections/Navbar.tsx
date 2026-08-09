"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";

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
          scrolled ? "glass-strong shadow-md border-b border-slate-200/80" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Logo with institution subtitle */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cobalt to-violet flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,71,171,0.3)] transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-lg text-royal tracking-tight">CPSET</span>
                <span className="font-heading font-medium text-[9px] text-cobalt/70 tracking-[0.18em] uppercase">
                  Chandigarh University
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {links.map((link) => {
                const active = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative ${
                      active
                        ? "text-cobalt bg-cobalt/8 font-semibold"
                        : "text-body/80 hover:text-cobalt hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        className="h-0.5 bg-cobalt rounded-full mt-0.5"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Navbar CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              {/* Become a Member button — desktop only */}
              <a
                href="#connect"
                onClick={(e) => handleNavClick(e, "#connect")}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cobalt to-violet hover:from-violet hover:to-cobalt transition-all duration-300 shadow-sm hover:shadow-[0_4px_15px_rgba(0,71,171,0.35)]"
              >
                Become a Member
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-body" /> : <Menu className="w-5 h-5 text-body" />}
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
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong pt-20 px-4"
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
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? "text-cobalt bg-cobalt/10 font-semibold"
                          : "text-body/80 hover:text-cobalt hover:bg-slate-100"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <a
                  href="#connect"
                  onClick={(e) => handleNavClick(e, "#connect")}
                  className="mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-cobalt to-violet"
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
