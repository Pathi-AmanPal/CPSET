import ConnectTiles from "@/components/sections/ConnectTiles";
import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Connect & CLI — CPSET",
  description: "Connect with CPSET on social media, student channels, and interactive command terminal.",
};

export default function Page() {
  return (
    <main className="pt-24 pb-20 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
          <Link href="/" className="hover:text-cyan-400 transition-colors">CPSET Node</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-300">Connect Matrix</span>
        </div>

        {/* Page Hero Header */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#090D24]/80 border border-[#5A8AFF]/20 backdrop-blur-2xl relative overflow-hidden text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5A8AFF]/10 border border-[#5A8AFF]/30 text-cyan-300 text-xs font-mono mb-4">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMMUNITY & NETWORKING</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4">
            Connect & CLI Matrix
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-sans">
            Reach out via official channels or test live commands on the interactive CPSET CLI terminal.
          </p>
        </div>

        <ConnectTiles />
      </div>
    </main>
  );
}
