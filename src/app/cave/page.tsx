"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CavePage() {
  const { data: session } = useSession();
  const firstLoginAt = (session?.user as { firstLoginAt?: string })?.firstLoginAt;

  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const msSinceFirst = firstLoginAt
    ? Date.now() - new Date(firstLoginAt).getTime()
    : 0;
  const isLocked = !firstLoginAt || msSinceFirst < SEVEN_DAYS;
  const daysLeft = Math.max(
    1,
    Math.ceil((SEVEN_DAYS - msSinceFirst) / (24 * 60 * 60 * 1000))
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--md-bg)] px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-[var(--md-primary)]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M3 22 Q6 8 13 6 Q20 8 23 22 Z" fill="rgba(74,124,89,0.35)" />
            <path d="M7 22 Q9 14 13 12 Q17 14 19 22 Z" fill="rgba(74,124,89,0.5)" />
            <ellipse cx="13" cy="22" rx="9" ry="2" fill="rgba(74,124,89,0.2)" />
          </svg>
        </div>

        {isLocked ? (
          <>
            <h1 className="text-xl font-bold text-[var(--md-text)] mb-2">The Cave</h1>
            <p className="text-sm text-[var(--md-muted)] leading-relaxed">
              The cave is still settling. Come back in{" "}
              <span className="font-semibold text-[var(--md-text)]">
                {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </span>{" "}
              when it&apos;s ready for you.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[var(--md-text)] mb-2">The Cave</h1>
            <p className="text-sm text-[var(--md-muted)] leading-relaxed">
              This space is coming soon. The cave holds something special — check back as the island grows.
            </p>
          </>
        )}

        <Link
          href="/island"
          className="inline-block mt-6 text-sm text-[var(--md-primary)] font-medium hover:underline"
        >
          ← Back to island
        </Link>
      </div>
    </div>
  );
}
