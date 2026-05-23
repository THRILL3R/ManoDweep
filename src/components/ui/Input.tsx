"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--md-text)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border px-4 py-3 text-base bg-white text-[var(--md-text)] placeholder-[var(--md-muted)] outline-none transition-all
            ${error
              ? "border-[var(--md-error)] focus:ring-2 focus:ring-[var(--md-error)]/30"
              : "border-[var(--md-border)] focus:border-[var(--md-primary)] focus:ring-2 focus:ring-[var(--md-primary)]/20"
            } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--md-error)] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
