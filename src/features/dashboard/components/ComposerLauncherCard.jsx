export default function ComposerLauncherCard({ onOpenComposer }) {
  return (
    <div className="card flex items-center gap-3 border border-white/70 px-6 py-5 shadow-soft">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-2xl">🙂</span>
      <button
        type="button"
        onClick={onOpenComposer}
        className="flex-1 rounded-full border border-neutral/60 bg-white/70 px-4 py-3 text-left text-sm text-slate-500 transition hover:border-teal hover:bg-white hover:text-midnight"
      >
        Log a new mood...
      </button>
      <button type="button" onClick={onOpenComposer} className="btn btn-primary hidden sm:inline-flex">
        Share update
      </button>
    </div>
  )
}
