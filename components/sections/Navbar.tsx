"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/vision-mission", label: "Vision & Mission" },
  { href: "/objectives", label: "Objectives" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
  { href: "/connect", label: "Connect" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong shadow-md border-b border-slate-200/80" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cobalt to-violet flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,71,171,0.3)] transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-royal tracking-tight">
                CPSET
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-cobalt bg-cobalt/10 font-semibold"
                        : "text-body/80 hover:text-cobalt hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        className="h-0.5 bg-cobalt rounded-full mt-0.5"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-body" />
              ) : (
                <Menu className="w-5 h-5 text-body" />
              )}
            </button>
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
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? "text-cobalt bg-cobalt/10 font-semibold"
                          : "text-body/80 hover:text-cobalt hover:bg-slate-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
