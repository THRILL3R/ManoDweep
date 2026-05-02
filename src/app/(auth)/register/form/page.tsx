"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, registerGoogleSchema, type RegisterInput } from "@/lib/validations";
import { AuthCard } from "@/components/ui/AuthCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function GenderPicker({
  value,
  onChange,
  error,
}: {
  value?: string;
  onChange: (v: "boy" | "girl") => void;
  error?: string;
}) {
  const options: { value: "boy" | "girl"; label: string; emoji: string }[] = [
    { value: "boy",  label: "Boy",  emoji: "🧒" },
    { value: "girl", label: "Girl", emoji: "👧" },
  ];

  return (
    <div>
      <p className="text-sm font-medium text-[var(--md-text)] mb-2">Your island character</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-3 transition-all duration-150",
                selected
                  ? "border-[var(--md-primary)] bg-[var(--md-primary)]/8"
                  : "border-[var(--md-border)] bg-[var(--md-surface)] hover:border-[var(--md-primary)]/50",
              ].join(" ")}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className={`text-sm font-semibold ${selected ? "text-[var(--md-primary)]" : "text-[var(--md-text)]"}`}>
                {opt.label}
              </span>
              {selected && <span className="w-2 h-2 rounded-full bg-[var(--md-primary)]" />}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-[var(--md-error)]">{error}</p>}
    </div>
  );
}

export default function RegisterFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGoogle = searchParams.get("google") === "1";
  const prefillEmail = searchParams.get("email") ?? "";
  const prefillName = searchParams.get("name") ?? "";
  const googleId = searchParams.get("gid") ?? "";

  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("reg_dob") || !sessionStorage.getItem("reg_consent_at")) {
      router.replace("/register/age");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(isGoogle ? (registerGoogleSchema as never) : registerSchema),
    defaultValues: { name: prefillName, email: prefillEmail },
  });

  const genderValue = watch("gender");

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    const dob = sessionStorage.getItem("reg_dob");
    const consentAt = sessionStorage.getItem("reg_consent_at");
    const payload = isGoogle
      ? { ...data, dob, consentAt, googleId }
      : { ...data, dob, consentAt };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    sessionStorage.removeItem("reg_dob");
    sessionStorage.removeItem("reg_consent_at");
    router.push("/login?registered=true");
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold text-[var(--md-text)] mb-1">Create your account</h1>
      <p className="text-sm text-[var(--md-muted)] mb-8">Your island awaits.</p>

      {serverError && (
        <div className="mb-6 rounded-xl bg-[var(--md-error)]/10 border border-[var(--md-error)]/20 px-4 py-3 text-sm text-[var(--md-error)]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Input label="First name" type="text" placeholder="Your name" autoComplete="given-name"
          error={errors.name?.message} {...register("name")} />

        <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email"
          readOnly={isGoogle} error={errors.email?.message} {...register("email")} />

        <Input label="Phone number" type="tel" placeholder="+91 98765 43210" autoComplete="tel"
          error={errors.phone?.message} {...register("phone")} />

        <GenderPicker
          value={genderValue}
          onChange={(v) => setValue("gender", v, { shouldValidate: true })}
          error={(errors as { gender?: { message?: string } }).gender?.message}
        />

        {!isGoogle && (
          <>
            <Input label="Password" type="password" placeholder="Min. 8 characters"
              autoComplete="new-password" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm password" type="password" placeholder="Repeat your password"
              autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          </>
        )}

        <Button type="submit" loading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--md-muted)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--md-primary)] font-medium hover:underline">Log in</Link>
      </p>
    </AuthCard>
  );
}
