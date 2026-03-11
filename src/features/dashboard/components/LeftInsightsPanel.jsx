export default function LeftInsightsPanel({
  heroCopy,
  quickTags = [],
  selectedTags = [],
  onToggleTag,
  onClearFilters,
}) {
  const hasActiveFilters = selectedTags.length > 0

  return (
    <aside className="hidden w-72 flex-col gap-6 lg:flex">
      <div className="card border border-white/70 px-6 py-6 shadow-soft">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Your vibe</p>
        <p className="mt-4 text-base text-slate-600">{heroCopy}</p>
        <div className="mt-6 rounded-2xl bg-slate-100/70 px-4 py-4 text-sm text-slate-500">
          Upcoming: mood streaks & reflection prompts.
        </div>
      </div>
      <div className="card border border-white/70 px-6 py-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-midnight">Quick filters</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-slate-500 transition hover:text-midnight"
            >
              Clear
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickTags.map((tag) => {
            const isActive = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag?.(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-teal text-white shadow-soft'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-white hover:text-midnight'
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
