"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const registered = searchParams.get("registered") === "true";
  const oauthError = searchParams.get("error") === "OAuthAccountNotLinked";
  const deactivated = searchParams.get("error") === "AccountDeactivated";

  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Incorrect email or password. Please try again.");
      return;
    }

    router.push("/welcome");
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/welcome" });
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Welcome back</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">Sign in to your island</p>

      {registered && (
        <div className="mb-5 rounded-xl bg-[var(--md-primary)]/10 border border-[var(--md-primary)]/20 px-4 py-3 text-sm text-[var(--md-primary)] font-medium">
          Account created! Log in to start your journey.
        </div>
      )}

      {resetSuccess && (
        <div className="mb-5 rounded-xl bg-[var(--md-primary)]/10 border border-[var(--md-primary)]/20 px-4 py-3 text-sm text-[var(--md-primary)] font-medium">
          Password reset successfully. Please log in.
        </div>
      )}

      {oauthError && (
        <div className="mb-5 rounded-xl bg-[var(--md-error)]/10 border border-[var(--md-error)]/20 px-4 py-3 text-sm text-[var(--md-error)]">
          An account with this email already exists. Please log in with your email and password.
        </div>
      )}

      {deactivated && (
        <div className="mb-5 rounded-xl bg-[var(--md-error)]/10 border border-[var(--md-error)]/20 px-4 py-3 text-sm text-[var(--md-error)]">
          This account has been deactivated. Please contact support if you think this is a mistake.
        </div>
      )}

      {serverError && (
        <div className="mb-5 rounded-xl bg-[var(--md-error)]/10 border border-[var(--md-error)]/20 px-4 py-3 text-sm text-[var(--md-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-xs text-[var(--md-muted)] hover:text-[var(--md-primary)] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={isSubmitting} className="mt-1">
          Log in
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[var(--md-border)]" />
        <span className="text-xs text-[var(--md-muted)]">or</span>
        <div className="flex-1 h-px bg-[var(--md-border)]" />
      </div>

      {/* Google Sign-In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[var(--md-border)] bg-white py-3 px-4 text-sm font-medium text-[var(--md-text)] hover:bg-[var(--md-bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Connecting…" : "Continue with Google"}
      </button>

      <p className="text-center text-sm text-[var(--md-muted)] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register/age" className="text-[var(--md-primary)] font-medium hover:underline">
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
