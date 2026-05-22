import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div className={`auth-bg flex flex-col items-center justify-center min-h-screen px-4 py-12 ${className}`}>
      {/* Decorative island silhouette */}
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

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[var(--md-border)] px-8 py-10">
        {children}
      </div>
    </div>
  );
}
