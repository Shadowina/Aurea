import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MoodCard from './MoodCard.jsx';
import { resolveEntryTimestamp } from '../../insights/utils/dateKeys.js';
import { useMoods } from '../../../context/useMoods.js';

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
  onEditEntry,
}) {
  const { t } = useTranslation();
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
      .sort((a, b) => {
        const tb = resolveEntryTimestamp(b);
        const ta = resolveEntryTimestamp(a);
        return new Date(tb || 0) - new Date(ta || 0);
      });
  }, [entries, searchQuery, showFavoritesOnly, selectedTags]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{t('timeline.label')}</p>
          <h2 className="text-2xl font-semibold text-midnight dark:text-slate-100">{t('timeline.title')}</h2>
         
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={t('timeline.searchPlaceholder')}
            className="rounded-full border border-neutral bg-white/70 px-5 py-2 text-sm text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <label className="flex items-center gap-2 text-sm font-medium text-midnight dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-neutral text-teal focus:ring-teal/40 dark:border-slate-600 dark:bg-slate-900/60"
              checked={showFavoritesOnly}
              onChange={(event) => onShowFavoritesOnlyChange(event.target.checked)}
            />
            {t('timeline.favoritesOnly')}
          </label>
        </div>
      </header>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal dark:bg-teal/25 dark:text-teal-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div
          className="card border border-white/70 px-6 py-12 dark:border-slate-700/80"
          role="status"
          aria-busy="true"
          aria-label="Loading mood timeline"
        >
          <div className="mx-auto max-w-md space-y-4">
            <div className="h-5 w-48 rounded-lg bg-slate-200/90 dark:bg-slate-700/90">
              <div className="h-full w-full animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full rounded-md bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/60" />
              </div>
              <div className="h-4 w-[88%] rounded-md bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/60" />
              </div>
              <div className="h-4 w-[72%] rounded-md bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full animate-pulse rounded-md bg-slate-200/60 dark:bg-slate-700/60" />
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">{t('timeline.fetching')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="card border border-peach/40 bg-peach/5 px-6 py-8 text-center text-slate-600 dark:border-peach/30 dark:bg-peach/10 dark:text-slate-300">
          <p className="text-lg font-medium text-midnight dark:text-slate-200">{t('timeline.couldNotLoad')}</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="card border border-dashed border-neutral/70 px-6 py-12 text-center text-slate-500 dark:border-slate-700/80 dark:text-slate-400">
          <p className="text-lg font-medium text-midnight dark:text-slate-200">
            {searchQuery || showFavoritesOnly || selectedTags.length > 0 ? t('timeline.noMatching') : t('timeline.noEntriesYet')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchQuery || showFavoritesOnly || selectedTags.length > 0 ? t('timeline.tryFilters') : t('timeline.emptyHint')}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {formatDay(resolveEntryTimestamp(entry))}
              </p>
              <MoodCard entry={entry} onEdit={onEditEntry} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
