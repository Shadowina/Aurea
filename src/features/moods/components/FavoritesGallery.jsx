import MoodCard from './MoodCard.jsx';
import { useMoods } from '../../../context/MoodContext.jsx';

export default function FavoritesGallery({ variant = 'grid' }) {
  const { favorites, loading, error } = useMoods();

  if (variant === 'compact') {
    return (
      <section className="card border border-white/70 px-6 py-6">
        <header className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Highlights</p>
            <h2 className="text-lg font-semibold text-midnight">Saved moments</h2>
          </div>
          <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">
            {favorites.length}
          </span>
        </header>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading highlights...</p>
        ) : error ? (
          <p className="mt-6 rounded-xl border border-peach/40 bg-peach/5 px-3 py-2 text-sm text-slate-600">
            {error}
          </p>
        ) : favorites.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            Tap the star on any entry to start a highlight reel.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {favorites.slice(0, 6).map((entry) => (
              <li key={entry.id} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-xl shadow-inner">
                  {entry.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-midnight">{entry.moodLabel}</p>
                  <p className="line-clamp-2 text-xs text-slate-500">{entry.note}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Highlights</p>
        <h2 className="text-2xl font-semibold text-midnight">Saved moments</h2>
        
      </header>

      {loading ? (
        <div className="card border border-white/70 px-6 py-12 text-center text-slate-500">
          <p className="text-lg font-medium text-midnight">Loading favorites...</p>
          <p className="text-sm text-slate-500">Fetching your saved moments.</p>
        </div>
      ) : error ? (
        <div className="card border border-peach/40 bg-peach/5 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium text-midnight">Could not load favorites</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="card border border-dashed border-neutral/70 px-6 py-12 text-center text-slate-500">
          <p className="text-lg font-medium text-midnight">No favorites yet</p>
          <p className="text-sm text-slate-500">
            Tap the star on any mood entry to add it to your highlights.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {favorites.map((entry) => (
            <MoodCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
