"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, KeyRound } from "lucide-react";
import Image from "next/image";
import { login } from "@/lib/fetchers";
import { showToast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
        ...(totp ? { totp } : {}),
      });
      showToast("success", "Logged in successfully!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050814] font-mono relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#5A8AFF]/20 via-[#9B7FFF]/20 to-transparent blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#090D24]/90 border border-[#5A8AFF]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(90,138,255,0.25)] backdrop-blur-2xl relative z-10">
        
        {/* Logo emblem */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8 text-center">
          <div className="relative w-14 h-14 rounded-full bg-[#5A8AFF]/15 border border-[#5A8AFF]/30 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(90,138,255,0.4)]">
            <Image
              src="/logo.png"
              alt="CPSET Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3 text-cyan-400" />
              AUTHENTICATION MATRIX
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-white mt-1">
              CPSET Admin Command Center
            </h1>
          </div>
        </div>

        <form action="javascript:void(0);" onSubmit={handleSubmit} className="space-y-4 font-mono">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              // EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
              placeholder="admin@cpset.org"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              // PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="totp"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              // 2FA CODE <span className="text-slate-500 font-normal">(OPTIONAL)</span>
            </label>
            <input
              id="totp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              value={totp}
              onChange={(e) =>
                setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-cyan-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all text-center tracking-widest font-mono"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3B6ADB] to-[#7C5FE0] hover:opacity-90 disabled:opacity-50 text-white font-semibold text-sm rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(90,138,255,0.35)] mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "AUTHENTICATE NODE"
            )}
          </button>
        </form>

        <p className="text-slate-500 text-[11px] text-center mt-6 font-mono">
          CPSET PROTECTED NODE // AUTHORIZED ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
