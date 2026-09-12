import AchievementsCarousel from "@/components/sections/AchievementsCarousel";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Achievements & Honors — CPSET",
  description: "CPSET research milestones, awards, and national recognition in cybersecurity.",
};

export default function Page() {
  return (
    <main className="pt-24 pb-20 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">CPSET Node</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-300">Achievements</span>
        </div>

        <AchievementsCarousel />
      </div>
    </main>
  );
}
