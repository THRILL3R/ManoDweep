// Admin Dashboard — Phase 1A placeholder
// Functional from Phase 4A (Admin controls)
export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--md-bg)] px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-[var(--md-primary)]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" fill="rgba(74,124,89,0.6)" />
            <path d="M4 19c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="rgba(74,124,89,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="19" cy="6" r="2" fill="rgba(74,124,89,0.4)" />
            <circle cx="5" cy="6" r="2" fill="rgba(74,124,89,0.4)" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--md-text)] mb-2">Admin Dashboard</h1>
        <p className="text-sm text-[var(--md-muted)] leading-relaxed">
          User management and platform controls will be available here from Phase 4A. Check back soon.
        </p>
      </div>
    </div>
  );
}
