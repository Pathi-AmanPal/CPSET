"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, Calendar, Trophy, LogOut, Settings } from "lucide-react";
import { logout } from "@/lib/fetchers";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/team", icon: Users, label: "Team" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/achievements", icon: Trophy, label: "Achievements" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
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
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cobalt to-violet flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-heading font-bold text-royal text-sm">
          CPSET Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-cobalt/10 text-cobalt font-semibold"
                  : "text-slate-600 hover:text-royal hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin details & Logout */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        {adminEmail && (
          <p className="text-[11px] text-slate-400 px-3.5 truncate">
            Signed in as <span className="font-semibold text-slate-700">{adminEmail}</span>
          </p>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-alert hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
