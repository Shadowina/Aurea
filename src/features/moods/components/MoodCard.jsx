import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import SpotifyEmbed from './SpotifyEmbed.jsx';
import { getMoodById } from '../../../constants/moods.js';
import { resolveEntryTimestamp } from '../../insights/utils/dateKeys.js';
import { useMoods } from '../../../context/useMoods.js';

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

function MoodCard({ entry, onEdit }) {
  const { t } = useTranslation();
  const { toggleFavorite, removeEntry } = useMoods();
  const moodMeta = useMemo(() => getMoodById(entry.moodId), [entry.moodId]);
  const displayTime = resolveEntryTimestamp(entry) || entry.dateTime;
  const [isMutating, setIsMutating] = useState(false);
  const [actionError, setActionError] = useState('');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const handleToggleFavorite = async () => {
    setIsMutating(true);
    setActionError('');
    try {
      await toggleFavorite(entry.id);
    } catch (error) {
      setActionError(error?.message || t('moodCard.favoriteError'));
    } finally {
      setIsMutating(false);
    }
  };

  const handleRemoveClick = () => {
    setActionError('');
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = async () => {
    setIsMutating(true);
    setActionError('');
    try {
      await removeEntry(entry.id);
      setRemoveDialogOpen(false);
    } catch (error) {
      setRemoveDialogOpen(false);
      setActionError(error?.message || t('moodCard.removeError'));
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <article
      className="card relative overflow-hidden border border-white/60 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80"
    >
      <div 
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          background: `linear-gradient(135deg, ${entry.color}1a 0%, rgba(248, 247, 244, 0.92) 55%)`,
        }}
      />
      <div 
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          background: `linear-gradient(135deg, ${entry.color}20 0%, rgba(31, 41, 51, 0) 55%)`,
        }}
      />
      <div className="relative z-10 flex flex-col gap-6 px-6 py-6 sm:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-2xl shadow-inner dark:bg-slate-800/80 dark:shadow-none"
              style={{ color: moodMeta?.swatch ?? entry.color }}
            >
              {entry.emoji}
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {formatDisplayDate(displayTime)}
              </p>
              <h3 className="text-lg font-semibold text-midnight dark:text-slate-100">{entry.moodLabel}</h3>
            </div>
          </div>

          <button
            onClick={handleToggleFavorite}
            disabled={isMutating}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              entry.favorite ? 'bg-teal text-white shadow-soft' : 'bg-white/80 text-slate-500 hover:bg-white dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
            type="button"
            aria-label={entry.favorite ? t('moodCard.removeFavoriteAria') : t('moodCard.addFavoriteAria')}
            aria-pressed={entry.favorite}
          >
            <span aria-hidden="true">{entry.favorite ? '★' : '☆'}</span>{' '}
            {entry.favorite ? t('moodCard.favorited') : t('moodCard.favorite')}
          </button>
        </header>

        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">{entry.note}</p>

        {entry.imageData && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={entry.imageData}
              alt={t('moodCard.moodAttachment')}
              className="h-64 w-full object-cover"
            />
          </div>
        )}

        {entry.spotifyLink && <SpotifyEmbed spotifyUrl={entry.spotifyLink} />}

        <footer className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {entry.tags?.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {entry.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
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
              className="rounded-full bg-midnight/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-midnight dark:bg-slate-100 dark:text-midnight dark:hover:bg-white"
            >
              {t('moodCard.listenSpotify')}
            </a>
          )}

          <div className="ml-auto flex items-center gap-2">
            {typeof onEdit === 'function' && (
              <button
                type="button"
                disabled={isMutating}
                onClick={() => onEdit(entry)}
                className="rounded-full px-3 py-1 text-xs uppercase tracking-wide text-slate-500 transition hover:bg-white/80 hover:text-midnight dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label={t('moodCard.editAria')}
              >
                {t('moodCard.edit')}
              </button>
            )}
            <button
              type="button"
              disabled={isMutating}
              onClick={handleRemoveClick}
              className="rounded-full px-3 py-1 text-xs uppercase tracking-wide text-slate-400 transition hover:bg-white/80 hover:text-midnight dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              aria-label={t('moodCard.removeAria')}
            >
              {t('moodCard.remove')}
            </button>
          </div>
        </footer>
        {actionError && <p className="text-sm text-peach">{actionError}</p>}
      </div>

      <ConfirmDialog
        open={removeDialogOpen}
        onClose={() => !isMutating && setRemoveDialogOpen(false)}
        title={t('moodCard.removeTitle')}
        message={t('moodCard.removeMessage')}
        confirmLabel={t('moodCard.removeConfirm')}
        cancelLabel={t('moodCard.removeCancel')}
        variant="danger"
        confirmBusy={isMutating}
        onConfirm={handleConfirmRemove}
      />
    </article>
  );
}

export default memo(MoodCard);
