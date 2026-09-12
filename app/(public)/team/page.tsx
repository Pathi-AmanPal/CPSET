import TeamGrid from "@/components/sections/TeamGrid";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Team & Operatives — CPSET",
  description: "Meet the faculty mentors, core leads, and researchers behind CPSET at Chandigarh University.",
};

export default function Page() {
  return (
    <main className="pt-24 pb-20 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">CPSET Node</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-300">Investigation Board & Team</span>
        </div>

        <TeamGrid />
      </div>
    </main>
  );
}
