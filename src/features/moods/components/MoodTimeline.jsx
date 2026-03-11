import { useMemo } from 'react';
import MoodCard from './MoodCard.jsx';
import { useMoods } from '../../../context/MoodContext.jsx';

const formatDay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export default function MoodTimeline({
  searchQuery,
  onSearchQueryChange,
  showFavoritesOnly,
  onShowFavoritesOnlyChange,
  selectedTags = [],
}) {
  const { entries, loading, error } = useMoods();

  const filteredEntries = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();
    const normalizedSelectedTags = selectedTags.map((tag) => tag.toLowerCase());

    return entries
      .filter((entry) => (showFavoritesOnly ? entry.favorite : true))
      .filter((entry) => {
        if (normalizedSelectedTags.length === 0) return true;
        const tags = (entry.tags ?? []).map((tag) => String(tag).toLowerCase());
        return normalizedSelectedTags.every((tag) => tags.includes(tag));
      })
      .filter((entry) => {
        if (!lowerQuery) return true;
        const haystack = [entry.note, entry.tags?.join(' '), entry.moodLabel]
          .join(' ')
          .toLowerCase();
        return haystack.includes(lowerQuery);
      })
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }, [entries, searchQuery, showFavoritesOnly, selectedTags]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Timeline</p>
          <h2 className="text-2xl font-semibold text-midnight">Mood history</h2>
         
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search notes or tags"
            className="rounded-full border border-neutral bg-white/70 px-5 py-2 text-sm text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          <label className="flex items-center gap-2 text-sm font-medium text-midnight">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-neutral text-teal focus:ring-teal/40"
              checked={showFavoritesOnly}
              onChange={(event) => onShowFavoritesOnlyChange(event.target.checked)}
            />
            Favorites only
          </label>
        </div>
      </header>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="card border border-white/70 px-6 py-12 text-center text-slate-500">
          <p className="text-lg font-medium text-midnight">Loading entries...</p>
          <p className="text-sm text-slate-500">Fetching your mood timeline.</p>
        </div>
      ) : error ? (
        <div className="card border border-peach/40 bg-peach/5 px-6 py-8 text-center text-slate-600">
          <p className="text-lg font-medium text-midnight">Could not load entries</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="card border border-dashed border-neutral/70 px-6 py-12 text-center text-slate-500">
          <p className="text-lg font-medium text-midnight">
            {searchQuery || showFavoritesOnly || selectedTags.length > 0 ? 'No matching entries' : 'No entries yet'}
          </p>
          <p className="text-sm text-slate-500">
            {searchQuery || showFavoritesOnly || selectedTags.length > 0
              ? 'Try changing your filters or search query.'
              : 'Once you log moods, they will appear here with the most recent at the top.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {formatDay(entry.dateTime)}
              </p>
              <MoodCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
