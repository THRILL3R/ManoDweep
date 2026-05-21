"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function WelcomeSplashPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      const role = (session?.user as { role?: string })?.role;
      if (role === "MODERATOR") {
        router.push("/moderator");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/island");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, session]);

  const firstName = session?.user?.name?.split(" ")[0] ?? "friend";
  const dogName = (session?.user as { dogName?: string })?.dogName ?? "Buddy";

  return (
    <div className="auth-bg flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 text-center px-6"
      >
        {/* Island illustration */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true">
            <ellipse cx="60" cy="68" rx="55" ry="12" fill="rgba(74,124,89,0.2)" />
            <path d="M28 68 Q36 20 60 14 Q84 20 92 68" fill="rgba(74,124,89,0.45)" />
            <path d="M54 14 Q60 0 66 14" stroke="rgba(201,125,78,0.8)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="10" r="6" fill="rgba(201,125,78,0.6)" />
            <path d="M20 50 Q30 44 25 56" fill="rgba(74,124,89,0.3)" />
            <path d="M95 52 Q85 46 90 58" fill="rgba(74,124,89,0.3)" />
          </svg>
        </motion.div>

        <div>
          <p className="text-[var(--md-muted)] text-sm font-medium tracking-widest uppercase mb-2">
            Welcome to ManoDweep
          </p>
          <h1 className="text-3xl font-bold text-[var(--md-text)]">
            Hello, {firstName} 🌿
          </h1>
        </div>

        {/* Dog companion — visible on welcome splash per GR-10 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-3 bg-white/70 rounded-2xl px-4 py-3 shadow-sm border border-[var(--md-border)] max-w-xs"
        >
          {/* Dog SVG */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="20" r="12" fill="rgba(201,125,78,0.25)" />
            <ellipse cx="11" cy="13" rx="4" ry="5" fill="rgba(201,125,78,0.35)" />
            <ellipse cx="25" cy="13" rx="4" ry="5" fill="rgba(201,125,78,0.35)" />
            <circle cx="18" cy="20" r="9" fill="rgba(201,125,78,0.5)" />
            <circle cx="15" cy="19" r="1.5" fill="rgba(80,50,20,0.7)" />
            <circle cx="21" cy="19" r="1.5" fill="rgba(80,50,20,0.7)" />
            <ellipse cx="18" cy="22" rx="2.5" ry="1.5" fill="rgba(80,50,20,0.4)" />
          </svg>
          <p className="text-xs text-[var(--md-text)] text-left leading-relaxed">
            Welcome to ManoDweep — I&apos;m{" "}
            <span className="font-semibold">{dogName}</span>, and I&apos;ll be
            with you every step of the way.
          </p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className="flex gap-1.5 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-[var(--md-primary)]"
              initial={{ width: 6, opacity: 0.3 }}
              animate={{ width: i === 0 ? 24 : 6, opacity: i === 0 ? 1 : 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
