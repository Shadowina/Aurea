import { useMemo } from 'react';
import { getMoodById } from '../constants/moods.js';
import { useMoods } from '../context/MoodContext.jsx';

const formatDisplayDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function MoodCard({ entry }) {
  const { toggleFavorite, removeEntry } = useMoods();
  const moodMeta = useMemo(() => getMoodById(entry.moodId), [entry.moodId]);

  return (
    <article
      className="card relative overflow-hidden border border-white/60 transition hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${entry.color}1a 0%, rgba(248, 247, 244, 0.92) 55%)`,
      }}
    >
      <div className="flex flex-col gap-6 px-6 py-6 sm:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-inner"
              style={{ color: moodMeta?.swatch ?? entry.color }}
            >
              {entry.emoji}
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">
                {formatDisplayDate(entry.dateTime)}
              </p>
              <h3 className="text-lg font-semibold text-midnight">{entry.moodLabel}</h3>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(entry.id)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              entry.favorite ? 'bg-teal text-white shadow-soft' : 'bg-white/80 text-slate-500 hover:bg-white'
            }`}
            type="button"
          >
            {entry.favorite ? '★ Favorited' : '☆ Favorite'}
          </button>
        </header>

        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">{entry.note}</p>

        {entry.imageData && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={entry.imageData}
              alt="Mood attachment"
              className="h-64 w-full object-cover"
            />
          </div>
        )}

        <footer className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {entry.tags?.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {entry.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}

          {entry.spotifyLink && (
            <a
              href={entry.spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-midnight/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-midnight"
            >
              Listen on Spotify
            </a>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => removeEntry(entry.id)}
              className="rounded-full px-3 py-1 text-xs uppercase tracking-wide text-slate-400 transition hover:bg-white/80 hover:text-midnight"
            >
              Remove
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}

