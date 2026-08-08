import Link from "next/link";
import { Shield } from "lucide-react";

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
    <footer className="relative mt-24 border-t border-slate-200 bg-slate-50/50">
      {/* Subtle top wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-cobalt/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cobalt to-violet flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-royal text-lg">CPSET</span>
            </Link>
            <p className="text-body/70 text-sm leading-relaxed max-w-xs">
              Centre for Privacy and Security in Emerging Technologies.
              Chandigarh University.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-royal text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body/70 hover:text-cobalt text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Values */}
          <div>
            <h4 className="font-heading font-semibold text-royal text-sm uppercase tracking-wider mb-4">
              Our Pillars
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Privacy", "Security", "Innovation", "Trust", "Excellence"].map(
                (word) => (
                  <span
                    key={word}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-cobalt/5 border border-cobalt/20 text-cobalt"
                  >
                    {word}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body/60 text-xs">
            © {new Date().getFullYear()} CPSET — Chandigarh University. All
            rights reserved.
          </p>
          <p className="text-body/50 text-xs font-medium">
            Privacy · Security · Innovation · Trust · Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
