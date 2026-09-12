"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Calendar, Trophy, LogOut, Terminal } from "lucide-react";
import { logout } from "@/lib/fetchers";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/team", icon: Users, label: "Team Members" },
  { href: "/admin/events", icon: Calendar, label: "Events & Labs" },
  { href: "/admin/achievements", icon: Trophy, label: "Achievements" },
];

export default function AdminSidebar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-64 bg-[#080C22] border-r border-[#5A8AFF]/20 flex flex-col shrink-0 font-mono shadow-2xl">
      {/* Logo */}
      <div className="h-20 flex items-center gap-3 px-5 border-b border-[#5A8AFF]/15">
        <div className="relative w-9 h-9 rounded-full bg-[#5A8AFF]/15 border border-[#5A8AFF]/30 p-1 flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="CPSET Logo"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <div>
          <span className="font-heading font-extrabold text-white text-base tracking-tight block">
            CPSET Admin
          </span>
          <span className="text-[9px] text-cyan-400 font-mono tracking-widest">
            CORE COMMAND
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-mono transition-all ${
                active
                  ? "bg-[#5A8AFF]/20 text-white font-bold border border-[#5A8AFF]/40 shadow-[0_0_15px_rgba(90,138,255,0.2)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin details & Logout */}
      <div className="p-4 border-t border-[#5A8AFF]/15 space-y-3 bg-black/40">
        {adminEmail && (
          <div className="text-[10px] text-slate-400 px-1 truncate">
            <span className="text-cyan-400 block font-semibold mb-0.5">ADMIN OPERATOR:</span>
            <span className="text-slate-200 truncate block">{adminEmail}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
}
