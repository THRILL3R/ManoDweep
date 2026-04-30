"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordEmailSchema, type ForgotPasswordEmailInput } from "@/lib/validations";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordEmailInput>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  async function onSubmit(data: ForgotPasswordEmailInput) {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    // Always show success message (enumeration prevention)
    setSentEmail(data.email);
    setSent(true);
    sessionStorage.setItem("fp_email", data.email);
  }

  if (sent) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-5 py-2">
          <div className="w-14 h-14 rounded-full bg-[var(--md-primary)]/10 flex items-center justify-center text-2xl">
            📬
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--md-text)] mb-2">Check your email</h1>
            <p className="text-sm text-[var(--md-muted)] leading-relaxed">
              If an account with <span className="font-medium text-[var(--md-text)]">{sentEmail}</span> exists,
              a 6-digit reset code has been sent. It expires in 15 minutes.
            </p>
          </div>
          <Button onClick={() => router.push("/forgot-password/verify")} className="w-full mt-2">
            Enter code
          </Button>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-[var(--md-muted)] hover:text-[var(--md-primary)] transition-colors"
          >
            Use a different email
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Forgot password?</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">
        Enter your email and we&apos;ll send you a reset code.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" loading={isSubmitting}>
          Send reset code
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--md-muted)] mt-6">
        <Link href="/login" className="text-[var(--md-primary)] font-medium hover:underline">
          Back to Login
        </Link>
      </p>
    </AuthCard>
  );
}
