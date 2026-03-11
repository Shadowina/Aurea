export default function AppHeader({ user, totalEntries, onSignOut }) {
  const handleSignOutClick = () => {
    const shouldSignOut = window.confirm('Are you sure you want to sign out?')
    if (!shouldSignOut) return
    onSignOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal/20 text-xl text-teal">
            ✨
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Aurea</p>
            <h1 className="text-xl font-semibold text-midnight">Share how your day feels</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100/70 px-4 py-2 text-xs font-medium text-slate-500 sm:flex">
            <span className="rounded-full bg-white px-3 py-1 text-slate-600">Entries</span>
            <span className="text-slate-700">{totalEntries}</span>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/20 text-sm font-semibold text-teal">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[120px] truncate text-xs text-slate-600">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleSignOutClick}
              className="rounded-full px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100/70 hover:text-midnight"
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
