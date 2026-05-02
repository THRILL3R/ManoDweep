"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";

const CONSENT_TEXT = `ManoDweep is a daily mental wellness companion designed to help you build healthy habits, reflect on your emotions, and take small, meaningful steps towards caring for yourself.

This platform is a space for daily self-care — not a substitute for professional mental health support.

If you are going through a crisis, experiencing thoughts of self-harm, or feel you need urgent support, please reach out to a mental health professional, speak to someone you trust, or contact a helpline.

Indian Helplines:
• iCall: 9152987821
• Vandrevala Foundation: 1860 266 2345
• AASRA: 91-22-27546669

By continuing, you acknowledge that ManoDweep is a wellness tool and not an emergency service.

You matter. And you deserve the right kind of support — whatever that looks like for you.`;

export default function ConsentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Carry Google params through the flow
  const isGoogle = searchParams.get("google") === "1";
  const email = searchParams.get("email") ?? "";
  const name = searchParams.get("name") ?? "";
  const gid = searchParams.get("gid") ?? "";

  // Guard: ensure user came through age verification
  useEffect(() => {
    if (!sessionStorage.getItem("reg_dob")) {
      router.replace("/register/age");
    }
  }, [router]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(Math.min(progress, 1));
    if (progress >= 0.98) setScrolled(true);
  }

  function handleConfirm() {
    const consentAt = new Date().toISOString();
    sessionStorage.setItem("reg_consent_at", consentAt);

    const params = new URLSearchParams();
    if (isGoogle) {
      params.set("google", "1");
      if (email) params.set("email", email);
      if (name) params.set("name", name);
      if (gid) params.set("gid", gid);
    }
    const query = params.toString();
    router.push(`/register/form${query ? `?${query}` : ""}`);
  }

  return (
    <div className="auth-bg flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none" aria-hidden="true">
          <ellipse cx="32" cy="34" rx="30" ry="6" fill="rgba(74,124,89,0.18)" />
          <path d="M16 34 Q20 10 32 8 Q44 10 48 34" fill="rgba(74,124,89,0.35)" />
          <path d="M28 8 Q32 0 36 8" stroke="rgba(201,125,78,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="6" r="3" fill="rgba(201,125,78,0.5)" />
        </svg>
        <span className="text-xs font-semibold tracking-widest text-[var(--md-primary)] uppercase opacity-70">
          ManoDweep
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[var(--md-border)] flex flex-col overflow-hidden">
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">A few words before you begin</h1>
          <p className="text-sm text-[var(--md-muted)]">Please read this carefully.</p>
        </div>

        {/* Scroll progress bar */}
        <div className="h-1 bg-[var(--md-border)] mx-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--md-primary)] transition-all duration-300 rounded-full"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Scrollable consent text */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="px-8 py-4 overflow-y-auto"
          style={{ maxHeight: "280px" }}
        >
          <div className="text-sm text-[var(--md-text)] leading-relaxed whitespace-pre-line">
            {CONSENT_TEXT}
          </div>
          <div className="h-1" />
        </div>

        {!scrolled && (
          <div className="text-center text-xs text-[var(--md-muted)] py-2">
            ↓ Scroll to continue
          </div>
        )}

        <div className="px-8 pb-8 pt-4 flex flex-col gap-3">
          <Button onClick={handleConfirm} disabled={!scrolled}>
            I Understand, Let&apos;s Begin
          </Button>
          {/* v7.0: Go Back returns to Login (0.0), no data saved */}
          <Link
            href="/login"
            className="text-center text-sm text-[var(--md-muted)] hover:text-[var(--md-primary)] transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
