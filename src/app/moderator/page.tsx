// Moderator Dashboard — Phase 1A placeholder
// Functional from Phase 3A (Fair + School management)
export default function ModeratorDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--md-bg)] px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-[var(--md-primary)]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="rgba(74,124,89,0.6)" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(74,124,89,0.4)" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(74,124,89,0.4)" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="rgba(74,124,89,0.6)" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[var(--md-text)] mb-2">Moderator Dashboard</h1>
        <p className="text-sm text-[var(--md-muted)] leading-relaxed">
          Content management tools will be available here from Phase 3A. Check back soon.
        </p>
      </div>
    </div>
  );
}
