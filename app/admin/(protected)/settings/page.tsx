"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  ScanLine,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateTotp, enableTotp, disableTotp } from "@/lib/fetchers";
import { showToast } from "@/components/ui/Toast";

/* ── tiny QR-code img via Google Charts (no npm package needed) ── */
function QrCode({ url }: { url: string }) {
  const encoded = encodeURIComponent(url);
  const src = `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${encoded}&choe=UTF-8`;
  return (
    <Image
      src={src}
      alt="TOTP QR code — scan with your authenticator app"
      width={220}
      height={220}
      className="rounded-xl border border-slate-200 shadow-sm"
      unoptimized
    />
  );
}

/* ── single OTP digit input ── */
function OtpInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, "").slice(-1);
            const next = (value + "      ").slice(0, 6).split("");
            next[i] = digit;
            const updated = next.join("").trimEnd();
            onChange(updated);
            if (digit && i < 5) {
              const nextEl = document.getElementById(`otp-${i + 1}`);
              (nextEl as HTMLInputElement | null)?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) {
              const prev = document.getElementById(`otp-${i - 1}`);
              (prev as HTMLInputElement | null)?.focus();
            }
            if (e.key === "Enter") onEnter();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 6);
            onChange(pasted);
            e.preventDefault();
            const target = document.getElementById(`otp-${Math.min(pasted.length, 5)}`);
            (target as HTMLInputElement | null)?.focus();
          }}
          className="w-11 h-13 text-center text-xl font-mono font-bold text-royal bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all"
        />
      ))}
    </div>
  );
}

/* ── step indicator ── */
function Step({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-cobalt text-white shadow-[0_0_12px_rgba(90,138,255,0.4)]"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {done ? <Check className="w-3.5 h-3.5" /> : num}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? "text-royal" : done ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
═══════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const router = useRouter();

  // ── Enable flow state ──────────────────────────────────────────
  const [flowStep, setFlowStep] = useState<"idle" | "qr" | "verify" | "done">("idle");
  const [totpData, setTotpData] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── Disable confirm state ──────────────────────────────────────
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disabling, setDisabling] = useState(false);

  // ── Step 1: generate secret ────────────────────────────────────
  const handleStartSetup = useCallback(async () => {
    setBusy(true);
    try {
      const data = await generateTotp();
      setTotpData(data);
      setOtpCode("");
      setFlowStep("qr");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to generate QR code");
    } finally {
      setBusy(false);
    }
  }, []);

  // ── Step 2: verify & enable ────────────────────────────────────
  const handleVerify = useCallback(async () => {
    if (otpCode.length !== 6) {
      showToast("error", "Please enter all 6 digits");
      return;
    }
    setBusy(true);
    try {
      await enableTotp(otpCode);
      setFlowStep("done");
      showToast("success", "Two-factor authentication is now active!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Invalid code — try again");
      setOtpCode("");
    } finally {
      setBusy(false);
    }
  }, [otpCode]);

  // ── Disable 2FA ────────────────────────────────────────────────
  const handleDisable = useCallback(async () => {
    setDisabling(true);
    try {
      await disableTotp();
      showToast("success", "2FA disabled. You have been signed out everywhere.");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to disable 2FA");
      setShowDisableConfirm(false);
    } finally {
      setDisabling(false);
    }
  }, [router]);

  // ── Copy secret to clipboard ───────────────────────────────────
  const handleCopy = useCallback(() => {
    if (!totpData?.secret) return;
    navigator.clipboard.writeText(totpData.secret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [totpData]);

  const cardBase =
    "bg-white border border-slate-200 rounded-2xl shadow-sm";

  return (
    <div className="max-w-2xl">
      {/* ── Page header ─────────────────────────────────────────── */}
      <h1 className="font-heading font-bold text-2xl text-royal mb-1">
        Settings
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Manage your account security and authentication preferences.
      </p>

      {/* ════════════════════════════════════════════════════════════
          SECTION — Two-Factor Authentication
      ════════════════════════════════════════════════════════════ */}
      <section className={`${cardBase} overflow-hidden`}>
        {/* Card header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cobalt/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-cobalt" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-semibold text-royal text-base">
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Add an extra layer of security using a TOTP authenticator app
              (Google Authenticator, Authy, 1Password, etc.).
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">

            {/* ── IDLE: not yet set up ── */}
            {flowStep === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700">
                    2FA is <strong>not enabled</strong> on your account. We strongly
                    recommend enabling it.
                  </p>
                </div>

                <button
                  id="btn-enable-2fa"
                  onClick={handleStartSetup}
                  disabled={busy}
                  className="flex items-center gap-2.5 bg-cobalt hover:bg-cobalt/90 disabled:opacity-60 text-white font-semibold text-sm rounded-xl px-5 py-2.5 transition-all shadow-sm cursor-pointer"
                >
                  {busy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ScanLine className="w-4 h-4" />
                  )}
                  Enable 2FA
                </button>
              </motion.div>
            )}

            {/* ── QR: scan step ── */}
            {flowStep === "qr" && totpData && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Steps progress */}
                <div className="flex gap-6">
                  <Step num={1} label="Scan QR code" active done={false} />
                  <Step num={2} label="Verify code" active={false} done={false} />
                </div>

                <p className="text-sm text-slate-600">
                  Open your authenticator app and scan the QR code below. If you
                  cannot scan it, copy the secret key manually.
                </p>

                {/* QR + secret */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="shrink-0">
                    <QrCode url={totpData.otpauthUrl} />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Manual entry key
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-royal break-all">
                          {totpData.secret}
                        </code>
                        <button
                          onClick={handleCopy}
                          title="Copy secret"
                          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                      <p className="font-semibold text-slate-600">Supported apps:</p>
                      <p>Google Authenticator · Authy · Microsoft Authenticator · 1Password · Bitwarden</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    id="btn-qr-next"
                    onClick={() => setFlowStep("verify")}
                    className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 text-white font-semibold text-sm rounded-xl px-5 py-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    I've scanned it — continue
                  </button>
                  <button
                    onClick={() => { setFlowStep("idle"); setTotpData(null); }}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── VERIFY: enter code ── */}
            {flowStep === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Steps progress */}
                <div className="flex gap-6">
                  <Step num={1} label="Scan QR code" active={false} done />
                  <Step num={2} label="Verify code" active done={false} />
                </div>

                <p className="text-sm text-slate-600">
                  Enter the 6-digit code from your authenticator app to confirm setup.
                </p>

                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  onEnter={handleVerify}
                />

                <div className="flex gap-3 justify-center">
                  <button
                    id="btn-verify-totp"
                    onClick={handleVerify}
                    disabled={busy || otpCode.length !== 6}
                    className="flex items-center gap-2 bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 text-white font-semibold text-sm rounded-xl px-6 py-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Verify & Activate
                  </button>
                  <button
                    onClick={() => setFlowStep("qr")}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── DONE: success state ── */}
            {flowStep === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-royal text-lg">
                    2FA is Active
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Your account is now protected by two-factor authentication.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 w-fit mx-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  You will need your authenticator app on every login
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION — Danger Zone (disable 2FA)
          Only show once 2FA is active (done state) or if it was
          already enabled when the page loaded — controlled via
          the `showDisableConfirm` gate.
      ════════════════════════════════════════════════════════════ */}
      {flowStep === "done" && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 bg-red-50 border border-red-200 rounded-2xl overflow-hidden"
        >
          <div className="px-6 pt-5 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <ShieldOff className="w-5 h-5 text-alert" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading font-semibold text-alert text-base">
                  Disable 2FA
                </h2>
                <p className="text-sm text-red-600/80 mt-0.5">
                  Removing 2FA will sign you out of all devices and reduce your
                  account security. Only do this if you are changing authenticator apps.
                </p>

                <AnimatePresence>
                  {!showDisableConfirm ? (
                    <motion.button
                      key="show-confirm"
                      id="btn-disable-2fa"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowDisableConfirm(true)}
                      className="mt-4 flex items-center gap-2 bg-white border border-red-300 text-alert hover:bg-red-50 font-semibold text-sm rounded-xl px-4 py-2 transition-all cursor-pointer"
                    >
                      <ShieldOff className="w-4 h-4" />
                      Disable 2FA
                    </motion.button>
                  ) : (
                    <motion.div
                      key="confirm-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-white border border-red-200 rounded-xl space-y-3"
                    >
                      <p className="text-sm font-semibold text-slate-700">
                        Are you sure? This action will:
                      </p>
                      <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                        <li>Remove 2FA from your account immediately</li>
                        <li>Sign you out of all active sessions</li>
                      </ul>
                      <div className="flex gap-3 pt-1">
                        <button
                          id="btn-confirm-disable-2fa"
                          onClick={handleDisable}
                          disabled={disabling}
                          className="flex items-center gap-2 bg-alert hover:bg-red-600 disabled:opacity-60 text-white font-semibold text-sm rounded-xl px-4 py-2 transition-all cursor-pointer"
                        >
                          {disabling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldOff className="w-4 h-4" />
                          )}
                          Yes, disable 2FA
                        </button>
                        <button
                          onClick={() => setShowDisableConfirm(false)}
                          className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
