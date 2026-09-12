import Link from "next/link";
import Image from "next/image";
import { Shield, Terminal, Activity, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/vision-mission", label: "Vision & Mission" },
  { href: "/objectives", label: "Objectives" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/achievements", label: "Achievements" },
  { href: "/connect", label: "Connect" },
];

export default function Footer() {
  return (
    <footer className="relative mt-28 border-t border-[#5A8AFF]/20 bg-[#060814]/95 text-slate-300 font-mono overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-tr from-[#5A8AFF]/10 via-[#9B7FFF]/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Operational Node Status Header Bar */}
      <div className="border-b border-[#5A8AFF]/15 bg-black/40 px-4 sm:px-8 py-2.5 text-[11px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            CPSET CORE NODE: ONLINE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">LATENCY: 12ms</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-300/80 hidden sm:inline">ENCRYPTION: AES-256-GCM</span>
        </div>
        <div className="text-slate-500 text-[10px]">
          CENTRE FOR PRIVACY & SECURITY IN EMERGING TECHNOLOGIES
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
                <div className="relative w-10 h-10 rounded-full bg-[#5A8AFF]/15 border border-[#5A8AFF]/30 p-1 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image
                    src="/logo.png"
                    alt="CPSET Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-white text-xl tracking-tight block">
                    CPSET
                  </span>
                  <span className="text-[10px] text-cyan-400 tracking-wider">
                    CHANDIGARH UNIVERSITY
                  </span>
                </div>
              </Link>
              <p className="text-slate-400 font-sans text-sm leading-relaxed max-w-sm">
                A specialized Centre of Excellence dedicated to advancing cyber research, privacy-preserving cryptography, steganography, and emerging threat intelligence.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#5A8AFF]/10 border border-[#5A8AFF]/20 text-cyan-300 text-xs font-mono">
                node_id // cpset-cu-01
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#9B7FFF]/10 border border-[#9B7FFF]/20 text-violet-300 text-xs font-mono">
                v2.5.0
              </span>
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="md:col-span-3 font-sans">
            <h4 className="font-mono text-cyan-300 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Portal Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-[#5A8AFF] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">&gt;</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillars Column (4 cols) */}
          <div className="md:col-span-4 font-sans">
            <h4 className="font-mono text-violet-300 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              Core Research Pillars
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "Cryptography",
                "Steganography",
                "Network Forensics",
                "Privacy Preserving AI",
                "Zero Trust",
                "Quantum Security"
              ].map((pill) => (
                <span
                  key={pill}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-[#5A8AFF]/10 text-cyan-300 border border-[#5A8AFF]/20 hover:border-[#5A8AFF]/50 transition-colors"
                >
                  #{pill}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Admin Portal</span>
              </div>
              <Link
                href="/admin/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
              >
                Access <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Line */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>
            © {new Date().getFullYear()} CPSET — Chandigarh University. All rights reserved.
          </p>
          <p className="text-cyan-400/80">
            PRIVACY // SECURITY // INNOVATION // TRUST
          </p>
        </div>
      </div>
    </footer>
  );
}

