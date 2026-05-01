"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email =
    typeof window !== "undefined" ? sessionStorage.getItem("fp_email") ?? "" : "";

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError(null);
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
    if (!cleaned && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error);
      if (json.blocked) setBlocked(true);
      return;
    }

    sessionStorage.setItem("fp_reset_token", json.resetToken);
    router.push("/forgot-password/reset");
  }

  async function handleResend() {
    if (resendCount >= 3) return;
    setResendLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResendCount((c) => c + 1);
    setResendLoading(false);
    setError(null);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  }

  const otp = digits.join("");

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Enter your code</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">
        We sent a 6-digit code to{" "}
        <span className="font-medium text-[var(--md-text)]">{email}</span>. It expires in 15 minutes.
      </p>

      {/* OTP digit inputs */}
      <div className="flex gap-2 justify-center mb-6">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            disabled={blocked}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all
              ${error
                ? "border-[var(--md-error)] bg-[var(--md-error)]/5"
                : d
                  ? "border-[var(--md-primary)] bg-[var(--md-primary)]/5"
                  : "border-[var(--md-border)] bg-white"
              }
              focus:border-[var(--md-primary)] focus:ring-2 focus:ring-[var(--md-primary)]/20
              disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-[var(--md-error)] mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleVerify}
          loading={loading}
          disabled={otp.length !== 6 || blocked}
        >
          Verify code
        </Button>

        {!blocked && resendCount < 3 && (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-center text-[var(--md-muted)] hover:text-[var(--md-primary)] transition-colors disabled:opacity-50"
          >
            {resendLoading ? "Resending…" : "Resend code"}
            {resendCount > 0 && ` (${3 - resendCount} left)`}
          </button>
        )}
      </div>

      <p className="text-center text-sm text-[var(--md-muted)] mt-6">
        <Link href="/forgot-password" className="text-[var(--md-primary)] font-medium hover:underline">
          ← Back
        </Link>
      </p>
    </AuthCard>
  );
}
