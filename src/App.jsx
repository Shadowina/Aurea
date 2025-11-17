import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import './index.css'
import Auth from './components/auth.jsx'
import MoodEntryForm from './components/MoodEntryForm.jsx'
import MoodTimeline from './components/MoodTimeline.jsx'
import FavoritesGallery from './components/FavoritesGallery.jsx'
import { useMoods } from './context/MoodContext.jsx'
import { auth } from './config/firebase.js'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showComposer, setShowComposer] = useState(false)
  const { entries } = useMoods()
  const totalEntries = entries.length

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const heroCopy = useMemo(() => {
    if (totalEntries === 0) return 'Begin your first entry to paint how today feels.'
    if (totalEntries === 1) return 'Lovely start. Come back tomorrow to spot a pattern.'
    return `You have ${totalEntries} logged days. Keep tracing how you move through the world.`
  }, [totalEntries])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/20 text-3xl animate-pulse">
              ✨
            </span>
          </div>
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth page if user is not signed in
  if (!user) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-surface/95">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal/20 text-xl text-teal">
              ✨
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">MoodBoardMe</p>
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
                  <div className="h-8 w-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-semibold">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-slate-600 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
              )}
              <button
                onClick={() => signOut(auth)}
                className="text-xs font-medium text-slate-600 hover:text-midnight transition px-3 py-2 rounded-full hover:bg-slate-100/70"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 lg:flex-row">
        <aside className="hidden w-72 flex-col gap-6 lg:flex">
          <div className="card border border-white/70 px-6 py-6 shadow-soft">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Your vibe</p>
            <p className="mt-4 text-base text-slate-600">{heroCopy}</p>
            <div className="mt-6 rounded-2xl bg-slate-100/70 px-4 py-4 text-sm text-slate-500">
              Upcoming: mood streaks & reflection prompts.
            </div>
          </div>
          <div className="card border border-white/70 px-6 py-6 shadow-soft">
            <p className="text-sm font-semibold text-midnight">Quick filters</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>#gratitude</li>
              <li>#family</li>
              <li>#creative</li>
              <li>#calm</li>
            </ul>
          </div>
        </aside>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10">
          <div className="card flex items-center gap-3 border border-white/70 px-6 py-5 shadow-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-2xl">
              🙂
            </span>
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="flex-1 rounded-full border border-neutral/60 bg-white/70 px-4 py-3 text-left text-sm text-slate-500 transition hover:border-teal hover:bg-white hover:text-midnight"
            >
              Log a new mood…
            </button>
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="btn btn-primary hidden sm:inline-flex"
            >
              Share update
            </button>
          </div>
          <MoodTimeline />
          <div className="xl:hidden">
            <FavoritesGallery />
          </div>
        </main>

        <aside className="hidden w-80 flex-col gap-6 xl:flex">
          <FavoritesGallery variant="compact" />
        </aside>
      </div>

      <button
        type="button"
        onClick={() => setShowComposer(true)}
        className="btn btn-primary fixed bottom-6 right-6 z-40 shadow-soft sm:hidden"
      >
        Log mood
      </button>

      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 backdrop-blur-sm px-4 py-10">
          <div className="w-full max-w-xl">
            <MoodEntryForm onClose={() => setShowComposer(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
