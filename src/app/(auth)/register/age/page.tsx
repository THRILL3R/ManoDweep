"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

function calculateAge(day: number, month: number, year: number): number {
  const today = new Date();
  const dob = new Date(year, month - 1, day);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export default function AgeVerificationPage() {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [blocked, setBlocked] = useState(false);

  const isComplete = day && month && year;

  function handleContinue() {
    if (!isComplete) return;

    const age = calculateAge(Number(day), Number(month), Number(year));

    if (age < 18) {
      setBlocked(true);
      return;
    }

    // Store DOB in sessionStorage for next steps
    const dob = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
    sessionStorage.setItem("reg_dob", dob);

    router.push("/register/consent");
  }

  if (blocked) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <div className="w-16 h-16 rounded-full bg-[var(--md-accent)]/15 flex items-center justify-center text-3xl">
            🌿
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--md-text)] mb-3">
              We&apos;ll be here when you&apos;re ready
            </h1>
            <p className="text-[var(--md-muted)] text-sm leading-relaxed">
              ManoDweep is designed for users 18 and above. We hope to see you when you&apos;re ready.
            </p>
          </div>
          <Link href="/login" className="text-sm text-[var(--md-primary)] hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </AuthCard>
    );
  }

  const selectClass =
    "flex-1 rounded-xl border border-[var(--md-border)] bg-white text-[var(--md-text)] px-3 py-3 text-sm outline-none focus:border-[var(--md-primary)] focus:ring-2 focus:ring-[var(--md-primary)]/20 cursor-pointer";

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Before we begin</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">
        ManoDweep is designed for adults aged 18 and above.
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-medium text-[var(--md-text)] block mb-2">
            Date of Birth
          </label>
          <div className="flex gap-2">
            {/* Day */}
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={selectClass}
              aria-label="Day"
            >
              <option value="">Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={selectClass}
              aria-label="Month"
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={selectClass}
              aria-label="Year"
            >
              <option value="">Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isComplete}
        >
          Continue
        </Button>

        <p className="text-center text-sm text-[var(--md-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--md-primary)] font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
