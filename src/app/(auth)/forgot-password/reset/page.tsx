"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("fp_reset_token")) {
      router.replace("/forgot-password");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setServerError(null);
    const resetToken = sessionStorage.getItem("fp_reset_token");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, resetToken }),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }

    sessionStorage.removeItem("fp_email");
    sessionStorage.removeItem("fp_reset_token");

    router.push("/login?reset=success");
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Set a new password</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">
        Minimum 8 characters.
      </p>

      {serverError && (
        <div className="mb-6 rounded-xl bg-[var(--md-error)]/10 border border-[var(--md-error)]/20 px-4 py-3 text-sm text-[var(--md-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm new password"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Reset password
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
