"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cobalt to-violet flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="font-heading font-bold text-xl text-center text-royal mb-6">
          Admin Sign In
        </h1>

        <form action="javascript:void(0);" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt/30 transition-all"
              placeholder="admin@cpset.org"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt/30 transition-all"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="totp"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              2FA Code{" "}
              <span className="text-slate-400 font-normal">(if enabled)</span>
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt/30 transition-all"
              placeholder="000000"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 text-white font-semibold text-sm rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all shadow-sm mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-slate-400 text-xs text-center mt-6">
          CPSET Admin Panel — Authorized Access Only
        </p>
      </div>
    </div>
  );
}
