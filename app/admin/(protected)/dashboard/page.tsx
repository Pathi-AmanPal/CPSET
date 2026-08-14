"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { fetchTeam, fetchEvents, fetchAchievements } from "@/lib/fetchers";

interface StatCard {
  label: string;
  count: number;
  icon: typeof Users;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [team, events, achievements] = await Promise.all([
          fetchTeam().catch(() => []),
          fetchEvents().catch(() => []),
          fetchAchievements().catch(() => []),
        ]);

        setStats([
          {
            label: "Team Members",
            count: team.length,
            icon: Users,
            href: "/admin/team",
            color: "text-cobalt",
          },
          {
            label: "Events",
            count: events.length,
            icon: Calendar,
            href: "/admin/events",
            color: "text-violet",
          },
          {
            label: "Achievements",
            count: achievements.length,
            icon: Trophy,
            href: "/admin/achievements",
            color: "text-emerald-600",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-royal mb-8">
        Dashboard
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-cobalt" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="font-heading font-bold text-3xl text-royal">
                    {stat.count}
                  </span>
                </div>
                <p className="text-body/70 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick links */}
          <h2 className="font-heading font-semibold text-lg text-royal mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <Link
                key={stat.href}
                href={stat.href}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-cobalt/40 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-slate-700 group-hover:text-cobalt transition-colors">
                  Manage {stat.label}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cobalt transition-colors" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
